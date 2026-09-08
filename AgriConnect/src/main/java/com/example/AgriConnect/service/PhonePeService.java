package com.example.AgriConnect.service;

import com.example.AgriConnect.dto.response.OrderResponse;
import com.example.AgriConnect.dto.response.PhonePeInitiateResponse;
import com.example.AgriConnect.entity.Order;
import com.example.AgriConnect.entity.OrderStatus;
import com.example.AgriConnect.exception.ApiException;
import com.example.AgriConnect.exception.ResourceNotFoundException;
import com.example.AgriConnect.repository.CartRepository;
import com.example.AgriConnect.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PhonePeService {

    @Value("${phonepe.merchant-id}")
    private String merchantId;

    @Value("${phonepe.salt-key}")
    private String saltKey;

    @Value("${phonepe.salt-index}")
    private String saltIndex;

    @Value("${phonepe.host}")
    private String host;

    @Value("${phonepe.redirect-url}")
    private String redirectUrl;

    // Same reasoning as PaymentService.warnIfTestKey — sandbox is a valid
    // default for dev/staging, this just guarantees it's never silently
    // still pointing at sandbox in what's meant to be production.
    @jakarta.annotation.PostConstruct
    private void warnIfSandbox() {
        if (host != null && host.contains("preprod")) {
            org.slf4j.LoggerFactory.getLogger(PhonePeService.class)
                    .warn("PhonePe is configured against the SANDBOX host ({}) — " +
                            "set PHONEPE_HOST to the production endpoint before going live.", host);
        }
        if (redirectUrl != null && redirectUrl.contains("localhost")) {
            org.slf4j.LoggerFactory.getLogger(PhonePeService.class)
                    .warn("PhonePe redirect/callback URLs still point at localhost — " +
                            "set PHONEPE_REDIRECT_URL/PHONEPE_CALLBACK_URL to your real domain before going live.");
        }
    }

    @Value("${phonepe.callback-url}")
    private String callbackUrl;

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final HttpClient httpClient = HttpClient.newHttpClient();

    /**
     * Starts a PhonePe payment. Unlike Razorpay (popup modal), PhonePe is a
     * full-page redirect flow — the frontend sends the buyer's browser to
     * the returned redirectUrl instead of opening anything client-side.
     */
    public PhonePeInitiateResponse initiatePayment(Long orderId, String requesterEmail) {

        if (merchantId == null || merchantId.isBlank() || saltKey == null || saltKey.isBlank()) {
            throw new ApiException("PhonePe is not configured yet — set PHONEPE_MERCHANT_ID and PHONEPE_SALT_KEY");
        }

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (!order.getBuyer().getEmail().equalsIgnoreCase(requesterEmail)) {
            throw new ApiException("You are not allowed to pay for this order");
        }

        if (order.isPaid()) {
            throw new ApiException("Order is already paid");
        }

        // PhonePe doesn't hand us a transaction id like Razorpay does —
        // we generate one and it becomes our reference for this payment.
        String merchantTransactionId = "MT" + UUID.randomUUID().toString().replace("-", "").substring(0, 30);
        long amountInPaise = Math.round(order.getTotalPrice() * 100);

        JSONObject payload = new JSONObject();
        payload.put("merchantId", merchantId);
        payload.put("merchantTransactionId", merchantTransactionId);
        payload.put("merchantUserId", "U" + order.getBuyer().getId());
        payload.put("amount", amountInPaise);
        payload.put("redirectUrl", redirectUrl + "?txnId=" + merchantTransactionId);
        payload.put("redirectMode", "REDIRECT");
        payload.put("callbackUrl", callbackUrl);

        JSONObject instrument = new JSONObject();
        instrument.put("type", "PAY_PAGE");
        payload.put("paymentInstrument", instrument);

        String base64Payload = Base64.getEncoder().encodeToString(
                payload.toString().getBytes(StandardCharsets.UTF_8));

        String endpoint = "/pg/v1/pay";
        String checksum = sha256(base64Payload + endpoint + saltKey) + "###" + saltIndex;

        JSONObject requestBody = new JSONObject();
        requestBody.put("request", base64Payload);

        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(host + endpoint))
                    .header("Content-Type", "application/json")
                    .header("X-VERIFY", checksum)
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody.toString()))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            JSONObject responseJson = new JSONObject(response.body());

            if (!responseJson.optBoolean("success", false)) {
                throw new ApiException("PhonePe rejected the payment request: "
                        + responseJson.optString("message", "unknown error"));
            }

            String pgRedirectUrl = responseJson
                    .getJSONObject("data")
                    .getJSONObject("instrumentResponse")
                    .getJSONObject("redirectInfo")
                    .getString("url");

            order.setPhonepeTransactionId(merchantTransactionId);
            order.setPaymentMethod("PHONEPE");
            orderRepository.save(order);

            return PhonePeInitiateResponse.builder()
                    .merchantTransactionId(merchantTransactionId)
                    .redirectUrl(pgRedirectUrl)
                    .build();

        } catch (ApiException e) {
            throw e;
        } catch (Exception e) {
            throw new ApiException("Unable to reach PhonePe: " + e.getMessage());
        }
    }

    /**
     * Confirms payment status directly with PhonePe (never trust the
     * redirect/callback body alone — always re-check server-to-server).
     * Called both by the callback PhonePe hits, and by the frontend after
     * the buyer is redirected back, so either path reaches the same
     * verified outcome.
     */
    @Transactional
    public OrderResponse confirmPayment(String merchantTransactionId) {

        Order order = orderRepository.findByPhonepeTransactionId(merchantTransactionId)
                .orElseThrow(() -> new ResourceNotFoundException("No order found for this transaction"));

        if (order.isPaid()) {
            return mapToResponse(order);
        }

        String endpoint = "/pg/v1/status/" + merchantId + "/" + merchantTransactionId;
        String checksum = sha256(endpoint + saltKey) + "###" + saltIndex;

        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(host + endpoint))
                    .header("Content-Type", "application/json")
                    .header("X-VERIFY", checksum)
                    .header("X-MERCHANT-ID", merchantId)
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            JSONObject responseJson = new JSONObject(response.body());

            String state = responseJson.optJSONObject("data") != null
                    ? responseJson.getJSONObject("data").optString("state", "")
                    : "";

            if (!"COMPLETED".equals(state)) {
                throw new ApiException("Payment not completed — status: "
                        + (state.isBlank() ? responseJson.optString("code", "unknown") : state));
            }

            String pgTransactionId = responseJson.getJSONObject("data").optString("transactionId", merchantTransactionId);

            order.setPaid(true);
            order.setPaymentId(pgTransactionId);
            order.setStatus(OrderStatus.CONFIRMED);
            Order saved = orderRepository.save(order);

            // Cart rows for this order's items were already removed at
            // checkout() time (see OrderService) — nothing left to clear here.

            return mapToResponse(saved);

        } catch (ApiException e) {
            throw e;
        } catch (Exception e) {
            throw new ApiException("Unable to verify payment with PhonePe: " + e.getMessage());
        }
    }

    /**
     * Handles PhonePe's server-to-server callback. We verify the X-VERIFY
     * header matches what PhonePe should have sent (proves the callback
     * really came from PhonePe), then still re-check status via
     * confirmPayment() rather than trusting the callback body's state —
     * a callback can be replayed or forged if the checksum weren't checked,
     * so the checksum is what actually protects us here.
     */
    @Transactional
    public void handleCallback(String base64Response, String xVerifyHeader) {

        String expectedChecksum = sha256(base64Response + saltKey) + "###" + saltIndex;
        if (xVerifyHeader == null || !xVerifyHeader.equals(expectedChecksum)) {
            throw new ApiException("Invalid PhonePe callback signature");
        }

        String decoded = new String(Base64.getDecoder().decode(base64Response), StandardCharsets.UTF_8);
        JSONObject payload = new JSONObject(decoded);
        String merchantTransactionId = payload.getJSONObject("data").getString("merchantTransactionId");

        confirmPayment(merchantTransactionId);
    }

    private String sha256(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            StringBuilder hex = new StringBuilder();
            for (byte b : hash) {
                String h = Integer.toHexString(0xff & b);
                if (h.length() == 1) hex.append('0');
                hex.append(h);
            }
            return hex.toString();
        } catch (Exception e) {
            throw new ApiException("Checksum generation failed: " + e.getMessage());
        }
    }

    private OrderResponse mapToResponse(Order order) {

        List<OrderResponse.OrderItemResponse> items = order.getItems() == null
                ? List.of()
                : order.getItems().stream()
                    .map(i -> OrderResponse.OrderItemResponse.builder()
                            .productId(i.getProduct().getId())
                            .productName(i.getProduct().getProductName())
                            .quantity(i.getQuantity())
                            .price(i.getPrice())
                            .build())
                    .toList();

        return OrderResponse.builder()
                .id(order.getId())
                .status(order.getStatus().name())
                .paid(order.isPaid())
                .paymentMethod(order.getPaymentMethod())
                .totalPrice(order.getTotalPrice())
                .buyerName(order.getBuyer().getName())
                .paymentId(order.getPaymentId())
                .createdAt(order.getCreatedAt())
                .items(items)
                .build();
    }
}

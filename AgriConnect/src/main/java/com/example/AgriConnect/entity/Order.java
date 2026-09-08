package com.example.AgriConnect.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    private String invoiceUrl;

    private String couponCode;

    private Double discount;

    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User buyer;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> items;

    private Double totalPrice;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    private boolean paid;

    private String paymentId;

    // "ONLINE" (Razorpay — card/UPI/netbanking) or "COD" (cash on delivery)
    private String paymentMethod;

    // Gateway order id returned when the Razorpay order is created.
    // Needed so verifyPayment() can confirm the signature belongs to THIS order
    // instead of trusting whatever razorpay_order_id the client sends.
    private String razorpayOrderId;

    // PhonePe's "merchantTransactionId" — we generate this ourselves (it's
    // not returned by PhonePe like Razorpay's order id is), and check the
    // callback/status-check against it the same way razorpayOrderId is used.
    private String phonepeTransactionId;

    // Delivery address — captured at checkout. Stored on the order (not
    // just read from the buyer's profile) so it stays accurate even if the
    // buyer's saved address later changes.
    private String deliveryName;
    private String deliveryPhone;
    private String deliveryAddressLine;
    private String deliveryCity;
    private String deliveryState;
    private String deliveryPincode;

    // Shipment tracking — set by the farmer once the order is dispatched.
    private String carrier;
    private String trackingNumber;
    private String trackingUrl;
    private java.time.LocalDate expectedDeliveryDate;
    private LocalDateTime deliveredAt;
}
package com.example.AgriConnect.service;

import com.example.AgriConnect.dto.response.CartResponse;
import com.example.AgriConnect.entity.Cart;
import com.example.AgriConnect.entity.Product;
import com.example.AgriConnect.entity.User;
import com.example.AgriConnect.exception.ApiException;
import com.example.AgriConnect.repository.CartRepository;
import com.example.AgriConnect.repository.ProductRepository;
import com.example.AgriConnect.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    // =========================
    // ADD TO CART
    // =========================
    public CartResponse addToCart(Long productId, Double qty, String email) {

        if (qty <= 0) throw new ApiException("Quantity must be greater than 0");

        User buyer = getUser(email);
        Cart cart = cartRepository.findByBuyerIdAndProductId(buyer.getId(), productId).orElse(null);

        if (cart != null) {
            cart.setQuantity(cart.getQuantity() + qty);
            return mapToResponse(cartRepository.save(cart));
        }

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ApiException("Product not found"));

        Cart newCart = Cart.builder()
                .buyer(buyer)
                .product(product)
                .quantity(qty)
                .build();

        return mapToResponse(cartRepository.save(newCart));
    }

    // =========================
    // GET CART
    // =========================
    public List<CartResponse> getCart(String email) {
        User user = getUser(email);
        return cartRepository.findByBuyerId(user.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // =========================
    // UPDATE CART ITEM QUANTITY
    // =========================
    public CartResponse updateQuantity(Long productId, Double qty, String email) {

        if (qty <= 0) throw new ApiException("Quantity must be greater than 0");

        User buyer = getUser(email);
        Cart cart = cartRepository.findByBuyerIdAndProductId(buyer.getId(), productId)
                .orElseThrow(() -> new ApiException("Item not in cart"));

        cart.setQuantity(qty);
        return mapToResponse(cartRepository.save(cart));
    }

    // =========================
    // REMOVE CART ITEM
    // =========================
    public void removeFromCart(Long productId, String email) {

        User buyer = getUser(email);
        Cart cart = cartRepository.findByBuyerIdAndProductId(buyer.getId(), productId)
                .orElseThrow(() -> new ApiException("Item not in cart"));

        cartRepository.delete(cart);
    }

    // =========================
    // HELPER
    // =========================
    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException("User not found"));
    }

    // =========================
    // MAPPER
    // =========================
    private CartResponse mapToResponse(Cart c) {

        Double price = c.getProduct().getPrice().doubleValue();
        Double qty = c.getQuantity();

        return CartResponse.builder()
                .id(c.getId())
                .productId(c.getProduct().getId())
                .productName(c.getProduct().getProductName())
                .price(price)
                .quantity(qty)
                .totalPrice(price * qty)
                .build();
    }
}
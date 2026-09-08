package com.example.AgriConnect.service;

import com.example.AgriConnect.entity.Product;
import com.example.AgriConnect.entity.User;
import com.example.AgriConnect.entity.Wishlist;
import com.example.AgriConnect.exception.ResourceNotFoundException;
import com.example.AgriConnect.repository.ProductRepository;
import com.example.AgriConnect.repository.UserRepository;
import com.example.AgriConnect.repository.WishlistRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public String addToWishlist(Long productId, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Product not found"));

        if (wishlistRepository.findByUserAndProduct(user, product).isPresent()) {
            return "Product already exists in wishlist";
        }

        Wishlist wishlist = Wishlist.builder()
                .user(user)
                .product(product)
                .build();

        wishlistRepository.save(wishlist);

        return "Product added to wishlist";
    }

    public List<Wishlist> getWishlist(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        return wishlistRepository.findByUser(user);
    }

    public String removeWishlist(Long productId, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Product not found"));

        wishlistRepository.deleteByUserAndProduct(user, product);

        return "Product removed from wishlist";
    }
}
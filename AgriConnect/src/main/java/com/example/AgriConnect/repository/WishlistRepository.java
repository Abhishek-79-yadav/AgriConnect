package com.example.AgriConnect.repository;

import com.example.AgriConnect.entity.Product;
import com.example.AgriConnect.entity.User;
import com.example.AgriConnect.entity.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WishlistRepository extends JpaRepository<Wishlist, Long> {

    List<Wishlist> findByUser(User user);

    List<Wishlist> findByUser_Id(Long userId);

    Optional<Wishlist> findByUserAndProduct(User user, Product product);

    void deleteByUserAndProduct(User user, Product product);
}
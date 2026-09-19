package com.example.AgriConnect.controller;

import com.example.AgriConnect.dto.request.ProductRequest;
import com.example.AgriConnect.dto.response.ApiResponse;
import com.example.AgriConnect.dto.response.ProductResponse;
import com.example.AgriConnect.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @PostMapping("/farmer/products")
    public ResponseEntity<ProductResponse> addProduct(@RequestBody ProductRequest request) {
        return ResponseEntity.ok(productService.addProduct(request));
    }

    @GetMapping("/farmer/products")
    public ResponseEntity<List<ProductResponse>> getMyProducts() {
        return ResponseEntity.ok(productService.getFarmerProducts());
    }

    @DeleteMapping("/farmer/products/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {

        productService.deleteProduct(id);

        return ResponseEntity.ok(
                ApiResponse.success("Deleted successfully", null)
        );
    }

    @PutMapping("/farmer/products/{id}/price")
    public ResponseEntity<ProductResponse> updatePrice(
            @PathVariable Long id,
            @RequestParam BigDecimal price) {

        return ResponseEntity.ok(
                productService.updatePrice(id, price)
        );
    }

    @GetMapping("/buyer/products")
    public ResponseEntity<List<ProductResponse>> allProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }
}
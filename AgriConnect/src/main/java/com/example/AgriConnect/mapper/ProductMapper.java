package com.example.AgriConnect.mapper;

import com.example.AgriConnect.dto.response.ProductResponse;
import com.example.AgriConnect.entity.Product;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class ProductMapper {

    public ProductResponse toResponse(Product p){

        return ProductResponse.builder()
                .id(p.getId())
                .productName(p.getProductName())
                .totalPrice(
                        p.getPrice().multiply(BigDecimal.valueOf(p.getQuantity()))
                )
                .quantity(p.getQuantity())
                .unit(p.getUnit().name())
                .crop(
                        p.getCrop()==null ?
                                null :
                                p.getCrop().getName()
                )
                .farmerName(
                        p.getFarmer()==null ?
                                null :
                                p.getFarmer().getName()
                )
                .farmerEmail(
                        p.getFarmer()==null ?
                                null :
                                p.getFarmer().getEmail()
                )
                .videoUrl(p.getVideoUrl())
                .build();
    }
}
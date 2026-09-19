package com.example.AgriConnect.mapper;

import com.example.AgriConnect.dto.response.OrderResponse;
import com.example.AgriConnect.entity.Order;
import org.springframework.stereotype.Component;

@Component
public class OrderMapper {

    public OrderResponse toResponse(Order order){

        return OrderResponse.builder()
                .id(order.getId())
                .status(order.getStatus().name())
                .paid(order.isPaid())
                .totalPrice(order.getTotalPrice())
                .buyerName(order.getBuyer().getName())
                .build();
    }
}
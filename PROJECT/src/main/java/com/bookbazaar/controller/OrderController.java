package com.bookbazaar.controller;

import com.bookbazaar.dto.OrderDto;
import com.bookbazaar.entity.User;
import com.bookbazaar.service.OrderService;
import com.bookbazaar.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;
    private final UserService userService;

    public OrderController(OrderService orderService, UserService userService) {
        this.orderService = orderService;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<OrderDto> placeOrder(@RequestHeader("X-User-Id") Long userId) {
        User currentUser = userService.getUserEntityById(userId);
        OrderDto order = orderService.placeOrder(currentUser);
        return new ResponseEntity<>(order, HttpStatus.CREATED);
    }

    @GetMapping("/history")
    public ResponseEntity<List<OrderDto>> getOrderHistory(@RequestHeader("X-User-Id") Long userId) {
        User currentUser = userService.getUserEntityById(userId);
        List<OrderDto> history = orderService.getOrderHistory(currentUser);
        return ResponseEntity.ok(history);
    }

    @GetMapping
    public ResponseEntity<List<OrderDto>> getAllOrders() {
        List<OrderDto> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }
}

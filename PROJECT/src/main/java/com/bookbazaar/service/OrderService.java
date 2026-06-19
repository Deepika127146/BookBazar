package com.bookbazaar.service;

import com.bookbazaar.dto.OrderDto;
import com.bookbazaar.entity.Book;
import com.bookbazaar.entity.Cart;
import com.bookbazaar.entity.Order;
import com.bookbazaar.entity.User;
import com.bookbazaar.exception.ResourceNotFoundException;
import com.bookbazaar.repository.BookRepository;
import com.bookbazaar.repository.CartRepository;
import com.bookbazaar.repository.OrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final BookRepository bookRepository;

    public OrderService(OrderRepository orderRepository, CartRepository cartRepository, BookRepository bookRepository) {
        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
        this.bookRepository = bookRepository;
    }

    @Transactional
    public OrderDto placeOrder(User currentUser) {
        List<Cart> cartItems = cartRepository.findByUser(currentUser);
        if (cartItems.isEmpty()) {
            throw new IllegalArgumentException("Cannot place order. Shopping cart is empty.");
        }

        double totalAmount = 0.0;

        // Perform stock check and calculate total amount
        for (Cart item : cartItems) {
            Book book = item.getBook();
            if (book.getStock() < item.getQuantity()) {
                throw new IllegalArgumentException("Insufficient stock for book: " + book.getTitle());
            }
            totalAmount += book.getPrice() * item.getQuantity();
        }

        // Deduct stock
        for (Cart item : cartItems) {
            Book book = item.getBook();
            book.setStock(book.getStock() - item.getQuantity());
            bookRepository.save(book);
        }

        // Create Order
        Order order = new Order();
        order.setUser(currentUser);
        order.setTotalAmount(totalAmount);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus("PENDING");

        Order savedOrder = orderRepository.save(order);

        // Clear user's cart
        cartRepository.deleteByUser(currentUser);

        return mapToDto(savedOrder);
    }

    public List<OrderDto> getOrderHistory(User currentUser) {
        List<Order> orders = orderRepository.findByUserOrderByOrderDateDesc(currentUser);
        return orders.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<OrderDto> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        return orders.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private OrderDto mapToDto(Order order) {
        return new OrderDto(
                order.getId(),
                order.getUser().getId(),
                order.getUser().getName(),
                order.getTotalAmount(),
                order.getOrderDate(),
                order.getStatus()
        );
    }
}

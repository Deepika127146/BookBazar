package com.bookbazaar.controller;

import com.bookbazaar.dto.AddToCartRequest;
import com.bookbazaar.dto.CartDto;
import com.bookbazaar.entity.User;
import com.bookbazaar.service.CartService;
import com.bookbazaar.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;
    private final UserService userService;

    public CartController(CartService cartService, UserService userService) {
        this.cartService = cartService;
        this.userService = userService;
    }

    @PostMapping("/add")
    public ResponseEntity<CartDto> addToCart(
            @Valid @RequestBody AddToCartRequest request,
            @RequestHeader("X-User-Id") Long userId
    ) {
        User currentUser = userService.getUserEntityById(userId);
        CartDto item = cartService.addToCart(request, currentUser);
        return new ResponseEntity<>(item, HttpStatus.CREATED);
    }

    @DeleteMapping("/{cartId}")
    public ResponseEntity<Void> removeFromCart(
            @PathVariable Long cartId,
            @RequestHeader("X-User-Id") Long userId
    ) {
        User currentUser = userService.getUserEntityById(userId);
        cartService.removeFromCart(cartId, currentUser);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<CartDto>> viewCart(@RequestHeader("X-User-Id") Long userId) {
        User currentUser = userService.getUserEntityById(userId);
        List<CartDto> cart = cartService.viewCart(currentUser);
        return ResponseEntity.ok(cart);
    }
}

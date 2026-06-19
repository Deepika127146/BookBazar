package com.bookbazaar.service;

import com.bookbazaar.dto.AddToCartRequest;
import com.bookbazaar.dto.CartDto;
import com.bookbazaar.entity.Book;
import com.bookbazaar.entity.Cart;
import com.bookbazaar.entity.User;
import com.bookbazaar.exception.ResourceNotFoundException;
import com.bookbazaar.repository.BookRepository;
import com.bookbazaar.repository.CartRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final BookRepository bookRepository;

    public CartService(CartRepository cartRepository, BookRepository bookRepository) {
        this.cartRepository = cartRepository;
        this.bookRepository = bookRepository;
    }

    @Transactional
    public CartDto addToCart(AddToCartRequest request, User currentUser) {
        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + request.getBookId()));

        if (book.getStock() < request.getQuantity()) {
            throw new IllegalArgumentException("Insufficient stock for the requested book");
        }

        // Check if book already exists in user's cart
        Cart cartItem = cartRepository.findByUserAndBook(currentUser, book)
                .orElse(null);

        if (cartItem != null) {
            int newQuantity = cartItem.getQuantity() + request.getQuantity();
            if (book.getStock() < newQuantity) {
                throw new IllegalArgumentException("Cannot add more. Insufficient stock.");
            }
            cartItem.setQuantity(newQuantity);
        } else {
            cartItem = new Cart();
            cartItem.setUser(currentUser);
            cartItem.setBook(book);
            cartItem.setQuantity(request.getQuantity());
        }

        Cart savedItem = cartRepository.save(cartItem);
        return mapToDto(savedItem);
    }

    @Transactional
    public void removeFromCart(Long cartId, User currentUser) {
        Cart cartItem = cartRepository.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id: " + cartId));

        if (!cartItem.getUser().getId().equals(currentUser.getId())) {
            throw new IllegalArgumentException("You are not authorized to remove this item");
        }

        cartRepository.delete(cartItem);
    }

    public List<CartDto> viewCart(User currentUser) {
        List<Cart> cartItems = cartRepository.findByUser(currentUser);
        return cartItems.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private CartDto mapToDto(Cart cart) {
        return new CartDto(
                cart.getId(),
                cart.getUser().getId(),
                cart.getBook().getId(),
                cart.getBook().getTitle(),
                cart.getBook().getPrice(),
                cart.getQuantity()
        );
    }
}

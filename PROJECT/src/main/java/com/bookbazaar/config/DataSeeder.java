package com.bookbazaar.config;

import com.bookbazaar.entity.Book;
import com.bookbazaar.repository.BookRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Component
public class DataSeeder implements CommandLineRunner {

    private final BookRepository bookRepository;

    public DataSeeder(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    @Override
    public void run(String... args) {
        // Always ensure sample titles exist, even if DB already has some rows.
        // This prevents the UI search from returning empty because partial/old data exists.
        Map<String, Book> requiredByTitle = new LinkedHashMap<>();

        requiredByTitle.put("Clean Code",
                new Book(null, "Clean Code", "Robert C. Martin", 499.0, "Software Engineering", 15,
                        "A Handbook of Agile Software Craftsmanship."));
        requiredByTitle.put("Effective Java",
                new Book(null, "Effective Java", "Joshua Bloch", 699.0, "Java", 10,
                        "Best practices for the Java platform."));
        requiredByTitle.put("Spring in Action",
                new Book(null, "Spring in Action", "Craig Walls", 799.0, "Spring", 8,
                        "Comprehensive guide to Spring Framework."));
        requiredByTitle.put("Java Concurrency in Practice",
                new Book(null, "Java Concurrency in Practice", "Brian Goetz", 899.0, "Concurrency", 6,
                        "Practical techniques for writing concurrent applications."));
        requiredByTitle.put("Design Patterns",
                new Book(null, "Design Patterns", "Erich Gamma", 649.0, "Software Design", 12,
                        "Elements of reusable object-oriented software."));
        requiredByTitle.put("Head First Java",
                new Book(null, "Head First Java", "Kathy Sierra", 549.0, "Java", 20,
                        "A brain-friendly guide to learning Java."));

        // Load existing titles.
        List<Book> existing = bookRepository.findAll();
        Map<String, Boolean> existingTitleLower = new LinkedHashMap<>();
        for (Book b : existing) {
            if (b.getTitle() != null) {
                existingTitleLower.put(b.getTitle().toLowerCase(), true);
            }
        }

        List<Book> missing = new ArrayList<>();
        for (Map.Entry<String, Book> entry : requiredByTitle.entrySet()) {
            String title = entry.getKey();
            String lower = title.toLowerCase();
            if (!existingTitleLower.containsKey(lower)) {
                missing.add(entry.getValue());
            }
        }

        if (!missing.isEmpty()) {
            bookRepository.saveAll(missing);
        }
    }
}


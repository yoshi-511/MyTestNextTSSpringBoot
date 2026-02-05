package com.example.backend.repository;

import com.example.backend.entity.Item;
import com.example.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {
    List<Item> findByNameContainingIgnoreCase(String name);
    List<Item> findByCompleted(Boolean completed);
    List<Item> findByUser(User user);
    List<Item> findByUserAndNameContainingIgnoreCase(User user, String name);
    Optional<Item> findByIdAndUser(Long id, User user);
}

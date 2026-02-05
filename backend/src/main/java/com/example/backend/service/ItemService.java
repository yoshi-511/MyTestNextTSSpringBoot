package com.example.backend.service;

import com.example.backend.entity.Item;
import com.example.backend.entity.User;
import com.example.backend.repository.ItemRepository;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class ItemService {

    private final ItemRepository itemRepository;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("認証されていません");
        }
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("ユーザーが見つかりません"));
    }

    public List<Item> findAll() {
        User currentUser = getCurrentUser();
        return itemRepository.findByUser(currentUser);
    }

    public Optional<Item> findById(Long id) {
        User currentUser = getCurrentUser();
        return itemRepository.findByIdAndUser(id, currentUser);
    }

    public Item save(Item item) {
        User currentUser = getCurrentUser();
        item.setUser(currentUser);
        return itemRepository.save(item);
    }

    public Optional<Item> update(Long id, Item itemDetails) {
        User currentUser = getCurrentUser();
        return itemRepository.findByIdAndUser(id, currentUser)
                .map(item -> {
                    item.setName(itemDetails.getName());
                    item.setDescription(itemDetails.getDescription());
                    item.setCompleted(itemDetails.getCompleted());
                    return itemRepository.save(item);
                });
    }

    public boolean delete(Long id) {
        User currentUser = getCurrentUser();
        return itemRepository.findByIdAndUser(id, currentUser)
                .map(item -> {
                    itemRepository.delete(item);
                    return true;
                })
                .orElse(false);
    }

    public List<Item> searchByName(String name) {
        User currentUser = getCurrentUser();
        return itemRepository.findByUserAndNameContainingIgnoreCase(currentUser, name);
    }
}

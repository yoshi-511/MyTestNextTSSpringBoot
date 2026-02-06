package com.example.backend.controller;

import com.example.backend.entity.Item;
import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.CsvExportService;
import com.example.backend.service.ItemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/items")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ItemController {

    private final ItemService itemService;
    private final CsvExportService csvExportService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<Item>> getAllItems() {
        return ResponseEntity.ok(itemService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Item> getItemById(@PathVariable Long id) {
        return itemService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Item> createItem(@Valid @RequestBody Item item) {
        Item savedItem = itemService.save(item);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedItem);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Item> updateItem(@PathVariable Long id, @Valid @RequestBody Item item) {
        return itemService.update(id, item)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        if (itemService.delete(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<Item>> searchItems(@RequestParam String name) {
        return ResponseEntity.ok(itemService.searchByName(name));
    }

    @PostMapping("/csv/export")
    public ResponseEntity<Map<String, String>> exportCsv() {
        User user = getCurrentUser();
        String filename = "items_export_" + user.getUsername() + "_" + System.currentTimeMillis() + ".csv";
        csvExportService.exportItemsCsv(user, filename);
        return ResponseEntity.status(HttpStatus.ACCEPTED)
                .body(Map.of("filename", filename, "status", "PROCESSING"));
    }

    @GetMapping("/csv/status/{filename}")
    public ResponseEntity<Map<String, String>> getCsvStatus(@PathVariable String filename) {
        String status = csvExportService.getStatus(filename);
        return ResponseEntity.ok(Map.of("filename", filename, "status", status));
    }

    @GetMapping("/csv/download/{filename}")
    public ResponseEntity<Resource> downloadCsv(@PathVariable String filename) {
        String status = csvExportService.getStatus(filename);
        if ("NOT_FOUND".equals(status)) {
            return ResponseEntity.notFound().build();
        }
        if ("PROCESSING".equals(status)) {
            return ResponseEntity.status(HttpStatus.ACCEPTED).build();
        }
        if ("FAILED".equals(status)) {
            return ResponseEntity.internalServerError().build();
        }

        try {
            Path filePath = csvExportService.getFilePath(filename);
            if (!Files.exists(filePath)) {
                return ResponseEntity.notFound().build();
            }
            Resource resource = new UrlResource(filePath.toUri());
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType("text/csv; charset=UTF-8"))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("ユーザーが見つかりません"));
    }
}

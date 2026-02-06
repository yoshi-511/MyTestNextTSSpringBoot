package com.example.backend.service;

import com.example.backend.entity.Item;
import com.example.backend.entity.User;
import com.example.backend.repository.ItemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class CsvExportService {

    private final ItemRepository itemRepository;

    @Value("${csv.export.dir:./csv-exports}")
    private String exportDir;

    private final ConcurrentHashMap<String, String> exportStatus = new ConcurrentHashMap<>();

    public String getStatus(String filename) {
        return exportStatus.getOrDefault(filename, "NOT_FOUND");
    }

    public Path getFilePath(String filename) {
        return Paths.get(exportDir, filename);
    }

    @Async("taskExecutor")
    public void exportItemsCsv(User user, String filename) {
        log.info("[CSV Export] Start - User: {}, File: {}, Thread: {}",
                user.getUsername(), filename, Thread.currentThread().getName());

        exportStatus.put(filename, "PROCESSING");

        try {
            Path dirPath = Paths.get(exportDir);
            if (!Files.exists(dirPath)) {
                Files.createDirectories(dirPath);
            }

            List<Item> items = itemRepository.findByUser(user);

            Path filePath = dirPath.resolve(filename);
            try (BufferedWriter writer = new BufferedWriter(
                    new OutputStreamWriter(new FileOutputStream(filePath.toFile()), StandardCharsets.UTF_8))) {

                // BOM for Excel compatibility
                writer.write('\ufeff');

                // Header
                writer.write("ID,名前,説明,完了");
                writer.newLine();

                // Data
                for (Item item : items) {
                    writer.write(String.join(",",
                            String.valueOf(item.getId()),
                            escapeCsv(item.getName()),
                            escapeCsv(item.getDescription()),
                            item.getCompleted() ? "完了" : "未完了"
                    ));
                    writer.newLine();
                }
            }

            exportStatus.put(filename, "COMPLETED");
            log.info("[CSV Export] Completed - User: {}, File: {}, Items: {}, Thread: {}",
                    user.getUsername(), filename, items.size(), Thread.currentThread().getName());

        } catch (Exception e) {
            exportStatus.put(filename, "FAILED");
            log.error("[CSV Export] Failed - User: {}, File: {}, Thread: {}",
                    user.getUsername(), filename, Thread.currentThread().getName(), e);
        }
    }

    private String escapeCsv(String value) {
        if (value == null) {
            return "";
        }
        if (value.contains(",") || value.contains("\"") || value.contains("\n")) {
            return "\"" + value.replace("\"", "\"\"") + "\"";
        }
        return value;
    }
}

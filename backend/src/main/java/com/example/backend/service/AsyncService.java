package com.example.backend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

@Service
@Slf4j
public class AsyncService {

    @Async
    public void executeAsyncTask() {
        log.info("[Async] Start - Thread: {}", Thread.currentThread().getName());
        try {
            Thread.sleep(3000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        log.info("[Async] End - Thread: {}", Thread.currentThread().getName());
    }

    @Async
    public CompletableFuture<String> executeAsyncTaskWithResult() {
        log.info("[Async with Result] Start - Thread: {}", Thread.currentThread().getName());
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        String result = "Task completed at " + System.currentTimeMillis();
        log.info("[Async with Result] End - Thread: {}", Thread.currentThread().getName());
        return CompletableFuture.completedFuture(result);
    }

    @Async("taskExecutor")
    public CompletableFuture<Integer> calculateAsync(int number) {
        log.info("[Async Calculate] Processing {} - Thread: {}", number, Thread.currentThread().getName());
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        return CompletableFuture.completedFuture(number * number);
    }
}

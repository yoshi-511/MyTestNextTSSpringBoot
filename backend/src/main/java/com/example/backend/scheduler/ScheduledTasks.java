package com.example.backend.scheduler;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Component
@Slf4j
@RequiredArgsConstructor
public class ScheduledTasks {

    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    // 30秒ごとに実行
    @Scheduled(fixedRate = 30000)
    public void reportCurrentTime() {
        log.info("[FixedRate] Current time: {}", LocalDateTime.now().format(formatter));
    }

    // 前回の実行完了から10秒後に実行
    @Scheduled(fixedDelay = 10000)
    public void taskWithFixedDelay() {
        log.info("[FixedDelay] Task executed at: {}", LocalDateTime.now().format(formatter));
    }

    // Cron式: 毎分0秒に実行
    @Scheduled(cron = "0 * * * * *")
    public void taskWithCronExpression() {
        log.info("[Cron] Minute task executed at: {}", LocalDateTime.now().format(formatter));
    }

    // アプリ起動5秒後から開始、その後60秒ごとに実行
    @Scheduled(initialDelay = 5000, fixedRate = 60000)
    public void taskWithInitialDelay() {
        log.info("[InitialDelay] Periodic task executed at: {}", LocalDateTime.now().format(formatter));
    }
}

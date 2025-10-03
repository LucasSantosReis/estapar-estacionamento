package com.estapar.parking.service;

import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

@Service
public class SystemInfoService {
    
    private static final LocalDateTime SYSTEM_START_TIME = LocalDateTime.now();
    private static final ZoneId SP_TIMEZONE = ZoneId.of("America/Sao_Paulo");
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy, HH:mm:ss");
    
    /**
     * Obtém informações do sistema incluindo timestamp em SP e tempo de atividade
     */
    public SystemInfo getSystemInfo() {
        LocalDateTime now = LocalDateTime.now(SP_TIMEZONE);
        Duration uptime = Duration.between(SYSTEM_START_TIME, now);
        
        String formattedTime = now.format(TIME_FORMATTER);
        String uptimeString = formatUptime(uptime);
        
        return new SystemInfo(
            System.getProperty("java.version"),
            formattedTime,
            uptimeString
        );
    }
    
    /**
     * Formata a duração em formato legível (ex: "2h 30m" ou "45m" ou "1d 5h 20m")
     */
    private String formatUptime(Duration duration) {
        long days = duration.toDays();
        long hours = duration.toHoursPart();
        long minutes = duration.toMinutesPart();
        
        StringBuilder sb = new StringBuilder();
        
        if (days > 0) {
            sb.append(days).append("d ");
        }
        
        if (hours > 0 || days > 0) {
            sb.append(hours).append("h ");
        }
        
        if (minutes > 0 || hours > 0 || days > 0) {
            sb.append(minutes).append("m");
        } else {
            sb.append("0m");
        }
        
        return sb.toString().trim();
    }
    
    public static class SystemInfo {
        private final String javaVersion;
        private final String timestamp;
        private final String uptime;
        
        public SystemInfo(String javaVersion, String timestamp, String uptime) {
            this.javaVersion = javaVersion;
            this.timestamp = timestamp;
            this.uptime = uptime;
        }
        
        public String getJavaVersion() {
            return javaVersion;
        }
        
        public String getTimestamp() {
            return timestamp;
        }
        
        public String getUptime() {
            return uptime;
        }
    }
}

package com.estapar.parking.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.HandlerInterceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.time.LocalDateTime;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Configuration
public class RateLimitingConfig implements WebMvcConfigurer {
    
    @Bean
    public RateLimitingInterceptor rateLimitingInterceptor() {
        return new RateLimitingInterceptor();
    }
    
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(rateLimitingInterceptor())
                .addPathPatterns("/webhook/**", "/revenue/**");
    }
    
    public static class RateLimitingInterceptor implements HandlerInterceptor {
        
        private static final int MAX_REQUESTS_PER_MINUTE = 100;
        private static final int MAX_REQUESTS_PER_HOUR = 1000;
        
        private final ConcurrentHashMap<String, ClientRequestInfo> clientRequests = new ConcurrentHashMap<>();
        
        @Override
        public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
            String clientId = getClientId(request);
            ClientRequestInfo requestInfo = clientRequests.computeIfAbsent(clientId, k -> new ClientRequestInfo());
            
            LocalDateTime now = LocalDateTime.now();
            
            // Clean old entries
            requestInfo.cleanOldEntries(now);
            
            // Check rate limits
            if (requestInfo.getRequestsLastMinute() >= MAX_REQUESTS_PER_MINUTE) {
                response.setStatus(429);
                response.setHeader("X-RateLimit-Limit", String.valueOf(MAX_REQUESTS_PER_MINUTE));
                response.setHeader("X-RateLimit-Remaining", "0");
                response.setHeader("Retry-After", "60");
                return false;
            }
            
            if (requestInfo.getRequestsLastHour() >= MAX_REQUESTS_PER_HOUR) {
                response.setStatus(429);
                response.setHeader("X-RateLimit-Limit", String.valueOf(MAX_REQUESTS_PER_HOUR));
                response.setHeader("X-RateLimit-Remaining", "0");
                response.setHeader("Retry-After", "3600");
                return false;
            }
            
            // Record request
            requestInfo.addRequest(now);
            
            // Set rate limit headers
            response.setHeader("X-RateLimit-Limit", String.valueOf(MAX_REQUESTS_PER_MINUTE));
            response.setHeader("X-RateLimit-Remaining", String.valueOf(MAX_REQUESTS_PER_MINUTE - requestInfo.getRequestsLastMinute()));
            
            return true;
        }
        
        private String getClientId(HttpServletRequest request) {
            String xForwardedFor = request.getHeader("X-Forwarded-For");
            if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
                return xForwardedFor.split(",")[0].trim();
            }
            return request.getRemoteAddr();
        }
        
        private static class ClientRequestInfo {
            private final AtomicInteger requestsLastMinute = new AtomicInteger(0);
            private final AtomicInteger requestsLastHour = new AtomicInteger(0);
            private LocalDateTime lastMinuteReset = LocalDateTime.now();
            private LocalDateTime lastHourReset = LocalDateTime.now();
            
            public void addRequest(LocalDateTime now) {
                requestsLastMinute.incrementAndGet();
                requestsLastHour.incrementAndGet();
            }
            
            public void cleanOldEntries(LocalDateTime now) {
                // Reset minute counter if needed
                if (now.isAfter(lastMinuteReset.plusMinutes(1))) {
                    requestsLastMinute.set(0);
                    lastMinuteReset = now;
                }
                
                // Reset hour counter if needed
                if (now.isAfter(lastHourReset.plusHours(1))) {
                    requestsLastHour.set(0);
                    lastHourReset = now;
                }
            }
            
            public int getRequestsLastMinute() {
                return requestsLastMinute.get();
            }
            
            public int getRequestsLastHour() {
                return requestsLastHour.get();
            }
        }
    }
}

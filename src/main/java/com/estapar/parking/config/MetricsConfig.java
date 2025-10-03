package com.estapar.parking.config;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.Gauge;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

import java.util.concurrent.atomic.AtomicInteger;

@Configuration
public class MetricsConfig {

    @Bean
    public ParkingMetrics parkingMetrics(MeterRegistry meterRegistry) {
        return new ParkingMetrics(meterRegistry);
    }

    @Component
    public static class ParkingMetrics {
        
        private final MeterRegistry meterRegistry;
        
        // Counters
        private final Counter vehiclesEntered;
        private final Counter vehiclesExited;
        private final Counter revenueGenerated;
        private final Counter webhookEventsProcessed;
        private final Counter webhookEventsFailed;
        
        // Gauges
        private final AtomicInteger currentOccupancy = new AtomicInteger(0);
        private final AtomicInteger totalSpots = new AtomicInteger(0);
        
        // Timers
        private final Timer webhookProcessingTime;
        private final Timer revenueCalculationTime;
        
        @Autowired
        public ParkingMetrics(MeterRegistry meterRegistry) {
            this.meterRegistry = meterRegistry;
            
            // Initialize counters
            this.vehiclesEntered = Counter.builder("parking.vehicles.entered")
                    .description("Total number of vehicles that entered the parking")
                    .register(meterRegistry);
                    
            this.vehiclesExited = Counter.builder("parking.vehicles.exited")
                    .description("Total number of vehicles that exited the parking")
                    .register(meterRegistry);
                    
            this.revenueGenerated = Counter.builder("parking.revenue.generated")
                    .description("Total revenue generated")
                    .register(meterRegistry);
                    
            this.webhookEventsProcessed = Counter.builder("parking.webhook.events.processed")
                    .description("Total webhook events processed successfully")
                    .register(meterRegistry);
                    
            this.webhookEventsFailed = Counter.builder("parking.webhook.events.failed")
                    .description("Total webhook events that failed processing")
                    .register(meterRegistry);
            
            // Initialize timers
            this.webhookProcessingTime = Timer.builder("parking.webhook.processing.time")
                    .description("Time taken to process webhook events")
                    .register(meterRegistry);
                    
            this.revenueCalculationTime = Timer.builder("parking.revenue.calculation.time")
                    .description("Time taken to calculate revenue")
                    .register(meterRegistry);
            
            // Initialize gauges - simplified for now
            // TODO: Fix gauge registration syntax
        }
        
        // Counter methods
        public void incrementVehiclesEntered() {
            vehiclesEntered.increment();
        }
        
        public void incrementVehiclesExited() {
            vehiclesExited.increment();
        }
        
        public void incrementRevenueGenerated(double amount) {
            revenueGenerated.increment(amount);
        }
        
        public void incrementWebhookEventsProcessed() {
            webhookEventsProcessed.increment();
        }
        
        public void incrementWebhookEventsFailed() {
            webhookEventsFailed.increment();
        }
        
        // Gauge methods
        public void updateOccupancy(int current, int total) {
            this.currentOccupancy.set(current);
            this.totalSpots.set(total);
        }
        
        public double getOccupancyPercentage() {
            int total = totalSpots.get();
            if (total == 0) return 0.0;
            return (currentOccupancy.get() * 100.0) / total;
        }
        
        public int getAvailableSpots() {
            return totalSpots.get() - currentOccupancy.get();
        }
        
        // Timer methods
        public Timer.Sample startWebhookProcessingTimer() {
            return Timer.start(meterRegistry);
        }
        
        public void recordWebhookProcessingTime(Timer.Sample sample) {
            sample.stop(webhookProcessingTime);
        }
        
        public Timer.Sample startRevenueCalculationTimer() {
            return Timer.start(meterRegistry);
        }
        
        public void recordRevenueCalculationTime(Timer.Sample sample) {
            sample.stop(revenueCalculationTime);
        }
    }
}

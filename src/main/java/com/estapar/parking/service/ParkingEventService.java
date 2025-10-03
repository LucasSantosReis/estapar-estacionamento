package com.estapar.parking.service;

import com.estapar.parking.dto.WebhookEventDto;
import com.estapar.parking.entity.EventType;
import com.estapar.parking.entity.ParkingEvent;
import com.estapar.parking.entity.ParkingSpot;
import com.estapar.parking.entity.Sector;
import com.estapar.parking.exception.NoAvailableSpotsException;
import com.estapar.parking.exception.SectorNotFoundException;
import com.estapar.parking.exception.VehicleNotParkedException;
import com.estapar.parking.exception.VehicleAlreadyParkedException;
import com.estapar.parking.repository.ParkingEventRepository;
import com.estapar.parking.repository.ParkingSpotRepository;
import com.estapar.parking.repository.SectorRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import io.micrometer.core.instrument.Timer;

@Service
@Transactional
public class ParkingEventService {
    
    private static final Logger logger = LoggerFactory.getLogger(ParkingEventService.class);
    
    @Autowired
    private ParkingEventRepository parkingEventRepository;
    
    @Autowired
    private ParkingSpotRepository parkingSpotRepository;
    
    @Autowired
    private SectorRepository sectorRepository;
    
    @Autowired
    private com.estapar.parking.config.MetricsConfig.ParkingMetrics parkingMetrics;
    
    @Autowired
    private CacheManager cacheManager;
    
    public void processEvent(WebhookEventDto eventDto) {
        logger.info("Processing event: {}", eventDto);
        
        Timer.Sample timer = null;
        if (parkingMetrics != null) {
            timer = parkingMetrics.startWebhookProcessingTimer();
        }
        
        try {
            EventType eventType = EventType.valueOf(eventDto.getEventType());
            
            switch (eventType) {
                case ENTRY:
                    processEntryEvent(eventDto);
                    break;
                case PARKED:
                    processParkedEvent(eventDto);
                    break;
                case EXIT:
                    processExitEvent(eventDto);
                    break;
                default:
                    logger.warn("Unknown event type: {}", eventDto.getEventType());
            }
            
            if (parkingMetrics != null) {
                parkingMetrics.incrementWebhookEventsProcessed();
            }
            logger.info("Event processed successfully: {}", eventDto);
        } catch (Exception e) {
            if (parkingMetrics != null) {
                parkingMetrics.incrementWebhookEventsFailed();
            }
            logger.error("Error processing event: {}", eventDto, e);
            throw e;
        } finally {
            if (parkingMetrics != null && timer != null) {
                parkingMetrics.recordWebhookProcessingTime(timer);
            }
        }
    }
    
    private void processEntryEvent(WebhookEventDto eventDto) {
        logger.info("Processing ENTRY event for license plate: {}", eventDto.getLicensePlate());
        
        // Check if vehicle is already parked
        long alreadyParkedCount = parkingSpotRepository.countByOccupiedByAndAvailableFalse(eventDto.getLicensePlate());
        if (alreadyParkedCount > 0) {
            logger.warn("Vehicle {} is already parked in {} spot(s)", eventDto.getLicensePlate(), alreadyParkedCount);
            throw new VehicleAlreadyParkedException("Vehicle " + eventDto.getLicensePlate() + " is already parked");
        }
        
        // Find available spot
        Optional<ParkingSpot> availableSpot = parkingSpotRepository.findFirstAvailableSpotBySector("A"); // Default to sector A for now
        
        if (availableSpot.isEmpty()) {
            logger.warn("No available spots for ENTRY event: {}", eventDto);
            throw new NoAvailableSpotsException("No available parking spots");
        }
        
        ParkingSpot spot = availableSpot.get();
        Sector sector = sectorRepository.findBySector(spot.getSector())
                .orElseThrow(() -> new SectorNotFoundException("Sector not found: " + spot.getSector()));
        
        // Check if sector is full (100% occupancy)
        if (sector.isFull()) {
            logger.warn("Sector {} is full, rejecting entry for: {}", spot.getSector(), eventDto.getLicensePlate());
            throw new NoAvailableSpotsException("Sector is full");
        }
        
        // Calculate dynamic pricing based on current occupancy
        double occupancyRate = sector.getOccupancyRate();
        BigDecimal dynamicPrice = calculateDynamicPrice(sector.getBasePrice(), occupancyRate);
        
        // Occupy the spot
        spot.occupy(eventDto.getLicensePlate());
        parkingSpotRepository.save(spot);
        
        // Create parking event
        ParkingEvent parkingEvent = new ParkingEvent(
            eventDto.getLicensePlate(),
            spot.getSector(),
            EventType.ENTRY
        );
        parkingEvent.setEntryTime(eventDto.getEntryTime());
        parkingEvent.setSpotId(spot.getId());
        parkingEvent.setPriceApplied(dynamicPrice.doubleValue());
        parkingEvent.setOccupancyRateAtEntry(occupancyRate);
        
        parkingEventRepository.save(parkingEvent);
        
        // Update metrics
        if (parkingMetrics != null) {
            parkingMetrics.incrementVehiclesEntered();
            updateOccupancyMetrics();
        }
        
        // Invalidate revenue cache for this sector and current date
        // This ensures that if pricing changes due to occupancy, the cache is updated
        invalidateRevenueCache(spot.getSector(), eventDto.getEntryTime().toLocalDate());
        
        logger.info("Vehicle {} entered and occupied spot {} in sector {}", 
                   eventDto.getLicensePlate(), spot.getId(), spot.getSector());
    }
    
    private void processParkedEvent(WebhookEventDto eventDto) {
        logger.info("Processing PARKED event for license plate: {}", eventDto.getLicensePlate());
        
        // Find the parking spot occupied by this vehicle
        Optional<ParkingSpot> occupiedSpot = parkingSpotRepository.findByOccupiedBy(eventDto.getLicensePlate());
        
        if (occupiedSpot.isPresent()) {
            ParkingSpot spot = occupiedSpot.get();
            
            // Update spot coordinates if provided
            if (eventDto.getLat() != null && eventDto.getLng() != null) {
                spot.setLatitude(eventDto.getLat());
                spot.setLongitude(eventDto.getLng());
                parkingSpotRepository.save(spot);
            }
            
            // Create parking event
            ParkingEvent parkingEvent = new ParkingEvent(
                eventDto.getLicensePlate(),
                spot.getSector(),
                EventType.PARKED
            );
            parkingEvent.setLatitude(eventDto.getLat());
            parkingEvent.setLongitude(eventDto.getLng());
            parkingEvent.setSpotId(spot.getId());
            
            parkingEventRepository.save(parkingEvent);
            
            logger.info("Vehicle {} parked at coordinates ({}, {})", 
                       eventDto.getLicensePlate(), eventDto.getLat(), eventDto.getLng());
        } else {
            logger.warn("No occupied spot found for PARKED event: {}", eventDto);
        }
    }
    
    private void processExitEvent(WebhookEventDto eventDto) {
        logger.info("Processing EXIT event for license plate: {}", eventDto.getLicensePlate());
        
        // Find the parking spot occupied by this vehicle
        Optional<ParkingSpot> occupiedSpot = parkingSpotRepository.findByOccupiedBy(eventDto.getLicensePlate());
        
        if (occupiedSpot.isEmpty()) {
            logger.warn("No occupied spot found for EXIT event: {}", eventDto);
            throw new VehicleNotParkedException("Vehicle not found in parking");
        }
        
        ParkingSpot spot = occupiedSpot.get();
        
        // Find the entry event for this vehicle
        Optional<ParkingEvent> entryEvent = parkingEventRepository.findLatestEntryEvent(eventDto.getLicensePlate());
        
        if (entryEvent.isEmpty()) {
            logger.warn("No entry event found for EXIT event: {}", eventDto);
            throw new VehicleNotParkedException("No entry event found for vehicle");
        }
        
        ParkingEvent entry = entryEvent.get();
        
        // Calculate parking duration and amount
        LocalDateTime entryTime = entry.getEntryTime();
        LocalDateTime exitTime = eventDto.getExitTime();
        
        if (entryTime == null || exitTime == null) {
            logger.warn("Invalid entry or exit time for EXIT event: {}", eventDto);
            throw new VehicleNotParkedException("Invalid entry or exit time");
        }
        
        Duration duration = Duration.between(entryTime, exitTime);
        BigDecimal amount = calculateParkingFee(duration, BigDecimal.valueOf(entry.getPriceApplied()));
        
        // Release the spot
        spot.release();
        parkingSpotRepository.save(spot);
        
        // Create exit event
        ParkingEvent exitEvent = new ParkingEvent(
            eventDto.getLicensePlate(),
            spot.getSector(),
            EventType.EXIT
        );
        exitEvent.setExitTime(exitTime);
        exitEvent.setSpotId(spot.getId());
        exitEvent.setAmountCharged(amount.doubleValue());
        exitEvent.setPriceApplied(entry.getPriceApplied());
        exitEvent.setOccupancyRateAtEntry(entry.getOccupancyRateAtEntry());
        
        parkingEventRepository.save(exitEvent);
        
        // Update metrics
        if (parkingMetrics != null) {
            parkingMetrics.incrementVehiclesExited();
            parkingMetrics.incrementRevenueGenerated(amount.doubleValue());
            updateOccupancyMetrics();
        }
        
        // Invalidate revenue cache for this sector and date
        invalidateRevenueCache(spot.getSector(), exitTime.toLocalDate());
        
        logger.info("Vehicle {} exited and paid {} for {} minutes of parking", 
                   eventDto.getLicensePlate(), amount, duration.toMinutes());
    }
    
    private BigDecimal calculateDynamicPrice(BigDecimal basePrice, double occupancyRate) {
        BigDecimal multiplier = BigDecimal.ONE;
        
        if (occupancyRate < 0.25) {
            // Less than 25% occupancy - 10% discount
            multiplier = BigDecimal.valueOf(0.9);
        } else if (occupancyRate >= 0.25 && occupancyRate < 0.50) {
            // 25% to 50% occupancy - no discount
            multiplier = BigDecimal.ONE;
        } else if (occupancyRate >= 0.50 && occupancyRate < 0.75) {
            // 50% to 75% occupancy - 10% increase
            multiplier = BigDecimal.valueOf(1.1);
        } else if (occupancyRate >= 0.75 && occupancyRate < 1.0) {
            // 75% to 100% occupancy - 25% increase
            multiplier = BigDecimal.valueOf(1.25);
        }
        
        return basePrice.multiply(multiplier).setScale(2, RoundingMode.HALF_UP);
    }
    
    @CacheEvict(value = {"sectors", "parkingSpots"}, allEntries = true)
    private void updateOccupancyMetrics() {
        try {
            if (parkingMetrics != null) {
                long totalSpots = parkingSpotRepository.count();
                long occupiedSpots = parkingSpotRepository.countByAvailableFalse();
                parkingMetrics.updateOccupancy((int) occupiedSpots, (int) totalSpots);
            }
        } catch (Exception e) {
            logger.warn("Failed to update occupancy metrics: {}", e.getMessage());
        }
    }
    
    private BigDecimal calculateParkingFee(Duration duration, BigDecimal hourlyRate) {
        long totalMinutes = duration.toMinutes();
        
        // First 30 minutes are free
        if (totalMinutes <= 30) {
            return BigDecimal.ZERO;
        }
        
        // Calculate hours (round up for partial hours)
        long billableMinutes = totalMinutes - 30;
        long hours = (billableMinutes + 59) / 60; // Round up to next hour
        
        return hourlyRate.multiply(BigDecimal.valueOf(hours)).setScale(2, RoundingMode.HALF_UP);
    }
    
    /**
     * Clean up inconsistent data - vehicles occupying multiple spots
     * This method should be called periodically or when inconsistencies are detected
     */
    @Transactional
    public void cleanupInconsistentParkingData() {
        logger.info("Starting cleanup of inconsistent parking data");
        
        // Find all vehicles that are occupying multiple spots
        List<String> vehiclesWithMultipleSpots = parkingSpotRepository.findVehiclesWithMultipleSpots();
        
        for (String licensePlate : vehiclesWithMultipleSpots) {
            logger.warn("Found vehicle {} occupying multiple spots, cleaning up", licensePlate);
            
            // Get all spots occupied by this vehicle
            List<ParkingSpot> occupiedSpots = parkingSpotRepository.findByOccupiedByAndAvailableFalse(licensePlate);
            
            if (occupiedSpots.size() > 1) {
                // Keep only the first spot, release all others
                for (int i = 1; i < occupiedSpots.size(); i++) {
                    ParkingSpot spot = occupiedSpots.get(i);
                    spot.release();
                    parkingSpotRepository.save(spot);
                    logger.info("Released duplicate spot {} for vehicle {}", spot.getId(), licensePlate);
                }
            }
        }
        
        logger.info("Cleanup of inconsistent parking data completed");
    }
    
    /**
     * Get statistics about parking data consistency
     */
    public Map<String, Object> getParkingDataConsistencyReport() {
        Map<String, Object> report = new HashMap<>();
        
        // Count vehicles with multiple spots
        List<String> vehiclesWithMultipleSpots = parkingSpotRepository.findVehiclesWithMultipleSpots();
        report.put("vehiclesWithMultipleSpots", vehiclesWithMultipleSpots.size());
        report.put("vehiclesWithMultipleSpotsList", vehiclesWithMultipleSpots);
        
        // Total occupied spots
        long totalOccupiedSpots = parkingSpotRepository.countByAvailableFalse();
        report.put("totalOccupiedSpots", totalOccupiedSpots);
        
        // Total unique vehicles parked
        long uniqueVehiclesParked = parkingSpotRepository.countUniqueVehiclesParked();
        report.put("uniqueVehiclesParked", uniqueVehiclesParked);
        
        // Check for inconsistencies
        boolean hasInconsistencies = vehiclesWithMultipleSpots.size() > 0;
        report.put("hasInconsistencies", hasInconsistencies);
        
        return report;
    }
    
    /**
     * Invalidate revenue cache for specific sector and date
     */
    public void invalidateRevenueCache(String sector, LocalDate date) {
        logger.info("Invalidating revenue cache for sector: {} and date: {}", sector, date);
        try {
            org.springframework.cache.Cache revenueCache = cacheManager.getCache("revenue");
            if (revenueCache != null) {
                revenueCache.clear();
                logger.info("Cache 'revenue' cleared successfully");
            } else {
                logger.warn("Cache 'revenue' not found");
            }
        } catch (Exception e) {
            logger.error("Error clearing cache: {}", e.getMessage());
        }
    }
}

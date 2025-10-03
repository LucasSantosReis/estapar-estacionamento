package com.estapar.parking.service;

import com.estapar.parking.dto.RevenueRequestDto;
import com.estapar.parking.dto.RevenueResponseDto;
import com.estapar.parking.entity.ParkingEvent;
import com.estapar.parking.repository.ParkingEventRepository;
import com.estapar.parking.repository.SectorRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import io.micrometer.core.instrument.Timer;

@Service
@Transactional(readOnly = true)
public class RevenueService {
    
    private static final Logger logger = LoggerFactory.getLogger(RevenueService.class);
    
    @Autowired
    private ParkingEventRepository parkingEventRepository;
    
    @Autowired
    private SectorRepository sectorRepository;
    
    @Autowired
    private com.estapar.parking.config.MetricsConfig.ParkingMetrics parkingMetrics;
    
    @Cacheable(value = "revenue", key = "#request.sector + '_' + #request.date")
    public RevenueResponseDto calculateRevenue(RevenueRequestDto request) {
        logger.info("Calculating revenue for sector: {} on date: {}", request.getSector(), request.getDate());
        
        Timer.Sample timer = null;
        if (parkingMetrics != null) {
            timer = parkingMetrics.startRevenueCalculationTimer();
        }
        
        try {
            // Validate sector exists
            if (!sectorRepository.existsBySector(request.getSector())) {
                logger.warn("Sector not found: {}", request.getSector());
                return new RevenueResponseDto(BigDecimal.ZERO);
            }
            
            // Calculate total revenue from exit events for the given sector and date
            Double totalRevenue = parkingEventRepository.calculateRevenueBySectorAndDate(
                request.getSector(), 
                request.getDate()
            );
            
            BigDecimal amount = totalRevenue != null ? BigDecimal.valueOf(totalRevenue) : BigDecimal.ZERO;
            
            logger.info("Revenue calculated for sector {} on {}: {}", 
                       request.getSector(), request.getDate(), amount);
            
            return new RevenueResponseDto(amount);
        } finally {
            if (parkingMetrics != null && timer != null) {
                parkingMetrics.recordRevenueCalculationTime(timer);
            }
        }
    }
    
    public List<ParkingEvent> getExitEventsForRevenue(RevenueRequestDto request) {
        logger.info("Getting exit events for sector: {} on date: {}", request.getSector(), request.getDate());
        
        return parkingEventRepository.findExitEventsBySectorAndDate(
            request.getSector(), 
            request.getDate()
        );
    }
}

package com.estapar.parking.controller;

import com.estapar.parking.service.ParkingEventService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/admin")
@Tag(name = "Admin", description = "Administrative operations for parking management")
public class AdminController {
    
    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);
    
    @Autowired
    private ParkingEventService parkingEventService;
    
    @GetMapping("/parking/consistency-report")
    @Operation(summary = "Get parking data consistency report", 
               description = "Returns a report about parking data consistency, including vehicles with multiple spots")
    public ResponseEntity<Map<String, Object>> getConsistencyReport() {
        logger.info("Generating parking data consistency report");
        
        Map<String, Object> report = parkingEventService.getParkingDataConsistencyReport();
        
        return ResponseEntity.ok(report);
    }
    
    @PostMapping("/parking/cleanup")
    @Operation(summary = "Clean up inconsistent parking data", 
               description = "Cleans up vehicles that are occupying multiple spots, keeping only the first spot")
    public ResponseEntity<Map<String, Object>> cleanupInconsistentData() {
        logger.info("Starting cleanup of inconsistent parking data");
        
        // Get report before cleanup
        Map<String, Object> beforeReport = parkingEventService.getParkingDataConsistencyReport();
        
        // Perform cleanup
        parkingEventService.cleanupInconsistentParkingData();
        
        // Get report after cleanup
        Map<String, Object> afterReport = parkingEventService.getParkingDataConsistencyReport();
        
        Map<String, Object> result = Map.of(
            "beforeCleanup", beforeReport,
            "afterCleanup", afterReport,
            "cleanupCompleted", true
        );
        
        logger.info("Cleanup of inconsistent parking data completed");
        
        return ResponseEntity.ok(result);
    }
}

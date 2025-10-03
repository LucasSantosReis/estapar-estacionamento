package com.estapar.parking.service;

import com.estapar.parking.dto.GarageConfigDto;
import com.estapar.parking.entity.ParkingSpot;
import com.estapar.parking.entity.Sector;
import com.estapar.parking.repository.ParkingSpotRepository;
import com.estapar.parking.repository.SectorRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class GarageConfigService {
    
    private static final Logger logger = LoggerFactory.getLogger(GarageConfigService.class);
    
    @Autowired
    private SectorRepository sectorRepository;
    
    @Autowired
    private ParkingSpotRepository parkingSpotRepository;
    
    @Value("${garage.simulator.base-url}")
    private String simulatorBaseUrl;
    
    @Value("${garage.simulator.garage-endpoint}")
    private String garageEndpoint;
    
    private final RestTemplate restTemplate = new RestTemplate();
    
    @EventListener(ApplicationReadyEvent.class)
    public void loadGarageConfiguration() {
        logger.info("Loading garage configuration from simulator...");
        try {
            String url = simulatorBaseUrl + garageEndpoint;
            logger.info("Fetching garage configuration from: {}", url);
            
            ResponseEntity<GarageConfigDto> response = restTemplate.getForEntity(url, GarageConfigDto.class);
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                GarageConfigDto config = response.getBody();
                saveGarageConfiguration(config);
                logger.info("Garage configuration loaded successfully");
            } else {
                logger.error("Failed to load garage configuration. Status: {}", response.getStatusCode());
                createTestData();
            }
        } catch (Exception e) {
            logger.error("Error loading garage configuration: {}", e.getMessage(), e);
            logger.info("Creating test data as fallback...");
            createTestData();
        }
    }
    
    public void saveGarageConfiguration(GarageConfigDto config) {
        logger.info("Saving garage configuration: {}", config);
        
        // Save sectors
        if (config.getGarage() != null) {
            for (GarageConfigDto.SectorDto sectorDto : config.getGarage()) {
                Sector sector = new Sector(
                    sectorDto.getSector(),
                    BigDecimal.valueOf(sectorDto.getBasePrice()),
                    sectorDto.getMax_capacity()
                );
                sectorRepository.save(sector);
                logger.info("Saved sector: {}", sector);
            }
        }
        
        // Save parking spots
        if (config.getSpots() != null) {
            for (GarageConfigDto.SpotDto spotDto : config.getSpots()) {
                ParkingSpot spot = new ParkingSpot(
                    spotDto.getId(),
                    spotDto.getSector(),
                    spotDto.getLat(),
                    spotDto.getLng()
                );
                parkingSpotRepository.save(spot);
                logger.info("Saved parking spot: {}", spot);
            }
        }
    }
    
    public List<Sector> getAllSectors() {
        return sectorRepository.findAll();
    }
    
    public List<ParkingSpot> getAllSpots() {
        return parkingSpotRepository.findAll();
    }
    
    public List<ParkingSpot> getSpotsBySector(String sector) {
        return parkingSpotRepository.findBySector(sector);
    }
    
    public Sector getSectorBySector(String sector) {
        return sectorRepository.findBySector(sector).orElse(null);
    }
    
    public void createTestData() {
        logger.info("Creating test garage data...");
        
        // Create test sectors if they don't exist
        String[] sectors = {"A", "B", "C", "D"};
        BigDecimal[] prices = {
            BigDecimal.valueOf(10.00),
            BigDecimal.valueOf(12.00),
            BigDecimal.valueOf(15.00),
            BigDecimal.valueOf(8.00)
        };
        
        for (int i = 0; i < sectors.length; i++) {
            String sectorName = sectors[i];
            if (!sectorRepository.existsBySector(sectorName)) {
                Sector sector = new Sector(sectorName, prices[i], 100);
                sectorRepository.save(sector);
                logger.info("Created test sector: {}", sector);
            }
        }
        
        // Create test parking spots if they don't exist
        if (parkingSpotRepository.count() == 0) {
            for (String sectorName : sectors) {
                for (int i = 1; i <= 100; i++) {
                    ParkingSpot spot = new ParkingSpot();
                    spot.setSector(sectorName);
                    spot.setLatitude(-23.5505 + (Math.random() - 0.5) * 0.01); // São Paulo area
                    spot.setLongitude(-46.6333 + (Math.random() - 0.5) * 0.01);
                    spot.setAvailable(true);
                    parkingSpotRepository.save(spot);
                }
                logger.info("Created 100 test parking spots for sector: {}", sectorName);
            }
        }
        
        logger.info("Test data creation completed");
    }
}

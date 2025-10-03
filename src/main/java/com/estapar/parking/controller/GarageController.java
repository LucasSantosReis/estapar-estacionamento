package com.estapar.parking.controller;

import com.estapar.parking.dto.GarageConfigDto;
import com.estapar.parking.entity.ParkingSpot;
import com.estapar.parking.entity.Sector;
import com.estapar.parking.service.GarageConfigService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/garage")
@Tag(name = "Garage", description = "API para consulta de informações da garagem")
public class GarageController {
    
    private static final Logger logger = LoggerFactory.getLogger(GarageController.class);
    
    @Autowired
    private GarageConfigService garageConfigService;
    
    @GetMapping
    @Cacheable(value = "garageConfig")
    @Operation(
            summary = "Buscar configuração da garagem",
            description = "Retorna a configuração completa da garagem com setores e vagas, conforme especificação do simulador"
    )
    @ApiResponse(
            responseCode = "200",
            description = "Configuração da garagem retornada com sucesso",
            content = @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = GarageConfigDto.class)
            )
    )
    public ResponseEntity<GarageConfigDto> getGarageConfiguration() {
        logger.info("Getting garage configuration");
        
        List<Sector> sectors = garageConfigService.getAllSectors();
        List<ParkingSpot> spots = garageConfigService.getAllSpots();
        
        // Convert entities to DTOs
        List<GarageConfigDto.SectorDto> sectorDtos = sectors.stream()
                .map(sector -> new GarageConfigDto.SectorDto(
                        sector.getSector(),
                        sector.getBasePrice().doubleValue(),
                        sector.getMaxCapacity()
                ))
                .collect(Collectors.toList());
        
        List<GarageConfigDto.SpotDto> spotDtos = spots.stream()
                .map(spot -> new GarageConfigDto.SpotDto(
                        spot.getId(),
                        spot.getSector(),
                        spot.getLatitude(),
                        spot.getLongitude()
                ))
                .collect(Collectors.toList());
        
        GarageConfigDto config = new GarageConfigDto(sectorDtos, spotDtos);
        return ResponseEntity.ok(config);
    }
    
    @GetMapping("/sectors")
    @Cacheable(value = "sectors")
    @Operation(
            summary = "Listar todos os setores",
            description = "Retorna uma lista com todos os setores da garagem"
    )
    @ApiResponse(
            responseCode = "200",
            description = "Lista de setores retornada com sucesso",
            content = @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = Sector.class)
            )
    )
    public ResponseEntity<List<Sector>> getAllSectors() {
        logger.info("Getting all sectors");
        
        List<Sector> sectors = garageConfigService.getAllSectors();
        return ResponseEntity.ok(sectors);
    }
    
    @GetMapping("/sectors/{sector}")
    @Operation(
            summary = "Consultar setor específico",
            description = "Retorna informações detalhadas de um setor específico"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Setor encontrado",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = Sector.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Setor não encontrado",
                    content = @Content(mediaType = "application/json")
            )
    })
    public ResponseEntity<Sector> getSector(
            @Parameter(description = "Nome do setor", required = true, example = "A")
            @PathVariable String sector) {
        logger.info("Getting sector: {}", sector);
        
        Sector sectorEntity = garageConfigService.getSectorBySector(sector);
        if (sectorEntity == null) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(sectorEntity);
    }
    
    @GetMapping("/spots")
    @Operation(
            summary = "Listar todas as vagas",
            description = "Retorna uma lista com todas as vagas da garagem"
    )
    @ApiResponse(
            responseCode = "200",
            description = "Lista de vagas retornada com sucesso",
            content = @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = ParkingSpot.class)
            )
    )
    public ResponseEntity<List<ParkingSpot>> getAllSpots() {
        logger.info("Getting all parking spots");
        
        List<ParkingSpot> spots = garageConfigService.getAllSpots();
        return ResponseEntity.ok(spots);
    }
    
    @GetMapping("/spots/sector/{sector}")
    @Operation(
            summary = "Consultar vagas por setor",
            description = "Retorna todas as vagas de um setor específico"
    )
    @ApiResponse(
            responseCode = "200",
            description = "Lista de vagas do setor retornada com sucesso",
            content = @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = ParkingSpot.class)
            )
    )
    public ResponseEntity<List<ParkingSpot>> getSpotsBySector(
            @Parameter(description = "Nome do setor", required = true, example = "A")
            @PathVariable String sector) {
        logger.info("Getting parking spots for sector: {}", sector);
        
        List<ParkingSpot> spots = garageConfigService.getSpotsBySector(sector);
        return ResponseEntity.ok(spots);
    }
    
    @GetMapping("/status")
    @Operation(
            summary = "Status da garagem",
            description = "Retorna o status atual da garagem com ocupação por setor"
    )
    @ApiResponse(
            responseCode = "200",
            description = "Status da garagem retornado com sucesso",
            content = @Content(
                    mediaType = "text/plain",
                    examples = @io.swagger.v3.oas.annotations.media.ExampleObject(
                            value = "Garage Status:\nSector A: 5/10 spots occupied (50.0%)\nSector B: 8/10 spots occupied (80.0%)"
                    )
            )
    )
    public ResponseEntity<String> getGarageStatus() {
        logger.info("Getting garage status");
        
        List<Sector> sectors = garageConfigService.getAllSectors();
        StringBuilder status = new StringBuilder("Garage Status:\n");
        
        for (Sector sector : sectors) {
            status.append(String.format("Sector %s: %d/%d spots occupied (%.1f%%)\n", 
                sector.getSector(), 
                sector.getOccupiedSpots(), 
                sector.getMaxCapacity(),
                sector.getOccupancyRate() * 100));
        }
        
        return ResponseEntity.ok(status.toString());
    }
    
    @PostMapping("/init-test-data")
    @Operation(
            summary = "Inicializar dados de teste",
            description = "Cria dados de teste para setores e vagas quando o simulador não está disponível"
    )
    @ApiResponse(
            responseCode = "200",
            description = "Dados de teste criados com sucesso"
    )
    public ResponseEntity<String> initTestData() {
        logger.info("Initializing test data...");
        
        try {
            garageConfigService.createTestData();
            return ResponseEntity.ok("Test data initialized successfully");
        } catch (Exception e) {
            logger.error("Error initializing test data: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body("Error initializing test data: " + e.getMessage());
        }
    }
}

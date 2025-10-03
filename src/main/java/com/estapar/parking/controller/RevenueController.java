package com.estapar.parking.controller;

import com.estapar.parking.dto.RevenueRequestDto;
import com.estapar.parking.dto.RevenueResponseDto;
import com.estapar.parking.service.RevenueService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/revenue")
@Tag(name = "Revenue", description = "API para consulta de receita do estacionamento")
public class RevenueController {
    
    private static final Logger logger = LoggerFactory.getLogger(RevenueController.class);
    
    @Autowired
    private RevenueService revenueService;
    
    @GetMapping
    @Operation(
            summary = "Consultar receita (GET)",
            description = "Consulta a receita total de um setor em uma data específica usando parâmetros de query"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Receita calculada com sucesso",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = RevenueResponseDto.class),
                            examples = @ExampleObject(
                                    value = "{\"amount\": 150.0, \"currency\": \"BRL\", \"timestamp\": \"2025-01-01T10:30:00Z\"}"
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Parâmetros inválidos",
                    content = @Content(mediaType = "application/json")
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "Erro interno do servidor",
                    content = @Content(mediaType = "application/json")
            )
    })
    public ResponseEntity<RevenueResponseDto> getRevenue(
            @Parameter(description = "Data no formato yyyy-MM-dd", required = true, example = "2025-01-01")
            @RequestParam String date,
            @Parameter(description = "Nome do setor", required = true, example = "A")
            @RequestParam String sector) {
        
        RevenueRequestDto request = new RevenueRequestDto(
                java.time.LocalDate.parse(date),
                sector
        );
        
        logger.info("Getting revenue for request: {}", request);
        
        RevenueResponseDto response = revenueService.calculateRevenue(request);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping
    @Operation(
            summary = "Consultar receita (POST)",
            description = "Consulta a receita total de um setor em uma data específica usando body JSON"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Receita calculada com sucesso",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = RevenueResponseDto.class),
                            examples = @ExampleObject(
                                    value = "{\"amount\": 150.0, \"currency\": \"BRL\", \"timestamp\": \"2025-01-01T10:30:00Z\"}"
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Dados inválidos no body da requisição",
                    content = @Content(mediaType = "application/json")
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "Erro interno do servidor",
                    content = @Content(mediaType = "application/json")
            )
    })
    public ResponseEntity<RevenueResponseDto> getRevenuePost(
            @Parameter(description = "Dados da consulta de receita", required = true)
            @Valid @RequestBody RevenueRequestDto request) {
        logger.info("Getting revenue for POST request: {}", request);
        
        RevenueResponseDto response = revenueService.calculateRevenue(request);
        return ResponseEntity.ok(response);
    }
}

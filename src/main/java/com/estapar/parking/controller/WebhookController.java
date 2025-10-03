package com.estapar.parking.controller;

import com.estapar.parking.dto.WebhookEventDto;
import com.estapar.parking.service.ParkingEventService;
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
@RequestMapping("/webhook")
@Tag(name = "Webhook", description = "API para recebimento de eventos de veículos do simulador")
public class WebhookController {
    
    private static final Logger logger = LoggerFactory.getLogger(WebhookController.class);
    
    @Autowired
    private ParkingEventService parkingEventService;
    
    @PostMapping
    @Operation(
            summary = "Processar evento de webhook",
            description = "Recebe eventos de entrada, estacionamento e saída de veículos do simulador"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Evento processado com sucesso",
                    content = @Content(
                            mediaType = "text/plain",
                            examples = @ExampleObject(value = "Event processed successfully")
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Erro ao processar o evento",
                    content = @Content(
                            mediaType = "text/plain",
                            examples = @ExampleObject(value = "Error processing event: No available parking spots")
                    )
            )
    })
    public ResponseEntity<String> handleWebhookEvent(
            @Parameter(description = "Dados do evento do veículo", required = true)
            @Valid @RequestBody WebhookEventDto eventDto) {
        logger.info("Received webhook event: {}", eventDto);
        
        parkingEventService.processEvent(eventDto);
        return ResponseEntity.ok("Event processed successfully");
    }
    
    @GetMapping("/health")
    @Operation(
            summary = "Verificar saúde do endpoint webhook",
            description = "Endpoint para verificar se o serviço de webhook está funcionando"
    )
    @ApiResponse(
            responseCode = "200",
            description = "Endpoint saudável",
            content = @Content(
                    mediaType = "text/plain",
                    examples = @ExampleObject(value = "Webhook endpoint is healthy")
            )
    )
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Webhook endpoint is healthy");
    }
}

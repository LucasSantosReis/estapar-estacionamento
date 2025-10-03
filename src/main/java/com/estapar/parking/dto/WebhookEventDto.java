package com.estapar.parking.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

@Schema(description = "DTO base para eventos de webhook de veículos")
public class WebhookEventDto {
    
    @JsonProperty("license_plate")
    @NotBlank
    @Schema(description = "Placa do veículo", example = "ABC1234", required = true)
    private String licensePlate;
    
    @JsonProperty("event_type")
    @NotNull
    @Schema(description = "Tipo do evento", example = "ENTRY", allowableValues = {"ENTRY", "PARKED", "EXIT"}, required = true)
    private String eventType;
    
    @JsonProperty("entry_time")
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @Schema(description = "Data e hora de entrada", example = "2025-01-01T10:30:00")
    private LocalDateTime entryTime;
    
    @JsonProperty("exit_time")
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @Schema(description = "Data e hora de saída", example = "2025-01-01T12:30:00")
    private LocalDateTime exitTime;
    
    @JsonProperty("lat")
    @Schema(description = "Latitude da vaga", example = "-23.5505")
    private Double lat;
    
    @JsonProperty("lng")
    @Schema(description = "Longitude da vaga", example = "-46.6333")
    private Double lng;
    
    // Constructors
    public WebhookEventDto() {}
    
    public WebhookEventDto(String licensePlate, String eventType) {
        this.licensePlate = licensePlate;
        this.eventType = eventType;
    }
    
    // Getters and Setters
    public String getLicensePlate() {
        return licensePlate;
    }
    
    public void setLicensePlate(String licensePlate) {
        this.licensePlate = licensePlate;
    }
    
    public String getEventType() {
        return eventType;
    }
    
    public void setEventType(String eventType) {
        this.eventType = eventType;
    }
    
    public LocalDateTime getEntryTime() {
        return entryTime;
    }
    
    public void setEntryTime(LocalDateTime entryTime) {
        this.entryTime = entryTime;
    }
    
    public LocalDateTime getExitTime() {
        return exitTime;
    }
    
    public void setExitTime(LocalDateTime exitTime) {
        this.exitTime = exitTime;
    }
    
    public Double getLat() {
        return lat;
    }
    
    public void setLat(Double lat) {
        this.lat = lat;
    }
    
    public Double getLng() {
        return lng;
    }
    
    public void setLng(Double lng) {
        this.lng = lng;
    }
    
    @Override
    public String toString() {
        return "WebhookEventDto{" +
                "licensePlate='" + licensePlate + '\'' +
                ", eventType='" + eventType + '\'' +
                ", entryTime=" + entryTime +
                ", exitTime=" + exitTime +
                ", lat=" + lat +
                ", lng=" + lng +
                '}';
    }
}

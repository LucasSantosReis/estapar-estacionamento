package com.estapar.parking.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Schema(description = "DTO para resposta de consulta de receita")
public class RevenueResponseDto {
    
    @JsonProperty("amount")
    @Schema(description = "Valor da receita", example = "150.50")
    private BigDecimal amount;
    
    @JsonProperty("currency")
    @Schema(description = "Moeda da receita", example = "BRL")
    private String currency = "BRL";
    
    @JsonProperty("timestamp")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    @Schema(description = "Data e hora da consulta", example = "2025-01-01T10:30:00.000Z")
    private LocalDateTime timestamp;
    
    // Constructors
    public RevenueResponseDto() {
        this.timestamp = LocalDateTime.now();
    }
    
    public RevenueResponseDto(BigDecimal amount) {
        this();
        this.amount = amount;
    }
    
    public RevenueResponseDto(BigDecimal amount, String currency) {
        this();
        this.amount = amount;
        this.currency = currency;
    }
    
    public RevenueResponseDto(BigDecimal amount, String currency, LocalDateTime timestamp) {
        this.amount = amount;
        this.currency = currency;
        this.timestamp = timestamp;
    }
    
    // Getters and Setters
    public BigDecimal getAmount() {
        return amount;
    }
    
    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
    
    public String getCurrency() {
        return currency;
    }
    
    public void setCurrency(String currency) {
        this.currency = currency;
    }
    
    public LocalDateTime getTimestamp() {
        return timestamp;
    }
    
    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
    
    @Override
    public String toString() {
        return "RevenueResponseDto{" +
                "amount=" + amount +
                ", currency='" + currency + '\'' +
                ", timestamp=" + timestamp +
                '}';
    }
}

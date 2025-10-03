package com.estapar.parking.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

@Schema(description = "DTO para requisição de consulta de receita")
public class RevenueRequestDto {
    
    @NotNull
    @JsonFormat(pattern = "yyyy-MM-dd")
    @Schema(description = "Data para consulta da receita", example = "2025-01-01", required = true)
    private LocalDate date;
    
    @NotBlank
    @Schema(description = "Nome do setor", example = "A", required = true)
    private String sector;
    
    // Constructors
    public RevenueRequestDto() {}
    
    public RevenueRequestDto(LocalDate date, String sector) {
        this.date = date;
        this.sector = sector;
    }
    
    // Getters and Setters
    public LocalDate getDate() {
        return date;
    }
    
    public void setDate(LocalDate date) {
        this.date = date;
    }
    
    public String getSector() {
        return sector;
    }
    
    public void setSector(String sector) {
        this.sector = sector;
    }
    
    @Override
    public String toString() {
        return "RevenueRequestDto{" +
                "date=" + date +
                ", sector='" + sector + '\'' +
                '}';
    }
}

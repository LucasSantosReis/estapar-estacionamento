package com.estapar.parking.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class GarageConfigDto {
    
    @JsonProperty("garage")
    private List<SectorDto> garage;
    
    @JsonProperty("spots")
    private List<SpotDto> spots;
    
    // Constructors
    public GarageConfigDto() {}
    
    public GarageConfigDto(List<SectorDto> garage, List<SpotDto> spots) {
        this.garage = garage;
        this.spots = spots;
    }
    
    // Getters and Setters
    public List<SectorDto> getGarage() {
        return garage;
    }
    
    public void setGarage(List<SectorDto> garage) {
        this.garage = garage;
    }
    
    public List<SpotDto> getSpots() {
        return spots;
    }
    
    public void setSpots(List<SpotDto> spots) {
        this.spots = spots;
    }
    
    @Override
    public String toString() {
        return "GarageConfigDto{" +
                "garage=" + garage +
                ", spots=" + spots +
                '}';
    }
    
    // Inner DTOs
    public static class SectorDto {
        private String sector;
        private Double basePrice;
        private Integer max_capacity;
        
        public SectorDto() {}
        
        public SectorDto(String sector, Double basePrice, Integer max_capacity) {
            this.sector = sector;
            this.basePrice = basePrice;
            this.max_capacity = max_capacity;
        }
        
        public String getSector() {
            return sector;
        }
        
        public void setSector(String sector) {
            this.sector = sector;
        }
        
        public Double getBasePrice() {
            return basePrice;
        }
        
        public void setBasePrice(Double basePrice) {
            this.basePrice = basePrice;
        }
        
        public Integer getMax_capacity() {
            return max_capacity;
        }
        
        public void setMax_capacity(Integer max_capacity) {
            this.max_capacity = max_capacity;
        }
        
        @Override
        public String toString() {
            return "SectorDto{" +
                    "sector='" + sector + '\'' +
                    ", basePrice=" + basePrice +
                    ", max_capacity=" + max_capacity +
                    '}';
        }
    }
    
    public static class SpotDto {
        private Long id;
        private String sector;
        private Double lat;
        private Double lng;
        
        public SpotDto() {}
        
        public SpotDto(Long id, String sector, Double lat, Double lng) {
            this.id = id;
            this.sector = sector;
            this.lat = lat;
            this.lng = lng;
        }
        
        public Long getId() {
            return id;
        }
        
        public void setId(Long id) {
            this.id = id;
        }
        
        public String getSector() {
            return sector;
        }
        
        public void setSector(String sector) {
            this.sector = sector;
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
            return "SpotDto{" +
                    "id=" + id +
                    ", sector='" + sector + '\'' +
                    ", lat=" + lat +
                    ", lng=" + lng +
                    '}';
        }
    }
}

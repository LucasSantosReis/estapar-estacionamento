package com.estapar.parking.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "sectors")
public class Sector {
    
    @Id
    @Column(name = "sector_id")
    @NotBlank
    private String sector;
    
    @Column(name = "base_price", nullable = false, precision = 10, scale = 2)
    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    private BigDecimal basePrice;
    
    @Column(name = "max_capacity", nullable = false)
    @NotNull
    @Positive
    private Integer maxCapacity;
    
    @OneToMany(mappedBy = "sector", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ParkingSpot> spots = new ArrayList<>();
    
    @OneToMany(mappedBy = "sector", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ParkingEvent> events = new ArrayList<>();
    
    // Constructors
    public Sector() {}
    
    public Sector(String sector, BigDecimal basePrice, Integer maxCapacity) {
        this.sector = sector;
        this.basePrice = basePrice;
        this.maxCapacity = maxCapacity;
    }
    
    // Getters and Setters
    public String getSector() {
        return sector;
    }
    
    public void setSector(String sector) {
        this.sector = sector;
    }
    
    public BigDecimal getBasePrice() {
        return basePrice;
    }
    
    public void setBasePrice(BigDecimal basePrice) {
        this.basePrice = basePrice;
    }
    
    public Integer getMaxCapacity() {
        return maxCapacity;
    }
    
    public void setMaxCapacity(Integer maxCapacity) {
        this.maxCapacity = maxCapacity;
    }
    
    public List<ParkingSpot> getSpots() {
        return spots;
    }
    
    public void setSpots(List<ParkingSpot> spots) {
        this.spots = spots;
    }
    
    public List<ParkingEvent> getEvents() {
        return events;
    }
    
    public void setEvents(List<ParkingEvent> events) {
        this.events = events;
    }
    
    // Business methods
    public int getOccupiedSpots() {
        return (int) spots.stream().filter(spot -> !spot.isAvailable()).count();
    }
    
    public int getAvailableSpots() {
        return maxCapacity - getOccupiedSpots();
    }
    
    public double getOccupancyRate() {
        if (maxCapacity == 0) return 0.0;
        return (double) getOccupiedSpots() / maxCapacity;
    }
    
    public boolean hasAvailableSpots() {
        return getAvailableSpots() > 0;
    }
    
    public boolean isFull() {
        return getOccupiedSpots() >= maxCapacity;
    }
    
    @Override
    public String toString() {
        return "Sector{" +
                "sector='" + sector + '\'' +
                ", basePrice=" + basePrice +
                ", maxCapacity=" + maxCapacity +
                ", occupiedSpots=" + getOccupiedSpots() +
                '}';
    }
}

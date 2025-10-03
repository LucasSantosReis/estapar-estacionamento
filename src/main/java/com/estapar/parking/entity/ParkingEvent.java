package com.estapar.parking.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

@Entity
@Table(name = "parking_events")
public class ParkingEvent {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "event_id")
    private Long id;
    
    @Column(name = "license_plate", nullable = false)
    @NotBlank
    private String licensePlate;
    
    @Column(name = "sector", nullable = false)
    @NotBlank
    private String sector;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "event_type", nullable = false)
    @NotNull
    private EventType eventType;
    
    @Column(name = "entry_time")
    private LocalDateTime entryTime;
    
    @Column(name = "exit_time")
    private LocalDateTime exitTime;
    
    @Column(name = "latitude")
    private Double latitude;
    
    @Column(name = "longitude")
    private Double longitude;
    
    @Column(name = "spot_id")
    private Long spotId;
    
    @Column(name = "amount_charged")
    private Double amountCharged;
    
    @Column(name = "price_applied")
    private Double priceApplied;
    
    @Column(name = "occupancy_rate_at_entry")
    private Double occupancyRateAtEntry;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sector", referencedColumnName = "sector_id", insertable = false, updatable = false)
    private Sector sectorEntity;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "spot_id", insertable = false, updatable = false)
    private ParkingSpot parkingSpot;
    
    // Constructors
    public ParkingEvent() {
        this.createdAt = LocalDateTime.now();
    }
    
    public ParkingEvent(String licensePlate, String sector, EventType eventType) {
        this();
        this.licensePlate = licensePlate;
        this.sector = sector;
        this.eventType = eventType;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getLicensePlate() {
        return licensePlate;
    }
    
    public void setLicensePlate(String licensePlate) {
        this.licensePlate = licensePlate;
    }
    
    public String getSector() {
        return sector;
    }
    
    public void setSector(String sector) {
        this.sector = sector;
    }
    
    public EventType getEventType() {
        return eventType;
    }
    
    public void setEventType(EventType eventType) {
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
    
    public Double getLatitude() {
        return latitude;
    }
    
    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }
    
    public Double getLongitude() {
        return longitude;
    }
    
    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }
    
    public Long getSpotId() {
        return spotId;
    }
    
    public void setSpotId(Long spotId) {
        this.spotId = spotId;
    }
    
    public Double getAmountCharged() {
        return amountCharged;
    }
    
    public void setAmountCharged(Double amountCharged) {
        this.amountCharged = amountCharged;
    }
    
    public Double getPriceApplied() {
        return priceApplied;
    }
    
    public void setPriceApplied(Double priceApplied) {
        this.priceApplied = priceApplied;
    }
    
    public Double getOccupancyRateAtEntry() {
        return occupancyRateAtEntry;
    }
    
    public void setOccupancyRateAtEntry(Double occupancyRateAtEntry) {
        this.occupancyRateAtEntry = occupancyRateAtEntry;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public Sector getSectorEntity() {
        return sectorEntity;
    }
    
    public void setSectorEntity(Sector sectorEntity) {
        this.sectorEntity = sectorEntity;
    }
    
    public ParkingSpot getParkingSpot() {
        return parkingSpot;
    }
    
    public void setParkingSpot(ParkingSpot parkingSpot) {
        this.parkingSpot = parkingSpot;
    }
    
    @Override
    public String toString() {
        return "ParkingEvent{" +
                "id=" + id +
                ", licensePlate='" + licensePlate + '\'' +
                ", sector='" + sector + '\'' +
                ", eventType=" + eventType +
                ", entryTime=" + entryTime +
                ", exitTime=" + exitTime +
                ", amountCharged=" + amountCharged +
                '}';
    }
}

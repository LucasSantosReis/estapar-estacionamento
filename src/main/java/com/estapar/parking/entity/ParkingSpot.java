package com.estapar.parking.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "parking_spots")
public class ParkingSpot {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "spot_id")
    private Long id;
    
    @Column(name = "sector", nullable = false)
    @NotBlank
    private String sector;
    
    @Column(name = "latitude", nullable = false)
    @NotNull
    private Double latitude;
    
    @Column(name = "longitude", nullable = false)
    @NotNull
    private Double longitude;
    
    @Column(name = "available", nullable = false)
    private Boolean available = true;
    
    @Column(name = "occupied_by")
    private String occupiedBy; // license plate of the vehicle occupying this spot
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sector", referencedColumnName = "sector_id", insertable = false, updatable = false)
    private Sector sectorEntity;
    
    // Constructors
    public ParkingSpot() {}
    
    public ParkingSpot(Long id, String sector, Double latitude, Double longitude) {
        this.id = id;
        this.sector = sector;
        this.latitude = latitude;
        this.longitude = longitude;
        this.available = true;
    }
    
    // Getters and Setters
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
    
    public Boolean isAvailable() {
        return available;
    }
    
    public void setAvailable(Boolean available) {
        this.available = available;
    }
    
    public String getOccupiedBy() {
        return occupiedBy;
    }
    
    public void setOccupiedBy(String occupiedBy) {
        this.occupiedBy = occupiedBy;
    }
    
    public Sector getSectorEntity() {
        return sectorEntity;
    }
    
    public void setSectorEntity(Sector sectorEntity) {
        this.sectorEntity = sectorEntity;
    }
    
    // Business methods
    public void occupy(String licensePlate) {
        this.available = false;
        this.occupiedBy = licensePlate;
    }
    
    public void release() {
        this.available = true;
        this.occupiedBy = null;
    }
    
    @Override
    public String toString() {
        return "ParkingSpot{" +
                "id=" + id +
                ", sector='" + sector + '\'' +
                ", latitude=" + latitude +
                ", longitude=" + longitude +
                ", available=" + available +
                ", occupiedBy='" + occupiedBy + '\'' +
                '}';
    }
}

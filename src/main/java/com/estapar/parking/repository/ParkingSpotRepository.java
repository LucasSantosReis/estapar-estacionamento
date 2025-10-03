package com.estapar.parking.repository;

import com.estapar.parking.entity.ParkingSpot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ParkingSpotRepository extends JpaRepository<ParkingSpot, Long> {
    
    List<ParkingSpot> findBySector(String sector);
    
    List<ParkingSpot> findBySectorAndAvailable(String sector, Boolean available);
    
    Optional<ParkingSpot> findByOccupiedBy(String licensePlate);
    
    @Query("SELECT COUNT(p) FROM ParkingSpot p WHERE p.sector = :sector AND p.available = true")
    long countAvailableSpotsBySector(@Param("sector") String sector);
    
    @Query("SELECT COUNT(p) FROM ParkingSpot p WHERE p.sector = :sector AND p.available = false")
    long countOccupiedSpotsBySector(@Param("sector") String sector);
    
    @Query("SELECT p FROM ParkingSpot p WHERE p.sector = :sector AND p.available = true ORDER BY p.id LIMIT 1")
    Optional<ParkingSpot> findFirstAvailableSpotBySector(@Param("sector") String sector);
    
    @Query("SELECT COUNT(p) FROM ParkingSpot p WHERE p.available = true")
    long countByAvailableTrue();
    
    @Query("SELECT COUNT(p) FROM ParkingSpot p WHERE p.available = false")
    long countByAvailableFalse();
    
    // Validation methods to prevent duplicate parking
    @Query("SELECT COUNT(p) FROM ParkingSpot p WHERE p.occupiedBy = :licensePlate AND p.available = false")
    long countByOccupiedByAndAvailableFalse(@Param("licensePlate") String licensePlate);
    
    @Query("SELECT p FROM ParkingSpot p WHERE p.occupiedBy = :licensePlate AND p.available = false")
    List<ParkingSpot> findByOccupiedByAndAvailableFalse(@Param("licensePlate") String licensePlate);
    
    // Methods for data consistency and cleanup
    @Query("SELECT p.occupiedBy FROM ParkingSpot p WHERE p.available = false AND p.occupiedBy IS NOT NULL GROUP BY p.occupiedBy HAVING COUNT(p) > 1")
    List<String> findVehiclesWithMultipleSpots();
    
    @Query("SELECT COUNT(DISTINCT p.occupiedBy) FROM ParkingSpot p WHERE p.available = false AND p.occupiedBy IS NOT NULL")
    long countUniqueVehiclesParked();
}

package com.estapar.parking.repository;

import com.estapar.parking.entity.EventType;
import com.estapar.parking.entity.ParkingEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ParkingEventRepository extends JpaRepository<ParkingEvent, Long> {
    
    List<ParkingEvent> findByLicensePlateOrderByCreatedAtDesc(String licensePlate);
    
    List<ParkingEvent> findBySector(String sector);
    
    List<ParkingEvent> findByEventType(EventType eventType);
    
    @Query("SELECT pe FROM ParkingEvent pe WHERE pe.licensePlate = :licensePlate AND pe.eventType = :eventType ORDER BY pe.createdAt DESC")
    List<ParkingEvent> findByLicensePlateAndEventType(@Param("licensePlate") String licensePlate, 
                                                      @Param("eventType") EventType eventType);
    
    @Query("SELECT pe FROM ParkingEvent pe WHERE pe.licensePlate = :licensePlate AND pe.eventType = 'ENTRY' AND pe.entryTime IS NOT NULL ORDER BY pe.createdAt DESC")
    Optional<ParkingEvent> findLatestEntryEvent(@Param("licensePlate") String licensePlate);
    
    @Query("SELECT pe FROM ParkingEvent pe WHERE pe.licensePlate = :licensePlate AND pe.eventType = 'EXIT' AND pe.exitTime IS NOT NULL ORDER BY pe.createdAt DESC")
    Optional<ParkingEvent> findLatestExitEvent(@Param("licensePlate") String licensePlate);
    
    @Query("SELECT SUM(pe.amountCharged) FROM ParkingEvent pe WHERE pe.sector = :sector AND pe.eventType = 'EXIT' AND DATE(pe.exitTime) = :date")
    Double calculateRevenueBySectorAndDate(@Param("sector") String sector, @Param("date") LocalDate date);
    
    @Query("SELECT pe FROM ParkingEvent pe WHERE pe.sector = :sector AND pe.eventType = 'EXIT' AND pe.exitTime IS NOT NULL AND DATE(pe.exitTime) = :date")
    List<ParkingEvent> findExitEventsBySectorAndDate(@Param("sector") String sector, @Param("date") LocalDate date);
    
    // Metrics queries
    long countByEventTypeAndEntryTimeBetween(EventType eventType, LocalDateTime start, LocalDateTime end);
    
    long countByEventTypeAndExitTimeBetween(EventType eventType, LocalDateTime start, LocalDateTime end);
    
    @Query("SELECT COALESCE(SUM(pe.amountCharged), 0) FROM ParkingEvent pe WHERE pe.eventType = 'EXIT' AND DATE(pe.exitTime) = :date")
    Double calculateRevenueByDate(@Param("date") LocalDate date);
    
    @Query("SELECT COUNT(pe) FROM ParkingEvent pe WHERE pe.sector = :sector AND pe.eventType = 'ENTRY' AND pe.entryTime >= :startDate AND pe.entryTime < :endDate")
    Long countEntryEventsBySectorAndDateRange(@Param("sector") String sector, 
                                              @Param("startDate") LocalDateTime startDate, 
                                              @Param("endDate") LocalDateTime endDate);
}

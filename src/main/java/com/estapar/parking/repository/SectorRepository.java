package com.estapar.parking.repository;

import com.estapar.parking.entity.Sector;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SectorRepository extends JpaRepository<Sector, String> {
    
    Optional<Sector> findBySector(String sector);
    
    boolean existsBySector(String sector);
}

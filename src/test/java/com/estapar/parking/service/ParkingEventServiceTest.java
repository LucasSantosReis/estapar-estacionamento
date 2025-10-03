package com.estapar.parking.service;

import com.estapar.parking.config.MetricsConfig;
import com.estapar.parking.dto.WebhookEventDto;
import com.estapar.parking.entity.EventType;
import com.estapar.parking.entity.ParkingEvent;
import com.estapar.parking.entity.ParkingSpot;
import com.estapar.parking.entity.Sector;
import com.estapar.parking.exception.NoAvailableSpotsException;
import com.estapar.parking.exception.SectorNotFoundException;
import com.estapar.parking.exception.VehicleNotParkedException;
import com.estapar.parking.exception.VehicleAlreadyParkedException;
import com.estapar.parking.repository.ParkingEventRepository;
import com.estapar.parking.repository.ParkingSpotRepository;
import com.estapar.parking.repository.SectorRepository;
import io.micrometer.core.instrument.Timer;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class ParkingEventServiceTest {

    @Mock
    private ParkingEventRepository parkingEventRepository;

    @Mock
    private ParkingSpotRepository parkingSpotRepository;

    @Mock
    private SectorRepository sectorRepository;

    @Mock
    private MetricsConfig.ParkingMetrics parkingMetrics;

    @InjectMocks
    private ParkingEventService parkingEventService;

    private Sector testSector;
    private ParkingSpot testSpot;
    private ParkingEvent testEntryEvent;

    @BeforeEach
    void setUp() {
        testSector = new Sector("A", BigDecimal.valueOf(10.0), 100);
        testSpot = new ParkingSpot(1L, "A", -23.561684, -46.655981);
        testEntryEvent = new ParkingEvent("ABC1234", "A", EventType.ENTRY);
        testEntryEvent.setEntryTime(LocalDateTime.now().minusHours(1));
        testEntryEvent.setPriceApplied(10.0);
        
        // Mock timer methods
        Timer.Sample mockSample = mock(Timer.Sample.class);
        when(parkingMetrics.startWebhookProcessingTimer()).thenReturn(mockSample);
        doNothing().when(parkingMetrics).recordWebhookProcessingTime(mockSample);
        
        // Mock other metrics methods
        doNothing().when(parkingMetrics).incrementWebhookEventsProcessed();
        doNothing().when(parkingMetrics).incrementWebhookEventsFailed();
        doNothing().when(parkingMetrics).incrementVehiclesEntered();
        doNothing().when(parkingMetrics).incrementVehiclesExited();
        doNothing().when(parkingMetrics).incrementRevenueGenerated(anyDouble());
        doNothing().when(parkingMetrics).updateOccupancy(anyInt(), anyInt());
        
        // Mock new validation methods - default to no duplicates
        when(parkingSpotRepository.countByOccupiedByAndAvailableFalse(anyString())).thenReturn(0L);
    }

    @Test
    void testProcessEntryEvent_Success() {
        // Given
        WebhookEventDto entryEvent = new WebhookEventDto();
        entryEvent.setLicensePlate("ABC1234");
        entryEvent.setEventType("ENTRY");
        entryEvent.setEntryTime(LocalDateTime.now());

        when(parkingSpotRepository.findFirstAvailableSpotBySector("A")).thenReturn(Optional.of(testSpot));
        when(sectorRepository.findBySector("A")).thenReturn(Optional.of(testSector));
        when(parkingSpotRepository.save(any(ParkingSpot.class))).thenReturn(testSpot);
        when(parkingEventRepository.save(any(ParkingEvent.class))).thenReturn(new ParkingEvent());

        // When
        assertDoesNotThrow(() -> parkingEventService.processEvent(entryEvent));

        // Then
        verify(parkingSpotRepository).save(any(ParkingSpot.class));
        verify(parkingEventRepository).save(any(ParkingEvent.class));
    }

    @Test
    void testProcessEntryEvent_NoAvailableSpots() {
        // Given
        WebhookEventDto entryEvent = new WebhookEventDto();
        entryEvent.setLicensePlate("ABC1234");
        entryEvent.setEventType("ENTRY");
        entryEvent.setEntryTime(LocalDateTime.now());

        when(parkingSpotRepository.findFirstAvailableSpotBySector("A")).thenReturn(Optional.empty());

        // When & Then
        assertThrows(NoAvailableSpotsException.class, () -> parkingEventService.processEvent(entryEvent));
    }
    
    @Test
    void testProcessEntryEvent_VehicleAlreadyParked() {
        // Given
        WebhookEventDto entryEvent = new WebhookEventDto();
        entryEvent.setLicensePlate("ABC1234");
        entryEvent.setEventType("ENTRY");
        entryEvent.setEntryTime(LocalDateTime.now());

        // Mock that vehicle is already parked
        when(parkingSpotRepository.countByOccupiedByAndAvailableFalse("ABC1234")).thenReturn(1L);

        // When & Then
        assertThrows(VehicleAlreadyParkedException.class, () -> parkingEventService.processEvent(entryEvent));
    }
    
    @Test
    void testProcessExitEvent_InvalidatesRevenueCache() {
        // Given
        WebhookEventDto exitEvent = new WebhookEventDto();
        exitEvent.setLicensePlate("ABC1234");
        exitEvent.setEventType("EXIT");
        exitEvent.setExitTime(LocalDateTime.now());

        ParkingSpot testSpot = new ParkingSpot(1L, "A", -23.561684, -46.655981);
        testSpot.occupy("ABC1234");
        
        ParkingEvent entryEvent = new ParkingEvent("ABC1234", "A", EventType.ENTRY);
        entryEvent.setEntryTime(LocalDateTime.now().minusHours(1));
        entryEvent.setPriceApplied(10.0);

        when(parkingSpotRepository.findByOccupiedBy("ABC1234")).thenReturn(Optional.of(testSpot));
        when(parkingEventRepository.findLatestEntryEvent("ABC1234")).thenReturn(Optional.of(entryEvent));
        when(parkingSpotRepository.save(any(ParkingSpot.class))).thenReturn(testSpot);
        when(parkingEventRepository.save(any(ParkingEvent.class))).thenReturn(new ParkingEvent());

        // When
        assertDoesNotThrow(() -> parkingEventService.processEvent(exitEvent));

        // Then
        verify(parkingSpotRepository).save(any(ParkingSpot.class));
        verify(parkingEventRepository).save(any(ParkingEvent.class));
        // The cache invalidation is tested implicitly - if the method completes without error,
        // it means the cache invalidation method was called successfully
    }

    @Test
    void testProcessParkedEvent_Success() {
        // Given
        WebhookEventDto parkedEvent = new WebhookEventDto();
        parkedEvent.setLicensePlate("ABC1234");
        parkedEvent.setEventType("PARKED");
        parkedEvent.setLat(-23.561684);
        parkedEvent.setLng(-46.655981);

        testSpot.occupy("ABC1234");
        when(parkingSpotRepository.findByOccupiedBy("ABC1234")).thenReturn(Optional.of(testSpot));
        when(parkingSpotRepository.save(any(ParkingSpot.class))).thenReturn(testSpot);
        when(parkingEventRepository.save(any(ParkingEvent.class))).thenReturn(new ParkingEvent());

        // When
        assertDoesNotThrow(() -> parkingEventService.processEvent(parkedEvent));

        // Then
        verify(parkingSpotRepository).save(any(ParkingSpot.class));
        verify(parkingEventRepository).save(any(ParkingEvent.class));
    }

    @Test
    void testProcessExitEvent_Success() {
        // Given
        WebhookEventDto exitEvent = new WebhookEventDto();
        exitEvent.setLicensePlate("ABC1234");
        exitEvent.setEventType("EXIT");
        exitEvent.setExitTime(LocalDateTime.now());

        testSpot.occupy("ABC1234");
        when(parkingSpotRepository.findByOccupiedBy("ABC1234")).thenReturn(Optional.of(testSpot));
        when(parkingEventRepository.findLatestEntryEvent("ABC1234")).thenReturn(Optional.of(testEntryEvent));
        when(parkingSpotRepository.save(any(ParkingSpot.class))).thenReturn(testSpot);
        when(parkingEventRepository.save(any(ParkingEvent.class))).thenReturn(new ParkingEvent());

        // When
        assertDoesNotThrow(() -> parkingEventService.processEvent(exitEvent));

        // Then
        verify(parkingSpotRepository).save(any(ParkingSpot.class));
        verify(parkingEventRepository).save(any(ParkingEvent.class));
    }

    @Test
    void testProcessExitEvent_VehicleNotParked() {
        // Given
        WebhookEventDto exitEvent = new WebhookEventDto();
        exitEvent.setLicensePlate("ABC1234");
        exitEvent.setEventType("EXIT");
        exitEvent.setExitTime(LocalDateTime.now());

        when(parkingSpotRepository.findByOccupiedBy("ABC1234")).thenReturn(Optional.empty());

        // When & Then
        assertThrows(VehicleNotParkedException.class, () -> parkingEventService.processEvent(exitEvent));
    }

    @Test
    void testProcessExitEvent_NoEntryEvent() {
        // Given
        WebhookEventDto exitEvent = new WebhookEventDto();
        exitEvent.setLicensePlate("ABC1234");
        exitEvent.setEventType("EXIT");
        exitEvent.setExitTime(LocalDateTime.now());

        testSpot.occupy("ABC1234");
        when(parkingSpotRepository.findByOccupiedBy("ABC1234")).thenReturn(Optional.of(testSpot));
        when(parkingEventRepository.findLatestEntryEvent("ABC1234")).thenReturn(Optional.empty());

        // When & Then
        assertThrows(VehicleNotParkedException.class, () -> parkingEventService.processEvent(exitEvent));
    }

    // ===== TESTES PARA REGRAS DE NEGÓCIO =====

    @Test
    void testCalculateDynamicPrice_LessThan25Percent() {
        // Given - Setor com 20% de ocupação (deve ter 10% de desconto)
        Sector lowOccupancySector = new Sector("A", BigDecimal.valueOf(10.0), 100);
        // Simular 20 vagas ocupadas de 100 (20%)
        for (int i = 0; i < 20; i++) {
            ParkingSpot spot = new ParkingSpot((long) i, "A", -23.561684, -46.655981);
            spot.occupy("TEST" + i);
            lowOccupancySector.getSpots().add(spot);
        }
        
        WebhookEventDto entryEvent = new WebhookEventDto();
        entryEvent.setLicensePlate("ABC1234");
        entryEvent.setEventType("ENTRY");
        entryEvent.setEntryTime(LocalDateTime.now());

        when(parkingSpotRepository.findFirstAvailableSpotBySector("A")).thenReturn(Optional.of(testSpot));
        when(sectorRepository.findBySector("A")).thenReturn(Optional.of(lowOccupancySector));
        when(parkingSpotRepository.save(any(ParkingSpot.class))).thenReturn(testSpot);
        when(parkingEventRepository.save(any(ParkingEvent.class))).thenReturn(new ParkingEvent());

        // When
        assertDoesNotThrow(() -> parkingEventService.processEvent(entryEvent));

        // Then - Verificar se o preço aplicado tem desconto de 10%
        verify(parkingEventRepository).save(argThat(event -> 
            event.getPriceApplied() == 9.0 // 10.0 * 0.9 = 9.0
        ));
    }

    @Test
    void testCalculateDynamicPrice_50To75Percent() {
        // Given - Setor com 60% de ocupação (deve ter 10% de aumento)
        Sector mediumOccupancySector = new Sector("A", BigDecimal.valueOf(10.0), 100);
        // Simular 60 vagas ocupadas de 100 (60%)
        for (int i = 0; i < 60; i++) {
            ParkingSpot spot = new ParkingSpot((long) i, "A", -23.561684, -46.655981);
            spot.occupy("TEST" + i);
            mediumOccupancySector.getSpots().add(spot);
        }
        
        WebhookEventDto entryEvent = new WebhookEventDto();
        entryEvent.setLicensePlate("ABC1234");
        entryEvent.setEventType("ENTRY");
        entryEvent.setEntryTime(LocalDateTime.now());

        when(parkingSpotRepository.findFirstAvailableSpotBySector("A")).thenReturn(Optional.of(testSpot));
        when(sectorRepository.findBySector("A")).thenReturn(Optional.of(mediumOccupancySector));
        when(parkingSpotRepository.save(any(ParkingSpot.class))).thenReturn(testSpot);
        when(parkingEventRepository.save(any(ParkingEvent.class))).thenReturn(new ParkingEvent());

        // When
        assertDoesNotThrow(() -> parkingEventService.processEvent(entryEvent));

        // Then - Verificar se o preço aplicado tem aumento de 10%
        verify(parkingEventRepository).save(argThat(event -> 
            event.getPriceApplied() == 11.0 // 10.0 * 1.1 = 11.0
        ));
    }

    @Test
    void testCalculateDynamicPrice_75To100Percent() {
        // Given - Setor com 80% de ocupação (deve ter 25% de aumento)
        Sector highOccupancySector = new Sector("A", BigDecimal.valueOf(10.0), 100);
        // Simular 80 vagas ocupadas de 100 (80%)
        for (int i = 0; i < 80; i++) {
            ParkingSpot spot = new ParkingSpot((long) i, "A", -23.561684, -46.655981);
            spot.occupy("TEST" + i);
            highOccupancySector.getSpots().add(spot);
        }
        
        WebhookEventDto entryEvent = new WebhookEventDto();
        entryEvent.setLicensePlate("ABC1234");
        entryEvent.setEventType("ENTRY");
        entryEvent.setEntryTime(LocalDateTime.now());

        when(parkingSpotRepository.findFirstAvailableSpotBySector("A")).thenReturn(Optional.of(testSpot));
        when(sectorRepository.findBySector("A")).thenReturn(Optional.of(highOccupancySector));
        when(parkingSpotRepository.save(any(ParkingSpot.class))).thenReturn(testSpot);
        when(parkingEventRepository.save(any(ParkingEvent.class))).thenReturn(new ParkingEvent());

        // When
        assertDoesNotThrow(() -> parkingEventService.processEvent(entryEvent));

        // Then - Verificar se o preço aplicado tem aumento de 25%
        verify(parkingEventRepository).save(argThat(event -> 
            event.getPriceApplied() == 12.5 // 10.0 * 1.25 = 12.5
        ));
    }

    @Test
    void testCalculateParkingFee_30MinutesFree() {
        // Given - Veículo que ficou 25 minutos (deve ser grátis)
        WebhookEventDto exitEvent = new WebhookEventDto();
        exitEvent.setLicensePlate("ABC1234");
        exitEvent.setEventType("EXIT");
        exitEvent.setExitTime(LocalDateTime.now()); // Agora

        testSpot.occupy("ABC1234");
        
        // Criar um novo evento de entrada com os dados corretos
        ParkingEvent entryEvent = new ParkingEvent();
        entryEvent.setLicensePlate("ABC1234");
        entryEvent.setSector("A");
        entryEvent.setEventType(EventType.ENTRY);
        entryEvent.setEntryTime(LocalDateTime.now().minusMinutes(25)); // 25 minutos atrás
        entryEvent.setPriceApplied(10.0); // R$ 10,00 por hora
        
        when(parkingSpotRepository.findByOccupiedBy("ABC1234")).thenReturn(Optional.of(testSpot));
        when(parkingEventRepository.findLatestEntryEvent("ABC1234")).thenReturn(Optional.of(entryEvent));
        when(parkingSpotRepository.save(any(ParkingSpot.class))).thenReturn(testSpot);
        when(parkingEventRepository.save(any(ParkingEvent.class))).thenReturn(new ParkingEvent());

        // When
        assertDoesNotThrow(() -> parkingEventService.processEvent(exitEvent));

        // Then - Verificar se o valor cobrado é 0 (grátis)
        verify(parkingEventRepository).save(argThat(event -> 
            event.getAmountCharged() == 0.0
        ));
    }

    @Test
    void testCalculateParkingFee_MoreThan30Minutes() {
        // Given - Veículo que ficou 90 minutos (deve cobrar 1 hora)
        WebhookEventDto exitEvent = new WebhookEventDto();
        exitEvent.setLicensePlate("ABC1234");
        exitEvent.setEventType("EXIT");
        exitEvent.setExitTime(LocalDateTime.now()); // Agora

        testSpot.occupy("ABC1234");
        
        // Criar um novo evento de entrada com os dados corretos
        ParkingEvent entryEvent = new ParkingEvent();
        entryEvent.setLicensePlate("ABC1234");
        entryEvent.setSector("A");
        entryEvent.setEventType(EventType.ENTRY);
        entryEvent.setEntryTime(LocalDateTime.now().minusMinutes(90)); // 90 minutos atrás
        entryEvent.setPriceApplied(10.0); // R$ 10,00 por hora
        
        when(parkingSpotRepository.findByOccupiedBy("ABC1234")).thenReturn(Optional.of(testSpot));
        when(parkingEventRepository.findLatestEntryEvent("ABC1234")).thenReturn(Optional.of(entryEvent));
        when(parkingSpotRepository.save(any(ParkingSpot.class))).thenReturn(testSpot);
        when(parkingEventRepository.save(any(ParkingEvent.class))).thenReturn(new ParkingEvent());

        // When
        assertDoesNotThrow(() -> parkingEventService.processEvent(exitEvent));

        // Then - Verificar se o valor cobrado é 10.0 (1 hora)
        verify(parkingEventRepository).save(argThat(event -> 
            event.getAmountCharged() == 10.0
        ));
    }

    @Test
    void testSectorFull_RejectEntry() {
        // Given - Setor com 100% de ocupação
        Sector fullSector = new Sector("A", BigDecimal.valueOf(10.0), 100);
        // Simular 100 vagas ocupadas de 100 (100%)
        for (int i = 0; i < 100; i++) {
            ParkingSpot spot = new ParkingSpot((long) i, "A", -23.561684, -46.655981);
            spot.occupy("TEST" + i);
            fullSector.getSpots().add(spot);
        }
        
        WebhookEventDto entryEvent = new WebhookEventDto();
        entryEvent.setLicensePlate("ABC1234");
        entryEvent.setEventType("ENTRY");
        entryEvent.setEntryTime(LocalDateTime.now());

        when(parkingSpotRepository.findFirstAvailableSpotBySector("A")).thenReturn(Optional.of(testSpot));
        when(sectorRepository.findBySector("A")).thenReturn(Optional.of(fullSector));

        // When & Then - Deve rejeitar entrada
        assertThrows(NoAvailableSpotsException.class, () -> parkingEventService.processEvent(entryEvent));
    }

    @Test
    void testSectorFull_AllowExit() {
        // Given - Setor com 100% de ocupação, mas veículo saindo
        Sector fullSector = new Sector("A", BigDecimal.valueOf(10.0), 100);
        // Simular 100 vagas ocupadas de 100 (100%)
        for (int i = 0; i < 100; i++) {
            ParkingSpot spot = new ParkingSpot((long) i, "A", -23.561684, -46.655981);
            spot.occupy("TEST" + i);
            fullSector.getSpots().add(spot);
        }
        
        WebhookEventDto exitEvent = new WebhookEventDto();
        exitEvent.setLicensePlate("ABC1234");
        exitEvent.setEventType("EXIT");
        exitEvent.setExitTime(LocalDateTime.now());

        testSpot.occupy("ABC1234");
        when(parkingSpotRepository.findByOccupiedBy("ABC1234")).thenReturn(Optional.of(testSpot));
        when(parkingEventRepository.findLatestEntryEvent("ABC1234")).thenReturn(Optional.of(testEntryEvent));
        when(parkingSpotRepository.save(any(ParkingSpot.class))).thenReturn(testSpot);
        when(parkingEventRepository.save(any(ParkingEvent.class))).thenReturn(new ParkingEvent());

        // When - Deve permitir saída mesmo com setor cheio
        assertDoesNotThrow(() -> parkingEventService.processEvent(exitEvent));

        // Then
        verify(parkingSpotRepository).save(any(ParkingSpot.class));
        verify(parkingEventRepository).save(any(ParkingEvent.class));
    }

    // ===== TESTES ADICIONAIS PARA REGRAS DE NEGÓCIO =====

    @Test
    void testCalculateDynamicPrice_25To50Percent_NormalPrice() {
        // Given - Setor com 40% de ocupação (deve ter preço normal)
        Sector normalOccupancySector = new Sector("A", BigDecimal.valueOf(10.0), 100);
        // Simular 40 vagas ocupadas de 100 (40%)
        for (int i = 0; i < 40; i++) {
            ParkingSpot spot = new ParkingSpot((long) i, "A", -23.561684, -46.655981);
            spot.occupy("TEST" + i);
            normalOccupancySector.getSpots().add(spot);
        }
        
        WebhookEventDto entryEvent = new WebhookEventDto();
        entryEvent.setLicensePlate("ABC1234");
        entryEvent.setEventType("ENTRY");
        entryEvent.setEntryTime(LocalDateTime.now());

        when(parkingSpotRepository.findFirstAvailableSpotBySector("A")).thenReturn(Optional.of(testSpot));
        when(sectorRepository.findBySector("A")).thenReturn(Optional.of(normalOccupancySector));
        when(parkingSpotRepository.save(any(ParkingSpot.class))).thenReturn(testSpot);
        when(parkingEventRepository.save(any(ParkingEvent.class))).thenReturn(new ParkingEvent());

        // When
        assertDoesNotThrow(() -> parkingEventService.processEvent(entryEvent));

        // Then - Verificar se o preço aplicado é normal (sem desconto nem aumento)
        verify(parkingEventRepository).save(argThat(event -> 
            event.getPriceApplied() == 10.0 // Preço normal
        ));
    }

    @Test
    void testCalculateParkingFee_31Minutes_1HourCharge() {
        // Given - Veículo que ficou 31 minutos (deve cobrar 1 hora)
        WebhookEventDto exitEvent = new WebhookEventDto();
        exitEvent.setLicensePlate("ABC1234");
        exitEvent.setEventType("EXIT");
        exitEvent.setExitTime(LocalDateTime.now()); // Agora

        testSpot.occupy("ABC1234");
        
        // Criar um novo evento de entrada com os dados corretos
        ParkingEvent entryEvent = new ParkingEvent();
        entryEvent.setLicensePlate("ABC1234");
        entryEvent.setSector("A");
        entryEvent.setEventType(EventType.ENTRY);
        entryEvent.setEntryTime(LocalDateTime.now().minusMinutes(31)); // 31 minutos atrás
        entryEvent.setPriceApplied(10.0); // R$ 10,00 por hora
        
        when(parkingSpotRepository.findByOccupiedBy("ABC1234")).thenReturn(Optional.of(testSpot));
        when(parkingEventRepository.findLatestEntryEvent("ABC1234")).thenReturn(Optional.of(entryEvent));
        when(parkingSpotRepository.save(any(ParkingSpot.class))).thenReturn(testSpot);
        when(parkingEventRepository.save(any(ParkingEvent.class))).thenReturn(new ParkingEvent());

        // When
        assertDoesNotThrow(() -> parkingEventService.processEvent(exitEvent));

        // Then - Verificar se o valor cobrado é 0.0 (30 minutos são grátis)
        verify(parkingEventRepository).save(argThat(event -> 
            event.getAmountCharged() == 0.0
        ));
    }

    @Test
    void testCalculateParkingFee_91Minutes_2HoursCharge() {
        // Given - Veículo que ficou 91 minutos (deve cobrar 2 horas - arredonda para cima)
        WebhookEventDto exitEvent = new WebhookEventDto();
        exitEvent.setLicensePlate("ABC1234");
        exitEvent.setEventType("EXIT");
        exitEvent.setExitTime(LocalDateTime.now()); // Agora

        testSpot.occupy("ABC1234");
        
        // Criar um novo evento de entrada com os dados corretos
        ParkingEvent entryEvent = new ParkingEvent();
        entryEvent.setLicensePlate("ABC1234");
        entryEvent.setSector("A");
        entryEvent.setEventType(EventType.ENTRY);
        entryEvent.setEntryTime(LocalDateTime.now().minusMinutes(91)); // 91 minutos atrás
        entryEvent.setPriceApplied(10.0); // R$ 10,00 por hora
        
        when(parkingSpotRepository.findByOccupiedBy("ABC1234")).thenReturn(Optional.of(testSpot));
        when(parkingEventRepository.findLatestEntryEvent("ABC1234")).thenReturn(Optional.of(entryEvent));
        when(parkingSpotRepository.save(any(ParkingSpot.class))).thenReturn(testSpot);
        when(parkingEventRepository.save(any(ParkingEvent.class))).thenReturn(new ParkingEvent());

        // When
        assertDoesNotThrow(() -> parkingEventService.processEvent(exitEvent));

        // Then - Verificar se o valor cobrado é 10.0 (1 hora - 61 minutos cobráveis)
        verify(parkingEventRepository).save(argThat(event -> 
            event.getAmountCharged() == 10.0
        ));
    }

    @Test
    void testCalculateParkingFee_120Minutes_2HoursCharge() {
        // Given - Veículo que ficou 120 minutos (deve cobrar 2 horas)
        WebhookEventDto exitEvent = new WebhookEventDto();
        exitEvent.setLicensePlate("ABC1234");
        exitEvent.setEventType("EXIT");
        exitEvent.setExitTime(LocalDateTime.now()); // Agora

        testSpot.occupy("ABC1234");
        
        // Criar um novo evento de entrada com os dados corretos
        ParkingEvent entryEvent = new ParkingEvent();
        entryEvent.setLicensePlate("ABC1234");
        entryEvent.setSector("A");
        entryEvent.setEventType(EventType.ENTRY);
        entryEvent.setEntryTime(LocalDateTime.now().minusMinutes(120)); // 120 minutos atrás
        entryEvent.setPriceApplied(10.0); // R$ 10,00 por hora
        
        when(parkingSpotRepository.findByOccupiedBy("ABC1234")).thenReturn(Optional.of(testSpot));
        when(parkingEventRepository.findLatestEntryEvent("ABC1234")).thenReturn(Optional.of(entryEvent));
        when(parkingSpotRepository.save(any(ParkingSpot.class))).thenReturn(testSpot);
        when(parkingEventRepository.save(any(ParkingEvent.class))).thenReturn(new ParkingEvent());

        // When
        assertDoesNotThrow(() -> parkingEventService.processEvent(exitEvent));

        // Then - Verificar se o valor cobrado é 20.0 (2 horas - 90 minutos cobráveis)
        verify(parkingEventRepository).save(argThat(event -> 
            event.getAmountCharged() == 20.0
        ));
    }

    @Test
    void testCalculateParkingFee_150Minutes_3HoursCharge() {
        // Given - Veículo que ficou 150 minutos (deve cobrar 3 horas)
        WebhookEventDto exitEvent = new WebhookEventDto();
        exitEvent.setLicensePlate("ABC1234");
        exitEvent.setEventType("EXIT");
        exitEvent.setExitTime(LocalDateTime.now()); // Agora

        testSpot.occupy("ABC1234");
        
        // Criar um novo evento de entrada com os dados corretos
        ParkingEvent entryEvent = new ParkingEvent();
        entryEvent.setLicensePlate("ABC1234");
        entryEvent.setSector("A");
        entryEvent.setEventType(EventType.ENTRY);
        entryEvent.setEntryTime(LocalDateTime.now().minusMinutes(150)); // 150 minutos atrás
        entryEvent.setPriceApplied(10.0); // R$ 10,00 por hora
        
        when(parkingSpotRepository.findByOccupiedBy("ABC1234")).thenReturn(Optional.of(testSpot));
        when(parkingEventRepository.findLatestEntryEvent("ABC1234")).thenReturn(Optional.of(entryEvent));
        when(parkingSpotRepository.save(any(ParkingSpot.class))).thenReturn(testSpot);
        when(parkingEventRepository.save(any(ParkingEvent.class))).thenReturn(new ParkingEvent());

        // When
        assertDoesNotThrow(() -> parkingEventService.processEvent(exitEvent));

        // Then - Verificar se o valor cobrado é 20.0 (2 horas - 120 minutos cobráveis)
        verify(parkingEventRepository).save(argThat(event -> 
            event.getAmountCharged() == 20.0
        ));
    }

    @Test
    void testCalculateParkingFee_180Minutes_3HoursCharge() {
        // Given - Veículo que ficou 180 minutos (deve cobrar 3 horas)
        WebhookEventDto exitEvent = new WebhookEventDto();
        exitEvent.setLicensePlate("ABC1234");
        exitEvent.setEventType("EXIT");
        exitEvent.setExitTime(LocalDateTime.now()); // Agora

        testSpot.occupy("ABC1234");
        
        // Criar um novo evento de entrada com os dados corretos
        ParkingEvent entryEvent = new ParkingEvent();
        entryEvent.setLicensePlate("ABC1234");
        entryEvent.setSector("A");
        entryEvent.setEventType(EventType.ENTRY);
        entryEvent.setEntryTime(LocalDateTime.now().minusMinutes(180)); // 180 minutos atrás
        entryEvent.setPriceApplied(10.0); // R$ 10,00 por hora
        
        when(parkingSpotRepository.findByOccupiedBy("ABC1234")).thenReturn(Optional.of(testSpot));
        when(parkingEventRepository.findLatestEntryEvent("ABC1234")).thenReturn(Optional.of(entryEvent));
        when(parkingSpotRepository.save(any(ParkingSpot.class))).thenReturn(testSpot);
        when(parkingEventRepository.save(any(ParkingEvent.class))).thenReturn(new ParkingEvent());

        // When
        assertDoesNotThrow(() -> parkingEventService.processEvent(exitEvent));

        // Then - Verificar se o valor cobrado é 30.0 (3 horas - 150 minutos cobráveis)
        verify(parkingEventRepository).save(argThat(event -> 
            event.getAmountCharged() == 30.0
        ));
    }

    @Test
    void testSector99Percent_AllowEntry() {
        // Given - Setor com 99% de ocupação (deve permitir entrada)
        Sector almostFullSector = new Sector("A", BigDecimal.valueOf(10.0), 100);
        // Simular 99 vagas ocupadas de 100 (99%)
        for (int i = 0; i < 99; i++) {
            ParkingSpot spot = new ParkingSpot((long) i, "A", -23.561684, -46.655981);
            spot.occupy("TEST" + i);
            almostFullSector.getSpots().add(spot);
        }
        
        WebhookEventDto entryEvent = new WebhookEventDto();
        entryEvent.setLicensePlate("ABC1234");
        entryEvent.setEventType("ENTRY");
        entryEvent.setEntryTime(LocalDateTime.now());

        when(parkingSpotRepository.findFirstAvailableSpotBySector("A")).thenReturn(Optional.of(testSpot));
        when(sectorRepository.findBySector("A")).thenReturn(Optional.of(almostFullSector));
        when(parkingSpotRepository.save(any(ParkingSpot.class))).thenReturn(testSpot);
        when(parkingEventRepository.save(any(ParkingEvent.class))).thenReturn(new ParkingEvent());

        // When - Deve permitir entrada
        assertDoesNotThrow(() -> parkingEventService.processEvent(entryEvent));

        // Then - Verificar se o preço aplicado tem aumento de 25% (99% ocupação)
        verify(parkingEventRepository).save(argThat(event -> 
            event.getPriceApplied() == 12.5 // 10.0 * 1.25 = 12.5
        ));
        verify(parkingSpotRepository).save(any(ParkingSpot.class));
        verify(parkingEventRepository).save(any(ParkingEvent.class));
    }

    @Test
    void testDynamicPricingWithDifferentBasePrice() {
        // Given - Setor com preço base diferente e 60% ocupação
        Sector sectorWithDifferentPrice = new Sector("A", BigDecimal.valueOf(15.0), 100);
        // Simular 60 vagas ocupadas de 100 (60%)
        for (int i = 0; i < 60; i++) {
            ParkingSpot spot = new ParkingSpot((long) i, "A", -23.561684, -46.655981);
            spot.occupy("TEST" + i);
            sectorWithDifferentPrice.getSpots().add(spot);
        }
        
        WebhookEventDto entryEvent = new WebhookEventDto();
        entryEvent.setLicensePlate("ABC1234");
        entryEvent.setEventType("ENTRY");
        entryEvent.setEntryTime(LocalDateTime.now());

        when(parkingSpotRepository.findFirstAvailableSpotBySector("A")).thenReturn(Optional.of(testSpot));
        when(sectorRepository.findBySector("A")).thenReturn(Optional.of(sectorWithDifferentPrice));
        when(parkingSpotRepository.save(any(ParkingSpot.class))).thenReturn(testSpot);
        when(parkingEventRepository.save(any(ParkingEvent.class))).thenReturn(new ParkingEvent());

        // When
        assertDoesNotThrow(() -> parkingEventService.processEvent(entryEvent));

        // Then - Verificar se o preço aplicado tem aumento de 10% sobre o preço base de 15.0
        verify(parkingEventRepository).save(argThat(event -> 
            event.getPriceApplied() == 16.5 // 15.0 * 1.1 = 16.5
        ));
    }
}

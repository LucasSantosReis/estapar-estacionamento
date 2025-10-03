package com.estapar.parking.service;

import com.estapar.parking.config.MetricsConfig;
import com.estapar.parking.dto.RevenueRequestDto;
import com.estapar.parking.dto.RevenueResponseDto;
import com.estapar.parking.entity.ParkingEvent;
import com.estapar.parking.entity.EventType;
import com.estapar.parking.repository.ParkingEventRepository;
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
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class RevenueServiceTest {

    @Mock
    private ParkingEventRepository parkingEventRepository;

    @Mock
    private SectorRepository sectorRepository;

    @Mock
    private MetricsConfig.ParkingMetrics parkingMetrics;

    @InjectMocks
    private RevenueService revenueService;

    private RevenueRequestDto requestDto;
    private ParkingEvent exitEvent1;
    private ParkingEvent exitEvent2;

    @BeforeEach
    void setUp() {
        requestDto = new RevenueRequestDto(LocalDate.of(2025, 1, 1), "A");
        
        exitEvent1 = new ParkingEvent("ABC1234", "A", EventType.EXIT);
        exitEvent1.setExitTime(LocalDateTime.of(2025, 1, 1, 14, 0));
        exitEvent1.setAmountCharged(20.0);
        
        exitEvent2 = new ParkingEvent("XYZ9876", "A", EventType.EXIT);
        exitEvent2.setExitTime(LocalDateTime.of(2025, 1, 1, 16, 30));
        exitEvent2.setAmountCharged(15.0);
        
        // Mock timer methods
        Timer.Sample mockSample = mock(Timer.Sample.class);
        when(parkingMetrics.startRevenueCalculationTimer()).thenReturn(mockSample);
        doNothing().when(parkingMetrics).recordRevenueCalculationTime(mockSample);
    }

    @Test
    void testCalculateRevenue_Success() {
        // Given
        when(sectorRepository.existsBySector("A")).thenReturn(true);
        when(parkingEventRepository.calculateRevenueBySectorAndDate("A", LocalDate.of(2025, 1, 1)))
                .thenReturn(35.0);

        // When
        RevenueResponseDto result = revenueService.calculateRevenue(requestDto);

        // Then
        assertNotNull(result);
        assertEquals(BigDecimal.valueOf(35.0), result.getAmount());
        assertEquals("BRL", result.getCurrency());
        assertNotNull(result.getTimestamp());
        
        verify(sectorRepository).existsBySector("A");
        verify(parkingEventRepository).calculateRevenueBySectorAndDate("A", LocalDate.of(2025, 1, 1));
    }

    @Test
    void testCalculateRevenue_SectorNotFound() {
        // Given
        when(sectorRepository.existsBySector("B")).thenReturn(false);
        requestDto.setSector("B");

        // When
        RevenueResponseDto result = revenueService.calculateRevenue(requestDto);

        // Then
        assertNotNull(result);
        assertEquals(BigDecimal.ZERO, result.getAmount());
        assertEquals("BRL", result.getCurrency());
        
        verify(sectorRepository).existsBySector("B");
        verify(parkingEventRepository, never()).calculateRevenueBySectorAndDate(any(), any());
    }

    @Test
    void testCalculateRevenue_NoRevenue() {
        // Given
        when(sectorRepository.existsBySector("A")).thenReturn(true);
        when(parkingEventRepository.calculateRevenueBySectorAndDate("A", LocalDate.of(2025, 1, 1)))
                .thenReturn(null);

        // When
        RevenueResponseDto result = revenueService.calculateRevenue(requestDto);

        // Then
        assertNotNull(result);
        assertEquals(BigDecimal.ZERO, result.getAmount());
        assertEquals("BRL", result.getCurrency());
        
        verify(sectorRepository).existsBySector("A");
        verify(parkingEventRepository).calculateRevenueBySectorAndDate("A", LocalDate.of(2025, 1, 1));
    }

    @Test
    void testGetExitEventsForRevenue_Success() {
        // Given
        List<ParkingEvent> expectedEvents = Arrays.asList(exitEvent1, exitEvent2);
        when(parkingEventRepository.findExitEventsBySectorAndDate("A", LocalDate.of(2025, 1, 1)))
                .thenReturn(expectedEvents);

        // When
        List<ParkingEvent> result = revenueService.getExitEventsForRevenue(requestDto);

        // Then
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(expectedEvents, result);
        
        verify(parkingEventRepository).findExitEventsBySectorAndDate("A", LocalDate.of(2025, 1, 1));
    }
}

package com.estapar.parking.controller;

import com.estapar.parking.dto.RevenueRequestDto;
import com.estapar.parking.dto.RevenueResponseDto;
import com.estapar.parking.service.RevenueService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(RevenueController.class)
class RevenueControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private RevenueService revenueService;

    @Autowired
    private ObjectMapper objectMapper;

    private RevenueRequestDto requestDto;
    private RevenueResponseDto responseDto;

    @BeforeEach
    void setUp() {
        requestDto = new RevenueRequestDto(LocalDate.of(2025, 1, 1), "A");
        responseDto = new RevenueResponseDto(BigDecimal.valueOf(150.0));
    }

    @Test
    void testGetRevenue_Success() throws Exception {
        // Given
        when(revenueService.calculateRevenue(any(RevenueRequestDto.class))).thenReturn(responseDto);

        // When & Then
        mockMvc.perform(get("/revenue")
                .param("date", "2025-01-01")
                .param("sector", "A"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.amount").value(150.0))
                .andExpect(jsonPath("$.currency").value("BRL"))
                .andExpect(jsonPath("$.timestamp").exists());

        verify(revenueService).calculateRevenue(any(RevenueRequestDto.class));
    }

    @Test
    void testGetRevenuePost_Success() throws Exception {
        // Given
        when(revenueService.calculateRevenue(any(RevenueRequestDto.class))).thenReturn(responseDto);

        // When & Then
        mockMvc.perform(post("/revenue")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.amount").value(150.0))
                .andExpect(jsonPath("$.currency").value("BRL"))
                .andExpect(jsonPath("$.timestamp").exists());

        verify(revenueService).calculateRevenue(any(RevenueRequestDto.class));
    }

    @Test
    void testGetRevenue_InvalidRequest() throws Exception {
        // When & Then
        mockMvc.perform(get("/revenue")
                .param("sector", "A")) // Missing date parameter
                .andExpect(status().isBadRequest());

        verify(revenueService, never()).calculateRevenue(any(RevenueRequestDto.class));
    }

    @Test
    void testGetRevenue_InvalidPostRequest() throws Exception {
        // Given
        RevenueRequestDto invalidRequest = new RevenueRequestDto();
        invalidRequest.setSector("A"); // Missing date

        // When & Then
        mockMvc.perform(post("/revenue")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());

        verify(revenueService, never()).calculateRevenue(any(RevenueRequestDto.class));
    }
}

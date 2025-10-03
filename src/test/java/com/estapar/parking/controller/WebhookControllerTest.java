package com.estapar.parking.controller;

import com.estapar.parking.dto.WebhookEventDto;
import com.estapar.parking.service.ParkingEventService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(WebhookController.class)
class WebhookControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ParkingEventService parkingEventService;

    @Autowired
    private ObjectMapper objectMapper;

    private WebhookEventDto entryEvent;
    private WebhookEventDto parkedEvent;
    private WebhookEventDto exitEvent;

    @BeforeEach
    void setUp() {
        entryEvent = new WebhookEventDto();
        entryEvent.setLicensePlate("ABC1234");
        entryEvent.setEventType("ENTRY");
        entryEvent.setEntryTime(java.time.LocalDateTime.now());

        parkedEvent = new WebhookEventDto();
        parkedEvent.setLicensePlate("ABC1234");
        parkedEvent.setEventType("PARKED");
        parkedEvent.setLat(-23.561684);
        parkedEvent.setLng(-46.655981);

        exitEvent = new WebhookEventDto();
        exitEvent.setLicensePlate("ABC1234");
        exitEvent.setEventType("EXIT");
        exitEvent.setExitTime(java.time.LocalDateTime.now());
    }

    @Test
    void testHandleWebhookEvent_Entry_Success() throws Exception {
        // Given
        doNothing().when(parkingEventService).processEvent(any(WebhookEventDto.class));

        // When & Then
        mockMvc.perform(post("/webhook")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(entryEvent)))
                .andExpect(status().isOk())
                .andExpect(content().string("Event processed successfully"));

        verify(parkingEventService).processEvent(any(WebhookEventDto.class));
    }

    @Test
    void testHandleWebhookEvent_Parked_Success() throws Exception {
        // Given
        doNothing().when(parkingEventService).processEvent(any(WebhookEventDto.class));

        // When & Then
        mockMvc.perform(post("/webhook")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(parkedEvent)))
                .andExpect(status().isOk())
                .andExpect(content().string("Event processed successfully"));

        verify(parkingEventService).processEvent(any(WebhookEventDto.class));
    }

    @Test
    void testHandleWebhookEvent_Exit_Success() throws Exception {
        // Given
        doNothing().when(parkingEventService).processEvent(any(WebhookEventDto.class));

        // When & Then
        mockMvc.perform(post("/webhook")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(exitEvent)))
                .andExpect(status().isOk())
                .andExpect(content().string("Event processed successfully"));

        verify(parkingEventService).processEvent(any(WebhookEventDto.class));
    }

    @Test
    void testHandleWebhookEvent_InvalidEvent() throws Exception {
        // Given
        WebhookEventDto invalidEvent = new WebhookEventDto();
        // Missing required fields

        // When & Then
        mockMvc.perform(post("/webhook")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidEvent)))
                .andExpect(status().isBadRequest());

        verify(parkingEventService, never()).processEvent(any(WebhookEventDto.class));
    }

    @Test
    void testHealthCheck() throws Exception {
        // When & Then
        mockMvc.perform(get("/webhook/health"))
                .andExpect(status().isOk())
                .andExpect(content().string("Webhook endpoint is healthy"));
    }
}

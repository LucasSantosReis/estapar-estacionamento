package com.estapar.parking;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class ParkingManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(ParkingManagementApplication.class, args);
    }
}

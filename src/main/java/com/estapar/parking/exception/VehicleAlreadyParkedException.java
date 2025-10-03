package com.estapar.parking.exception;

public class VehicleAlreadyParkedException extends RuntimeException {
    
    public VehicleAlreadyParkedException(String message) {
        super(message);
    }
    
    public VehicleAlreadyParkedException(String message, Throwable cause) {
        super(message, cause);
    }
}

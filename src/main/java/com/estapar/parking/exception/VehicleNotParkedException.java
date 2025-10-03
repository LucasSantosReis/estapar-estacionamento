package com.estapar.parking.exception;

public class VehicleNotParkedException extends RuntimeException {
    
    public VehicleNotParkedException(String message) {
        super(message);
    }
    
    public VehicleNotParkedException(String message, Throwable cause) {
        super(message, cause);
    }
}

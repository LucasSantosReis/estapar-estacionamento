package com.estapar.parking.exception;

public class SectorNotFoundException extends RuntimeException {
    
    public SectorNotFoundException(String message) {
        super(message);
    }
    
    public SectorNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}

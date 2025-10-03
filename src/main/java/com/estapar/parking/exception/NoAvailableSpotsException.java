package com.estapar.parking.exception;

public class NoAvailableSpotsException extends RuntimeException {
    
    public NoAvailableSpotsException(String message) {
        super(message);
    }
    
    public NoAvailableSpotsException(String message, Throwable cause) {
        super(message, cause);
    }
}

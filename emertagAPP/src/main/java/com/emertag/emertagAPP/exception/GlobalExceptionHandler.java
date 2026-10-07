package com.emertag.emertagAPP.exception;

import java.util.HashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

@RestControllerAdvice
public class GlobalExceptionHandler {

@ExceptionHandler(IllegalArgumentException.class)
public ResponseEntity<Map<String, String>> tratarIllegalArgument(IllegalArgumentException ex){
    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
    .body(Map.of("erro", ex.getMessage())); 
}

@ExceptionHandler(SecurityException.class)
 public ResponseEntity<Map<String, String>> tratarSecurity(SecurityException ex){
    return ResponseEntity.status(HttpStatus.FORBIDDEN)
    .body(Map.of("erro", ex.getMessage()));
 }

@ExceptionHandler(MethodArgumentNotValidException.class)
public ResponseEntity<Map<String, String>> tratarValidacao(MethodArgumentNotValidException ex) {
    Map<String, String> erros = new HashMap<>();

    ex.getBindingResult().getFieldErrors().forEach(erro ->
            erros.put(erro.getField(), erro.getDefaultMessage())
    );

    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erros);
}

@ExceptionHandler(MaxUploadSizeExceededException.class)
public ResponseEntity<Map<String, String>> tratarArquivoGrande(MaxUploadSizeExceededException ex){
    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
    .body(Map.of("erro", "A imagem deve ter no máximo 5 MB."));
}

}

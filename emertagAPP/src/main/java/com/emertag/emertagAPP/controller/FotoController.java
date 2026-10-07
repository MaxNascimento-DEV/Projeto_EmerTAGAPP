package com.emertag.emertagAPP.controller;

import com.emertag.emertagAPP.dtos.FotoBase64DTO;
import com.emertag.emertagAPP.service.FotoService;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
public class FotoController {

    private final FotoService fotoService;

    public FotoController(FotoService fotoService) {
        this.fotoService = fotoService;
    }

    // Recebe a foto (campo "arquivo") e devolve { "url": "/uploads/..." } para gravar em fotoUrl
    @PostMapping(value = "/fotos", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, String>> enviar(@RequestParam("arquivo") MultipartFile arquivo) {
        String url = fotoService.salvar(arquivo);
        return ResponseEntity.status(201).body(Map.of("url", url));
    }

    // Mesma rota, mas com a imagem em base64 num JSON: é o formato que o app usa
    // (o fetch do Expo não envia arquivos por { uri } no FormData)
    @PostMapping(value = "/fotos", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, String>> enviarBase64(@Valid @RequestBody FotoBase64DTO dto) {
        String tipo = dto.getMimeType() == null || dto.getMimeType().isBlank() ? "image/jpeg" : dto.getMimeType();
        String url = fotoService.salvarBase64(dto.getBase64(), tipo);
        return ResponseEntity.status(201).body(Map.of("url", url));
    }
}

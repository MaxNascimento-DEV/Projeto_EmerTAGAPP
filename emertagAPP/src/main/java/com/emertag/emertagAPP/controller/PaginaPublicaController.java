package com.emertag.emertagAPP.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.util.UriUtils;

import java.nio.charset.StandardCharsets;

@Controller
public class PaginaPublicaController {

    // Link curto gravado no QR Code: /e/{token} abre a página pública de emergência
    @GetMapping("/e/{token}")
    public String abrirPaginaEmergencia(@PathVariable String token) {
        return "redirect:/pages/emergencia.html?token=" + UriUtils.encode(token, StandardCharsets.UTF_8);
    }
}

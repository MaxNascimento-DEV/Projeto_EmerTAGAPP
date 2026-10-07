package com.emertag.emertagAPP.controller;

import com.emertag.emertagAPP.dtos.PrivacidadePerfilDTO;
import com.emertag.emertagAPP.entity.PrivacidadePerfil;
import com.emertag.emertagAPP.entity.Usuario;
import com.emertag.emertagAPP.mapper.PrivacidadePerfilMapper;
import com.emertag.emertagAPP.service.PrivacidadePerfilService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/perfis/{idPerfil}/privacidade")
public class PrivacidadePerfilController {

    private final PrivacidadePerfilService privacidadePerfilService;
    private final PrivacidadePerfilMapper privacidadePerfilMapper; 

    public PrivacidadePerfilController(PrivacidadePerfilService privacidadePerfilService, PrivacidadePerfilMapper privacidadePerfilMapper){
        this.privacidadePerfilMapper = privacidadePerfilMapper; 
        this.privacidadePerfilService = privacidadePerfilService; 
    }

    @GetMapping
    public ResponseEntity<PrivacidadePerfilDTO> buscar(@PathVariable Long idPerfil){
        PrivacidadePerfil privacidade = privacidadePerfilService.buscarPorPerfil(idPerfil);
        return ResponseEntity.ok(privacidadePerfilMapper.paraDTO(privacidade)); 
    }

    @PutMapping
    public ResponseEntity<PrivacidadePerfilDTO> atualizar(@PathVariable Long idPerfil, @Valid @RequestBody PrivacidadePerfilDTO dto, @AuthenticationPrincipal Usuario solicitante){ 
        PrivacidadePerfil preferencias = privacidadePerfilMapper.paraEntity(dto);
        PrivacidadePerfil atualizado = privacidadePerfilService.atualizar(idPerfil, preferencias, solicitante);

        return ResponseEntity.ok(privacidadePerfilMapper.paraDTO(atualizado)); 
    }

}

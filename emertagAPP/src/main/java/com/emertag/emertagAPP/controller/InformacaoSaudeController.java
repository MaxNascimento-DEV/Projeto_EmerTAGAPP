package com.emertag.emertagAPP.controller;

import com.emertag.emertagAPP.dtos.DadosSaudeResponseDTO;
import com.emertag.emertagAPP.dtos.InformacaoSaudeRequestDTO;
import com.emertag.emertagAPP.entity.InformacaoSaude;
import com.emertag.emertagAPP.entity.Usuario;
import com.emertag.emertagAPP.mapper.InformacaoSaudeMapper;
import com.emertag.emertagAPP.service.InformacaoSaudeService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/perfis/{idPerfil}/saude")
public class InformacaoSaudeController {
    
    private final InformacaoSaudeService informacaoSaudeService;
    private final InformacaoSaudeMapper informacaoSaudeMapper; 

    public InformacaoSaudeController(InformacaoSaudeService informacaoSaudeService, InformacaoSaudeMapper informacaoSaudeMapper){
        this.informacaoSaudeMapper = informacaoSaudeMapper;
        this.informacaoSaudeService = informacaoSaudeService; 
    }

    @GetMapping
    public ResponseEntity<DadosSaudeResponseDTO> listar(@PathVariable Long idPerfil){
        var agrupado = informacaoSaudeService.listarAgrupadoPorTipo(idPerfil);
        return ResponseEntity.ok(informacaoSaudeMapper.paraResponseDTO(agrupado)); 
    }

    @PostMapping 
    public ResponseEntity<Void> adicionar(@PathVariable Long idPerfil, @Valid @RequestBody InformacaoSaudeRequestDTO dto, @AuthenticationPrincipal Usuario solicitante){

       InformacaoSaude info = informacaoSaudeService.adicionar( idPerfil, dto.getTipo(), dto.getDescricao(), solicitante);
        return  ResponseEntity.status(201).build(); 
    }

    @DeleteMapping("/{idInformacao}")
    public ResponseEntity<Void> remover(@PathVariable Long idPerfil, @PathVariable Long idInformacao, @AuthenticationPrincipal Usuario solicitante){

        informacaoSaudeService.remover(idInformacao, idPerfil, solicitante);
        return ResponseEntity.noContent().build(); 

    }

}   

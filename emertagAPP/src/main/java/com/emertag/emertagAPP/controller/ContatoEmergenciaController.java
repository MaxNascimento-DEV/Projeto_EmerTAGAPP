package com.emertag.emertagAPP.controller;

import com.emertag.emertagAPP.dtos.ContatoEmergenciaRequestDTO;
import com.emertag.emertagAPP.dtos.ContatoEmergenciaResponseDTO;
import com.emertag.emertagAPP.entity.ContatoEmergencia;
import com.emertag.emertagAPP.entity.Usuario;
import com.emertag.emertagAPP.mapper.ContatoEmergenciaMapper;
import com.emertag.emertagAPP.service.ContatoEmergenciaService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/perfil/{idPerfil}/contatos")
public class ContatoEmergenciaController {

    private final ContatoEmergenciaService contatoEmergenciaService;
    private final ContatoEmergenciaMapper contatoEmergenciaMapper;

    public ContatoEmergenciaController(ContatoEmergenciaService contatoEmergenciaService, ContatoEmergenciaMapper contatoEmergenciaMapper){
        this.contatoEmergenciaMapper = contatoEmergenciaMapper;
        this.contatoEmergenciaService = contatoEmergenciaService;
    }

    @PostMapping
    public ResponseEntity<ContatoEmergenciaResponseDTO> adicionar(@PathVariable Long idPerfil, @Valid @RequestBody ContatoEmergenciaRequestDTO dto, @AuthenticationPrincipal Usuario solicitante){

        ContatoEmergencia contato = contatoEmergenciaService.adicionar(idPerfil, dto.getNome(), dto.getRelacao(), dto.getTelefone(), solicitante);

        return ResponseEntity.status(201).body(contatoEmergenciaMapper.paraResponseDTO(contato));

    }

    @GetMapping
     public ResponseEntity<List<ContatoEmergenciaResponseDTO>> listar(@PathVariable Long idPerfil){
        List<ContatoEmergenciaResponseDTO> contatos = contatoEmergenciaService.listarPorPerfil(idPerfil)
        .stream()
        .map(contatoEmergenciaMapper::paraResponseDTO)
        .collect(Collectors.toList());

        return ResponseEntity.ok(contatos); 
        
    }   

    @PutMapping("/{idContato}")
    public ResponseEntity<ContatoEmergenciaResponseDTO> atualizar(@PathVariable Long idPerfil, @PathVariable  Long idContato, @Valid @RequestBody ContatoEmergenciaRequestDTO dto, @AuthenticationPrincipal Usuario solicitante){

        ContatoEmergencia atualizado = contatoEmergenciaService.atualizar(idContato, idPerfil, dto.getNome(), dto.getRelacao(), dto.getTelefone(), solicitante);

        return ResponseEntity.ok(contatoEmergenciaMapper.paraResponseDTO(atualizado)); 
    }
    
    @DeleteMapping("/{idContato}")
    public ResponseEntity<Void> remover(@PathVariable Long idPerfil, @PathVariable Long idContato, @AuthenticationPrincipal Usuario solicitante){
        
        contatoEmergenciaService.remover(idContato, idPerfil, solicitante);
        return ResponseEntity.noContent().build(); 
    }

}

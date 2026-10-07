package com.emertag.emertagAPP.controller;

import com.emertag.emertagAPP.dtos.ConviteRedeRequestDTO;
import com.emertag.emertagAPP.dtos.ConviteRedeResponseDTO;
import com.emertag.emertagAPP.entity.ConviteRede;
import com.emertag.emertagAPP.entity.Usuario;
import com.emertag.emertagAPP.mapper.ConviteRedeMapper;
import com.emertag.emertagAPP.service.ConviteRedeService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
public class ConviteRedeController {

    private final ConviteRedeService conviteRedeService;
    private final ConviteRedeMapper conviteRedeMapper;

    public ConviteRedeController(ConviteRedeService conviteRedeService, ConviteRedeMapper conviteRedeMapper) {
        this.conviteRedeService = conviteRedeService;
        this.conviteRedeMapper = conviteRedeMapper;
    }

    @PostMapping("/perfis/{idPerfil}/convites")
    public ResponseEntity<ConviteRedeResponseDTO> criar(@PathVariable long idPerfil, @Valid @RequestBody ConviteRedeRequestDTO dto, @AuthenticationPrincipal Usuario solicitante){

        ConviteRede convite = conviteRedeService.criar(idPerfil, dto.getEmailConvidado(), dto.getPodeVisualizarPrivado(), dto.getPodeEditar(), solicitante);
        return ResponseEntity.status(201).body(conviteRedeMapper.paraResponseDTO(convite)); 
    }
    
    @GetMapping("/perfis/{idPerfil}/convites")
    public ResponseEntity<List<ConviteRedeResponseDTO>> listarPorPerfil(@PathVariable Long idPerfil) {
        List<ConviteRedeResponseDTO> convites = conviteRedeService.listarPendentesPorPerfil(idPerfil)
                .stream()
                .map(conviteRedeMapper::paraResponseDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(convites);
    }

    @GetMapping("/meus-convites")
    public ResponseEntity<List<ConviteRedeResponseDTO>> listarMeusConvites(
            @AuthenticationPrincipal Usuario usuario) {

        List<ConviteRedeResponseDTO> convites = conviteRedeService.listarPendentesPorEmail(usuario.getEmail())
                .stream()
                .map(conviteRedeMapper::paraResponseDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(convites);
    }

    @PostMapping("/convites/{idConvite}/aceitar")
    public ResponseEntity<Void> aceitar(
            @PathVariable Long idConvite,
            @AuthenticationPrincipal Usuario usuario) {

        conviteRedeService.aceitar(idConvite, usuario);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/convites/{idConvite}/recusar")
    public ResponseEntity<Void> recusar(
            @PathVariable Long idConvite,
            @AuthenticationPrincipal Usuario usuario) {

        conviteRedeService.recusar(idConvite, usuario);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/perfis/{idPerfil}/convites/{idConvite}")
    public ResponseEntity<Void> cancelar(
            @PathVariable Long idPerfil,
            @PathVariable Long idConvite,
            @AuthenticationPrincipal Usuario solicitante) {

        conviteRedeService.cancelar(idConvite, idPerfil, solicitante);
        return ResponseEntity.noContent().build();
    }
    
}
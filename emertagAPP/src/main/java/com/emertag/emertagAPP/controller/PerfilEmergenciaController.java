package com.emertag.emertagAPP.controller;

import com.emertag.emertagAPP.dtos.*;
import com.emertag.emertagAPP.entity.PerfilEmergencia;
import com.emertag.emertagAPP.entity.Usuario;
import com.emertag.emertagAPP.mapper.PerfilEmergenciaMapper;
import com.emertag.emertagAPP.service.*;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.stream.Collectors;

@RestController 
@RequestMapping("/perfis") 

public class PerfilEmergenciaController {

   private final AutorizacaoPerfilService autorizacaoPerfilService;
   private final PerfilEmergenciaService perfilEmergenciaService;
   private final InformacaoSaudeService informacaoSaudeService;
   private final ContatoEmergenciaService contatoEmergenciaService;
   private final PrivacidadePerfilService privacidadePerfilService;
   private final PerfilEmergenciaMapper perfilEmergenciaMapper;

    public PerfilEmergenciaController(PerfilEmergenciaService perfilEmergenciaService, InformacaoSaudeService informacaoSaudeService, ContatoEmergenciaService contatoEmergenciaService, PrivacidadePerfilService privacidadePerfilService, PerfilEmergenciaMapper perfilEmergenciaMapper, AutorizacaoPerfilService autorizacaoPerfilService) {
        this.perfilEmergenciaService = perfilEmergenciaService;
        this.informacaoSaudeService = informacaoSaudeService;
        this.contatoEmergenciaService = contatoEmergenciaService;
        this.privacidadePerfilService = privacidadePerfilService;
        this.perfilEmergenciaMapper = perfilEmergenciaMapper;
        this.autorizacaoPerfilService = autorizacaoPerfilService;
    }

    @PostMapping("/criar")
    public ResponseEntity<PerfilEmergenciaResponseDTO> criar(@AuthenticationPrincipal Usuario usuarioAutenticado, @Valid @RequestBody PerfilEmergenciaRequestDTO dto){

        PerfilEmergencia perfil = perfilEmergenciaMapper.paraEntity(dto);
        PerfilEmergencia salvo = perfilEmergenciaService.criar(perfil, usuarioAutenticado);
 
        PerfilEmergenciaResponseDTO responseDTO = perfilEmergenciaMapper.paraResponseDTO(salvo);

        URI location = ServletUriComponentsBuilder
                        .fromCurrentRequest()
                        .path("/{id}")
                        .buildAndExpand(salvo.getIdPerfil())
                        .toUri();

        return ResponseEntity.created(location).body(responseDTO);
    }

    @GetMapping("/meus-perfis")
    public ResponseEntity<List<PerfilEmergenciaResponseDTO>> listarMeusPerfis(@AuthenticationPrincipal Usuario administrador){
        List<PerfilEmergenciaResponseDTO> perfis = perfilEmergenciaService.listarPorAdministrador(administrador.getIdUsuario())
                .stream()
                .map(perfilEmergenciaMapper::paraResponseDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(perfis);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PerfilEmergenciaResponseDTO> atualizarPerfil(@PathVariable Long id, @Valid @RequestBody PerfilEmergenciaRequestDTO dto, @AuthenticationPrincipal Usuario solicitante){

        PerfilEmergencia dadosAtualizados = perfilEmergenciaMapper.paraEntity(dto);
        PerfilEmergencia atualizado = perfilEmergenciaService.atualizar(id, dadosAtualizados, solicitante);

        return ResponseEntity.ok(perfilEmergenciaMapper.paraResponseDTO(atualizado));
    }

    @PostMapping ("/{id}/regenerar-token")
    public ResponseEntity<PerfilEmergenciaResponseDTO> regenerarToken(@PathVariable Long id, @AuthenticationPrincipal Usuario solicitante){
        
        PerfilEmergencia perfil = perfilEmergenciaService.regenerarToken(id, solicitante);
        return ResponseEntity.ok(perfilEmergenciaMapper.paraResponseDTO(perfil));
    }

    @GetMapping("/publico/{token}")
    public ResponseEntity<PerfilEmergenciaPublicoDTO> acessoPublico(@PathVariable String token){

        PerfilEmergencia perfil = perfilEmergenciaService.buscarPorToken(token);

        var privacidade = privacidadePerfilService.buscarPorPerfil(perfil.getIdPerfil());
        var informacoes = informacaoSaudeService.listarPorPerfilCompleto(perfil.getIdPerfil());
        var contatos = contatoEmergenciaService.listarPorPerfil(perfil.getIdPerfil());

        PerfilEmergenciaPublicoDTO dto = perfilEmergenciaMapper.paraPublicoDTO(perfil, privacidade, informacoes, contatos);

        return ResponseEntity.ok(dto); 
    }







}

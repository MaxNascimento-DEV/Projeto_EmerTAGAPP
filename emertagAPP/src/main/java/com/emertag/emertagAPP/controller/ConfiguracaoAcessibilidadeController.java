package com.emertag.emertagAPP.controller;

import com.emertag.emertagAPP.dtos.ConfiguracaoAcessibilidadeRequestDTO;
import com.emertag.emertagAPP.dtos.ConfiguracaoAcessibilidadeResponseDTO;
import com.emertag.emertagAPP.entity.ConfiguracaoAcessibilidade;
import com.emertag.emertagAPP.entity.Usuario;
import com.emertag.emertagAPP.mapper.ConfiguracaoAcessibilidadeMapper;
import com.emertag.emertagAPP.service.ConfiguracaoAcessibilidadeService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController 
@RequestMapping("/configuracoes/acessibilidade")
public class ConfiguracaoAcessibilidadeController {
    
    private final ConfiguracaoAcessibilidadeService configuracaoAcessibilidadeService;
    private final ConfiguracaoAcessibilidadeMapper configuracaoAcessibilidadeMapper;

    public ConfiguracaoAcessibilidadeController(ConfiguracaoAcessibilidadeService configuracaoAcessibilidadeService, ConfiguracaoAcessibilidadeMapper configuracaoAcessibilidadeMapper) {
        this.configuracaoAcessibilidadeService = configuracaoAcessibilidadeService;
        this.configuracaoAcessibilidadeMapper = configuracaoAcessibilidadeMapper;
    }

    @GetMapping
    public ResponseEntity<ConfiguracaoAcessibilidadeResponseDTO> buscar(@AuthenticationPrincipal Usuario usuario){
        ConfiguracaoAcessibilidade config = configuracaoAcessibilidadeService.buscarPorUsuario(usuario.getIdUsuario());
        return ResponseEntity.ok(configuracaoAcessibilidadeMapper.paraResponseDTO(config));
    }

     @PutMapping
     public ResponseEntity<ConfiguracaoAcessibilidadeResponseDTO> salvar(@AuthenticationPrincipal Usuario usuario, @Valid @RequestBody ConfiguracaoAcessibilidadeRequestDTO dto){
        ConfiguracaoAcessibilidade salvo = configuracaoAcessibilidadeService.salvar(usuario, dto.getTamanhoTexto(), dto.getAltoContraste());
        return ResponseEntity.ok(configuracaoAcessibilidadeMapper.paraResponseDTO(salvo));
     }   









}

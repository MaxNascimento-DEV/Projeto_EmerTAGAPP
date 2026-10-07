package com.emertag.emertagAPP.controller;

import java.net.URI;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.emertag.emertagAPP.dtos.*;
import com.emertag.emertagAPP.entity.Usuario;
import com.emertag.emertagAPP.mapper.UsuarioMapper;
import com.emertag.emertagAPP.security.JwtService;
import com.emertag.emertagAPP.service.UsuarioService;

import jakarta.validation.Valid;


@RestController 
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final UsuarioMapper usuarioMapper;
    private final JwtService jwtService;

    public UsuarioController(UsuarioService usuarioService, UsuarioMapper usuarioMapper, JwtService jwtService) {
        this.usuarioService = usuarioService;
        this.usuarioMapper = usuarioMapper;
        this.jwtService = jwtService;
    }

    @PostMapping 
    public ResponseEntity<UsuarioResponseDTO> cadastrar(@Valid @RequestBody UsuarioRequestDTO dto){
        Usuario usuario = usuarioMapper.paraEntity(dto);
        Usuario salvo = usuarioService.cadastrar(usuario, dto.getSenha()); 

        UsuarioResponseDTO response = usuarioMapper.paraUsuarioResponseDTO(salvo); 
        URI location = ServletUriComponentsBuilder
                        .fromCurrentRequest()
                        .path("/{id}")
                        .buildAndExpand(salvo.getIdUsuario())
                        .toUri();

        return ResponseEntity.created(location).body(response);
    }   
    
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody  LoginRequestDTO dto){
        Usuario usuario = usuarioService.autenticar(dto.getEmail(), dto.getSenha());

        String token = jwtService.gerarToken(usuario.getEmail());

        LoginResponseDTO response = LoginResponseDTO.builder()
                                    .token(token)
                                    .usuario(usuarioMapper.paraUsuarioResponseDTO(usuario))
                                    .build(); 

        return ResponseEntity.ok(response); 
    
    }

    @GetMapping("meus-dados")
     public ResponseEntity<UsuarioResponseDTO> meusDados(@AuthenticationPrincipal Usuario usuarioAutenticado) {
        return ResponseEntity.ok(usuarioMapper.paraUsuarioResponseDTO(usuarioAutenticado));
    }

    @PostMapping("/atualizar-dados")
    public ResponseEntity<UsuarioResponseDTO> atualizarDados(@AuthenticationPrincipal Usuario usuarioAutenticado, @Valid @RequestBody AtualizarUsuarioDTO dto){
        Usuario atualizado = usuarioService.atualizar(usuarioAutenticado, dto.getNome(), dto.getTelefone(), dto.getFotoUrl());
        return ResponseEntity.ok(usuarioMapper.paraUsuarioResponseDTO(atualizado));
    }

    @PutMapping("/senha")
    public ResponseEntity<Void> alterarSenha(@AuthenticationPrincipal Usuario usuarioAutenticado, @Valid @RequestBody AlterarSenhaDTO dto){
        usuarioService.alterarSenha(usuarioAutenticado, dto.getSenhaAtual(), dto.getNovaSenha());
        return ResponseEntity.noContent().build();
    }

}

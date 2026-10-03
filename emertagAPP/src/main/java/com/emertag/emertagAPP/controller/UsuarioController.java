package com.emertag.emertagAPP.controller;

import java.net.URI;

import org.springframework.http.ResponseEntity;
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

    @GetMapping("/{id}")
        public ResponseEntity<UsuarioResponseDTO> buscarPorId(@PathVariable Long id){
            Usuario usuario = usuarioService.buscarPorId(id);
            return ResponseEntity.ok(usuarioMapper.paraUsuarioResponseDTO(usuario)); 
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




}

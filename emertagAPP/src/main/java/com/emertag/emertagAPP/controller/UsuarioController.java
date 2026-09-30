package com.emertag.emertagAPP.controller;

import java.net.URI;

import org.apache.catalina.connector.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.emertag.emertagAPP.dtos.LoginRequestDTO;
import com.emertag.emertagAPP.dtos.LoginResponseDTO;
import com.emertag.emertagAPP.dtos.UsuarioRequestDTO;
import com.emertag.emertagAPP.dtos.UsuarioResponseDTO;
import com.emertag.emertagAPP.entity.Usuario;
import com.emertag.emertagAPP.mapper.UsuarioMapper;
import com.emertag.emertagAPP.service.UsuarioService;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;


@RestController 
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final UsuarioMapper usuarioMapper;

    public UsuarioController(UsuarioService usuarioService, UsuarioMapper usuarioMapper){
        this.usuarioService = usuarioService;
        this.usuarioMapper = usuarioMapper;
        
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

        String token = "TOKEN_AUTENTICADO";

        LoginResponseDTO response = LoginResponseDTO.builder()
                                    .token(token)
                                    .usuario(usuarioMapper.paraUsuarioResponseDTO(usuario))
                                    .build(); 

        return ResponseEntity.ok(response); 
    
    }

    


}

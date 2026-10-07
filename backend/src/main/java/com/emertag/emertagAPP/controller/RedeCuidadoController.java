package com.emertag.emertagAPP.controller;

import com.emertag.emertagAPP.dtos.RedeCuidadoResponseDTO;
import com.emertag.emertagAPP.entity.Usuario;
import com.emertag.emertagAPP.mapper.RedeCuidadoMapper;
import com.emertag.emertagAPP.service.RedeCuidadoService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
public class RedeCuidadoController {
    private final RedeCuidadoService redeCuidadoService;
    private final RedeCuidadoMapper redeCuidadoMapper;

    public RedeCuidadoController(RedeCuidadoMapper redeCuidadoMapper, RedeCuidadoService redeCuidadoService){
        this.redeCuidadoMapper = redeCuidadoMapper;
        this.redeCuidadoService = redeCuidadoService; 
    }


    @GetMapping("/perfis/{idPerfil}/cuidadores")
    public ResponseEntity<List<RedeCuidadoResponseDTO>> listarCuidadores(@PathVariable Long idPerfil){
        List<RedeCuidadoResponseDTO> cuidadores = redeCuidadoService.listarCuidadoresDoPerfil(idPerfil)
        .stream()
        .map(redeCuidadoMapper::paraResponseDTO)
        .collect(Collectors.toList()); 

        return ResponseEntity.ok(cuidadores); 
    }

    @GetMapping("/minha-rede")
        public ResponseEntity<List<RedeCuidadoResponseDTO>> listarPerfisQueCuido(@AuthenticationPrincipal Usuario usuario) {

        List<RedeCuidadoResponseDTO> perfis = redeCuidadoService.listarPerfisQueCuido(usuario.getIdUsuario())
                .stream()
                .map(redeCuidadoMapper::paraResponseDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(perfis);
    }

    @PutMapping("/perfis/{idPerfil}/cuidadores/{idUsuario}")
    public ResponseEntity<RedeCuidadoResponseDTO> atualizarPermissoes(@PathVariable Long idPerfil, @PathVariable Long idUsuario, @RequestParam boolean podeVisualizarPrivado, @RequestParam boolean podeEditar,  @AuthenticationPrincipal Usuario solicitante) {

        var rede = redeCuidadoService.atualizarPermissoes(idPerfil, idUsuario, podeVisualizarPrivado, podeEditar, solicitante);

        return ResponseEntity.ok(redeCuidadoMapper.paraResponseDTO(rede));
    }

    @DeleteMapping("/perfis/{idPerfil}/cuidadores/{idUsuario}")
    public ResponseEntity<Void> removerCuidador(@PathVariable Long idPerfil, @PathVariable Long idUsuario, @AuthenticationPrincipal Usuario solicitante) {

        redeCuidadoService.removerCuidador(idPerfil, idUsuario, solicitante);
        return ResponseEntity.noContent().build();
    }

}

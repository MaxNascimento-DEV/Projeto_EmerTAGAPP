package com.emertag.emertagAPP.mapper;

import org.springframework.stereotype.Component;

import com.emertag.emertagAPP.dtos.UsuarioRequestDTO;
import com.emertag.emertagAPP.dtos.UsuarioResponseDTO;
import com.emertag.emertagAPP.entity.Usuario;


@Component
public class UsuarioMapper {

    public UsuarioResponseDTO paraUsuarioResponseDTO(Usuario usuario){
        return UsuarioResponseDTO.builder()
                .idUsuario(usuario.getIdUsuario())
                .nome(usuario.getNome())
                .emial(usuario.getEmail())
                .telefone(usuario.getTelefone())
                .fotoUrl(usuario.getFotoUrl())
                .criadoEm(usuario.getCriadoEM())
                .build(); 
    }

    public Usuario paraEntity(UsuarioRequestDTO dto){
        return Usuario.builder()
        .nome(dto.getNome())
        .email(dto.getEmail())
        .telefone(dto.getTelefone())
        .fotoUrl(dto.getFotoUrl())
        .build(); 
    }
}

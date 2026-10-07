package com.emertag.emertagAPP.mapper;

import org.springframework.stereotype.Component;
import com.emertag.emertagAPP.dtos.RedeCuidadoResponseDTO;
import com.emertag.emertagAPP.entity.RedeCuidado;

@Component 
public class RedeCuidadoMapper {
    
    public RedeCuidadoResponseDTO paraResponseDTO(RedeCuidado rede){
        return  RedeCuidadoResponseDTO.builder()
        .idRede(rede.getIdRede())
        .idPerfil(rede.getPerfil().getIdPerfil())
        .nomePerfil(rede.getPerfil().getNome())
        .idUsuario(rede.getUsuario().getIdUsuario())
        .nomeUsuario(rede.getUsuario().getNome())
        .podeVisualizarPrivado(rede.getPodeVisualizarPrivado())
        .podeEditar(rede.getPodeEditar())
        .build(); 
    }
}

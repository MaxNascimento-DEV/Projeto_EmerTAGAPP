package com.emertag.emertagAPP.mapper;

import org.springframework.stereotype.Component;
import com.emertag.emertagAPP.dtos.ContatoEmergenciaResponseDTO;
import com.emertag.emertagAPP.entity.ContatoEmergencia;

@Component 
public class ContatoEmergenciaMapper {

    public ContatoEmergenciaResponseDTO paraResponseDTO(ContatoEmergencia contato){
        return ContatoEmergenciaResponseDTO.builder()
        .idContato(contato.getIdContato())
        .nome(contato.getNome())
        .relacao(contato.getRelacao())
        .telefone(contato.getTelefone())
        .build(); 
    }
}

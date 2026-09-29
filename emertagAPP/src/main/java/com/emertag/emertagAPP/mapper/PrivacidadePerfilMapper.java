package com.emertag.emertagAPP.mapper;

import org.springframework.stereotype.Component;
import com.emertag.emertagAPP.dtos.PrivacidadePerfilDTO;
import com.emertag.emertagAPP.entity.PrivacidadePerfil;

@Component 
public class PrivacidadePerfilMapper {

    public PrivacidadePerfilDTO paraDTO(PrivacidadePerfil privacidade){
        return PrivacidadePerfilDTO.builder()
        .exibirAlergias(privacidade.getExibirAlergias())
        .exibirCondicoes(privacidade.getExibirCondicoes())
        .exibirMedicamentos(privacidade.getExibirMedicamentos())
        .exibirBiosseguranca(privacidade.getExibirBiosseguranca())
        .exibirIdade(privacidade.getExibirIdade())
        .exibirNecessidades(privacidade.getExibirNecessidades())
        .exibirTipoSanguineo(privacidade.getExibirTipoSanguineo())
        .build(); 
    }

    public PrivacidadePerfil paraEntity(PrivacidadePerfilDTO dto){
        return PrivacidadePerfil.builder()
        .exibirAlergias(dto.getExibirAlergias())
        .exibirCondicoes(dto.getExibirCondicoes())
        .exibirMedicamentos(dto.getExibirMedicamentos())
        .exibirBiosseguranca(dto.getExibirBiosseguranca())
        .exibirIdade(dto.getExibirIdade())
        .exibirNecessidades(dto.getExibirNecessidades())
        .exibirTipoSanguineo(dto.getExibirTipoSanguineo())
        .build(); 
    }

}

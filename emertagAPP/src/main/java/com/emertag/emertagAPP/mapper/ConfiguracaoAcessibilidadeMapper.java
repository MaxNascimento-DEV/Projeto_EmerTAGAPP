package com.emertag.emertagAPP.mapper;

import org.springframework.stereotype.Component;
import com.emertag.emertagAPP.dtos.ConfiguracaoAcessibilidadeResponseDTO;
import com.emertag.emertagAPP.entity.ConfiguracaoAcessibilidade;

@Component 
public class ConfiguracaoAcessibilidadeMapper {

    public ConfiguracaoAcessibilidadeResponseDTO paraResonseDTO(ConfiguracaoAcessibilidade config){
        return ConfiguracaoAcessibilidadeResponseDTO.builder()
        .tamanhoTexto(config.getTamanhoTexto())
        .altoContraste(config.getAltoContraste())
        .build();
    }
}

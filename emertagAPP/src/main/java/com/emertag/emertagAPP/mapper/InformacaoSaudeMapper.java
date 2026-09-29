package com.emertag.emertagAPP.mapper;

import com.emertag.emertagAPP.dtos.DadosSaudeResponseDTO;
import com.emertag.emertagAPP.enums.TipoInformacaoSaude;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component 
public class InformacaoSaudeMapper {

    public DadosSaudeResponseDTO paraResponseDTO(Map<TipoInformacaoSaude, List<String>> agrupado){
        return DadosSaudeResponseDTO.builder()
        .alergia(agrupado.getOrDefault(TipoInformacaoSaude.ALERGIA, List.of()))
        .condicoesSaude(agrupado.getOrDefault(TipoInformacaoSaude.CODICAO_SAUDE, List.of()))
        .medicamentos(agrupado.getOrDefault(TipoInformacaoSaude.MEDICAMENTO_CONTINUO, List.of()))
        .necessidadeEspecificas(agrupado.getOrDefault(TipoInformacaoSaude.NECESSIDADE_ESPECIFICA, List.of()))
        .biosseguranca(agrupado.getOrDefault(TipoInformacaoSaude.BIOSSEGURANCA, List.of()))
        .build(); 
        
    }
}

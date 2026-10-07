package com.emertag.emertagAPP.mapper;

import com.emertag.emertagAPP.dtos.DadosSaudeRequestDTO;
import com.emertag.emertagAPP.dtos.DadosSaudeResponseDTO;
import com.emertag.emertagAPP.enums.TipoInformacaoSaude;
import org.springframework.stereotype.Component;

import java.util.EnumMap;
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

    public Map<TipoInformacaoSaude, List<String>> paraMapa(DadosSaudeRequestDTO dto){
        Map<TipoInformacaoSaude, List<String>> mapa = new EnumMap<>(TipoInformacaoSaude.class);
        mapa.put(TipoInformacaoSaude.ALERGIA, dto.getAlergia());
        mapa.put(TipoInformacaoSaude.CODICAO_SAUDE, dto.getCondicoesSaude());
        mapa.put(TipoInformacaoSaude.MEDICAMENTO_CONTINUO, dto.getMedicamentos());
        mapa.put(TipoInformacaoSaude.NECESSIDADE_ESPECIFICA, dto.getNecessidadeEspecificas());
        mapa.put(TipoInformacaoSaude.BIOSSEGURANCA, dto.getBiosseguranca());
        return mapa;
    }
}

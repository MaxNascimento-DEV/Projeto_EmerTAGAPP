package com.emertag.emertagAPP.mapper;

import com.emertag.emertagAPP.dtos.ContatoEmergenciaPublicoDTO;
import com.emertag.emertagAPP.dtos.PerfilEmergenciaPublicoDTO;
import com.emertag.emertagAPP.dtos.PerfilEmergenciaRequestDTO;
import com.emertag.emertagAPP.dtos.PerfilEmergenciaResponseDTO;
import com.emertag.emertagAPP.entity.ContatoEmergencia;
import com.emertag.emertagAPP.entity.InformacaoSaude;
import com.emertag.emertagAPP.entity.PerfilEmergencia;
import com.emertag.emertagAPP.entity.PrivacidadePerfil;
import com.emertag.emertagAPP.enums.TipoInformacaoSaude;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;
import java.util.stream.Collectors;


@Component
public class PerfilEmergenciaMapper {
    
    public PerfilEmergenciaResponseDTO paraResponseDTO(PerfilEmergencia perfil){
        return PerfilEmergenciaResponseDTO.builder()
        .idPerfil(perfil.getIdPerfil())
        .nome(perfil.getNome())
        .dataNascimento(perfil.getDataNascimento())
        .tipoSanguineo(perfil.getTipoSanguineo())
        .fotoUrl(perfil.getFotoUrl())
        .tipoPerfil(perfil.getTipoPerfil())
        .parentesco(perfil.getParentesco())
        .tokenPublico(perfil.getTokenPublico())
        .urlPublica("https://emertag.com.br/e/" + perfil.getTokenPublico())
        .ultimaAtualizacaoSaude(perfil.getUltimaAtualizacaoSaude())
        .build();
    
    }

     public PerfilEmergencia paraEntity(PerfilEmergenciaRequestDTO dto) {
        return PerfilEmergencia.builder()
            .nome(dto.getNome())
            .dataNascimento(dto.getDataNascimento())
            .tipoSanguineo(dto.getTipoSanguineo())
            .fotoUrl(dto.getFotoUrl())
            .tipoPerfil(dto.getTipoPerfil())
            .parentesco(dto.getParentesco())
            .build();
    }
        
    public PerfilEmergenciaPublicoDTO paraPublicoDTO(PerfilEmergencia perfil, PrivacidadePerfil privacidade, List<InformacaoSaude> informacoes, List<ContatoEmergencia> contato){

        PerfilEmergenciaPublicoDTO.PerfilEmergenciaPublicoDTOBuilder builder =
         PerfilEmergenciaPublicoDTO.builder()
        .nome(perfil.getNome())
        .fotoUrl(perfil.getFotoUrl());

        
        if (Boolean.TRUE.equals(privacidade.getExibirIdade())) {
            builder.idade(calcularIdade(perfil.getDataNascimento()));
        }

        if (Boolean.TRUE.equals(privacidade.getExibirTipoSanguineo())) {
            builder.tipoSanguineo(perfil.getTipoSanguineo());
        }

        if (Boolean.TRUE.equals(privacidade.getExibirAlergias())) {
            builder.alergias(filtrarPorTipo(informacoes, TipoInformacaoSaude.ALERGIA));
        }

        if (Boolean.TRUE.equals(privacidade.getExibirCondicoes())) {
            builder.condicoes(filtrarPorTipo(informacoes, TipoInformacaoSaude.CODICAO_SAUDE));
        }

        if (Boolean.TRUE.equals(privacidade.getExibirMedicamentos())) {
            builder.medicamentos(filtrarPorTipo(informacoes, TipoInformacaoSaude.MEDICAMENTO_CONTINUO));
        }

        if (Boolean.TRUE.equals(privacidade.getExibirNecessidades())) {
            builder.necessidadesEspecificas(filtrarPorTipo(informacoes, TipoInformacaoSaude.NECESSIDADE_ESPECIFICA));
        }

        if (Boolean.TRUE.equals(privacidade.getExibirBiosseguranca())) {
            List<String> biosseguranca = filtrarPorTipo(informacoes, TipoInformacaoSaude.BIOSSEGURANCA);
            builder.biosseguranca(biosseguranca.isEmpty() ? null : String.join("; ", biosseguranca));
        }

        builder.contatos(contato.stream()
                .map(this::paraContatoPublicoDTO)
                .collect(Collectors.toList()));

        return builder.build();
    }

        private ContatoEmergenciaPublicoDTO paraContatoPublicoDTO(ContatoEmergencia contato){
            return ContatoEmergenciaPublicoDTO.builder()
            .nome(contato.getNome())
            .relacao(contato.getRelacao())
            .telefone(contato.getTelefone())
            .build();
        }

        private List<String> filtrarPorTipo(List<InformacaoSaude> informacoes, TipoInformacaoSaude tipo) {
        return informacoes.stream()
                .filter(info -> info.getTipo() == tipo)
                .map(InformacaoSaude::getDescricao)
                .collect(Collectors.toList());
        }

        private Integer calcularIdade(LocalDate dataNascimento) {
        if (dataNascimento == null) {
            return null;
        }
        return Period.between(dataNascimento, LocalDate.now()).getYears();
    }

}

package com.emertag.emertagAPP.service;

import com.emertag.emertagAPP.entity.InformacaoSaude;
import com.emertag.emertagAPP.entity.PerfilEmergencia;
import com.emertag.emertagAPP.entity.Usuario;
import com.emertag.emertagAPP.enums.TipoInformacaoSaude;
import com.emertag.emertagAPP.repository.InformacaoSaudeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.lang.ProcessHandle.Info;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service 
public class InformacaoSaudeService {
    private final InformacaoSaudeRepository informacaoRepository;
    private final PerfilEmergenciaService perfilService; 

    public InformacaoSaudeService(InformacaoSaudeRepository informacaoRepository, PerfilEmergenciaService perfilService){
        this.informacaoRepository = informacaoRepository;
        this.perfilService = perfilService; 
    }

    @Transactional
      public InformacaoSaude adicionar(Long idPerfil, TipoInformacaoSaude tipo, String descricao, Usuario solicitante){
        PerfilEmergencia perfil = perfilService.validarAdministrador(idPerfil, solicitante);

        InformacaoSaude info = InformacaoSaude.builder()
        .perfil(perfil)
        .tipo(tipo)
        .descricao(descricao)
        .build(); 

        InformacaoSaude salvo = informacaoRepository.save(info);
        perfilService.marcaSaudeAtualizada(idPerfil);

        return salvo;
    }

    @Transactional 
    public void remover(Long idInformacao, Long idPerfil, Usuario solicitante){
        perfilService.validarAdministrador(idPerfil, solicitante);

        InformacaoSaude info = informacaoRepository.findById(idInformacao).orElseThrow(() -> new IllegalArgumentException("Informação não encontrada."));
        
        if (!info.getPerfil().getIdPerfil().equals(idPerfil)) {
             throw new IllegalArgumentException("Essa informação não pertence a este perfil.");
        }
        
        informacaoRepository.delete(info);
        perfilService.marcaSaudeAtualizada(idPerfil);
    }

    @Transactional(readOnly = true)
    public Map<TipoInformacaoSaude, List<String>> listarAgrupadoPorTipo(Long idPerfil) {
        List<InformacaoSaude> todas = informacaoRepository.findByPerfil_IdPerfil(idPerfil);

        return todas.stream()
                .collect(Collectors.groupingBy(
                        InformacaoSaude::getTipo,
                        Collectors.mapping(InformacaoSaude::getDescricao, Collectors.toList())
                ));
    }
}

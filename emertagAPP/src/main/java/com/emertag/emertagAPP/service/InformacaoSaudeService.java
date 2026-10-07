package com.emertag.emertagAPP.service;

import com.emertag.emertagAPP.entity.InformacaoSaude;
import com.emertag.emertagAPP.entity.PerfilEmergencia;
import com.emertag.emertagAPP.entity.Usuario;
import com.emertag.emertagAPP.enums.TipoInformacaoSaude;
import com.emertag.emertagAPP.repository.InformacaoSaudeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class InformacaoSaudeService {

    private final InformacaoSaudeRepository informacaoRepository;
    private final AutorizacaoPerfilService autorizacaoService;
    private final PerfilEmergenciaService perfilService;

    public InformacaoSaudeService(InformacaoSaudeRepository informacaoRepository,
                                   AutorizacaoPerfilService autorizacaoService,
                                   PerfilEmergenciaService perfilService) {
        this.informacaoRepository = informacaoRepository;
        this.autorizacaoService = autorizacaoService;
        this.perfilService = perfilService;
    }

    @Transactional
    public InformacaoSaude adicionar(Long idPerfil, TipoInformacaoSaude tipo, String descricao, Usuario solicitante) {
        PerfilEmergencia perfil = autorizacaoService.validarAdministrador(idPerfil, solicitante);

        InformacaoSaude info = InformacaoSaude.builder()
                .perfil(perfil)
                .tipo(tipo)
                .descricao(descricao)
                .build();

        InformacaoSaude salvo = informacaoRepository.save(info);
        perfilService.marcarSaudeAtualizada(idPerfil);

        return salvo;
    }

    @Transactional
    public void remover(Long idInformacao, Long idPerfil, Usuario solicitante) {
        autorizacaoService.validarAdministrador(idPerfil, solicitante);

        InformacaoSaude info = informacaoRepository.findById(idInformacao)
                .orElseThrow(() -> new IllegalArgumentException("Informação não encontrada."));

        if (!info.getPerfil().getIdPerfil().equals(idPerfil)) {
            throw new IllegalArgumentException("Essa informação não pertence a este perfil.");
        }

        informacaoRepository.delete(info);
        perfilService.marcarSaudeAtualizada(idPerfil);
    }

    @Transactional
    public void substituirTodas(Long idPerfil, Map<TipoInformacaoSaude, List<String>> novas, Usuario solicitante) {
        PerfilEmergencia perfil = autorizacaoService.validarAdministrador(idPerfil, solicitante);

        informacaoRepository.deleteAll(informacaoRepository.findByPerfil_IdPerfil(idPerfil));

        novas.forEach((tipo, descricoes) -> {
            if (descricoes == null) return;
            descricoes.stream()
                    .filter(descricao -> descricao != null && !descricao.isBlank())
                    .map(descricao -> InformacaoSaude.builder()
                            .perfil(perfil)
                            .tipo(tipo)
                            .descricao(descricao.trim())
                            .build())
                    .forEach(informacaoRepository::save);
        });

        perfilService.marcarSaudeAtualizada(idPerfil);
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

    @Transactional(readOnly = true)
public List<InformacaoSaude> listarPorPerfilCompleto(Long idPerfil) {
    return informacaoRepository.findByPerfil_IdPerfil(idPerfil);
}
}
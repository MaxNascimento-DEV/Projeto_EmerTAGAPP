package com.emertag.emertagAPP.service;

import com.emertag.emertagAPP.entity.PerfilEmergencia;
import com.emertag.emertagAPP.entity.PrivacidadePerfil;
import com.emertag.emertagAPP.entity.Usuario;
import com.emertag.emertagAPP.repository.PrivacidadePerfilRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PrivacidadePerfilService {

    private final PrivacidadePerfilRepository privacidadeRepository;
    private final AutorizacaoPerfilService autorizacaoService;

    public PrivacidadePerfilService(PrivacidadePerfilRepository privacidadeRepository,
                                     AutorizacaoPerfilService autorizacaoService) {
        this.privacidadeRepository = privacidadeRepository;
        this.autorizacaoService = autorizacaoService;
    }

    @Transactional
    public PrivacidadePerfil criarPadrao(PerfilEmergencia perfil) {
        PrivacidadePerfil privacidade = PrivacidadePerfil.builder()
                .perfil(perfil)
                .build();
        return privacidadeRepository.save(privacidade);
    }

    @Transactional(readOnly = true)
    public PrivacidadePerfil buscarPorPerfil(Long idPerfil) {
        return privacidadeRepository.findByPerfil_IdPerfil(idPerfil)
                .orElseThrow(() -> new IllegalArgumentException("Configuração de privacidade não encontrada."));
    }

    @Transactional
    public PrivacidadePerfil atualizar(Long idPerfil, PrivacidadePerfil preferencias, Usuario solicitante) {
        autorizacaoService.validarAdministrador(idPerfil, solicitante);

        PrivacidadePerfil privacidade = buscarPorPerfil(idPerfil);

        privacidade.setExibirAlergias(preferencias.getExibirAlergias());
        privacidade.setExibirCondicoes(preferencias.getExibirCondicoes());
        privacidade.setExibirMedicamentos(preferencias.getExibirMedicamentos());
        privacidade.setExibirNecessidades(preferencias.getExibirNecessidades());
        privacidade.setExibirBiosseguranca(preferencias.getExibirBiosseguranca());
        privacidade.setExibirIdade(preferencias.getExibirIdade());
        privacidade.setExibirTipoSanguineo(preferencias.getExibirTipoSanguineo());

        return privacidadeRepository.save(privacidade);
    }
}
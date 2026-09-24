package com.emertag.emertagAPP.service;

import com.emertag.emertagAPP.entity.PerfilEmergencia;
import com.emertag.emertagAPP.entity.Usuario;
import com.emertag.emertagAPP.enums.TipoPerfil;
import com.emertag.emertagAPP.repository.PerfilEmergenciaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class PerfilEmergenciaService {

    private final PerfilEmergenciaRepository perfilRepository;
    private final AutorizacaoPerfilService autorizacaoService;
    private final PrivacidadePerfilService privacidadeService;

    public PerfilEmergenciaService(PerfilEmergenciaRepository perfilRepository,
                                    AutorizacaoPerfilService autorizacaoService,
                                    PrivacidadePerfilService privacidadeService) {
        this.perfilRepository = perfilRepository;
        this.autorizacaoService = autorizacaoService;
        this.privacidadeService = privacidadeService;
    }

    @Transactional
    public PerfilEmergencia criar(PerfilEmergencia perfil, Usuario administrador) {
        validarParentesco(perfil);
        perfil.setAdministrador(administrador);
        perfil.setTokenPublico(gerarTokenUnico());

        PerfilEmergencia salvo = perfilRepository.save(perfil);
        privacidadeService.criarPadrao(salvo);

        return salvo;
    }

    @Transactional
    public PerfilEmergencia regenerarToken(Long idPerfil, Usuario solicitante) {
        PerfilEmergencia perfil = autorizacaoService.validarAdministrador(idPerfil, solicitante);
        perfil.setTokenPublico(gerarTokenUnico());
        return perfilRepository.save(perfil);
    }

    @Transactional(readOnly = true)
    public PerfilEmergencia buscarPorToken(String token) {
        return perfilRepository.findByTokenPublico(token)
                .orElseThrow(() -> new IllegalArgumentException("QR Code inválido ou não encontrado."));
    }

    @Transactional(readOnly = true)
    public List<PerfilEmergencia> listarPorAdministrador(Long idUsuario) {
        return perfilRepository.findByAdministrador_IdUsuario(idUsuario);
    }

    @Transactional
    public PerfilEmergencia atualizar(Long idPerfil, PerfilEmergencia dadosAtualizados, Usuario solicitante) {
        PerfilEmergencia perfil = autorizacaoService.validarAdministrador(idPerfil, solicitante);
        validarParentesco(dadosAtualizados);

        perfil.setNome(dadosAtualizados.getNome());
        perfil.setDataNascimento(dadosAtualizados.getDataNascimento());
        perfil.setTipoSanguineo(dadosAtualizados.getTipoSanguineo());
        perfil.setFotoUrl(dadosAtualizados.getFotoUrl());
        perfil.setParentesco(dadosAtualizados.getParentesco());

        return perfilRepository.save(perfil);
    }

    @Transactional
    public void marcarSaudeAtualizada(Long idPerfil) {
        PerfilEmergencia perfil = perfilRepository.findById(idPerfil)
                .orElseThrow(() -> new IllegalArgumentException("Perfil não encontrado."));
        perfil.setUltimaAtualizacaoSaude(LocalDateTime.now());
        perfilRepository.save(perfil);
    }

    private void validarParentesco(PerfilEmergencia perfil) {
        if (perfil.getTipoPerfil() == TipoPerfil.PROTEGIDO
                && (perfil.getParentesco() == null || perfil.getParentesco().isBlank())) {
            throw new IllegalArgumentException("Parentesco é obrigatório para perfis protegidos.");
        }
    }

    private String gerarTokenUnico() {
        String token;
        do {
            token = UUID.randomUUID().toString().replace("-", "").substring(0, 10);
        } while (perfilRepository.findByTokenPublico(token).isPresent());
        return token;
    }
}
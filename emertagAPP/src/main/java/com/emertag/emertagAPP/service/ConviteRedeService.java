package com.emertag.emertagAPP.service;

import com.emertag.emertagAPP.entity.ConviteRede;
import com.emertag.emertagAPP.entity.PerfilEmergencia;
import com.emertag.emertagAPP.entity.Usuario;
import com.emertag.emertagAPP.enums.StatusConvite;
import com.emertag.emertagAPP.repository.ConviteRedeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ConviteRedeService {

    private final ConviteRedeRepository conviteRepository;
    private final AutorizacaoPerfilService autorizacaoService;
    private final RedeCuidadoService redeCuidadoService;

    public ConviteRedeService(ConviteRedeRepository conviteRepository,
                               AutorizacaoPerfilService autorizacaoService,
                               RedeCuidadoService redeCuidadoService) {
        this.conviteRepository = conviteRepository;
        this.autorizacaoService = autorizacaoService;
        this.redeCuidadoService = redeCuidadoService;
    }

    @Transactional
    public ConviteRede criar(Long idPerfil, String emailConvidado,
                              boolean podeVisualizarPrivado, boolean podeEditar,
                              Usuario solicitante) {
        PerfilEmergencia perfil = autorizacaoService.validarAdministrador(idPerfil, solicitante);

        ConviteRede convite = ConviteRede.builder()
                .perfil(perfil)
                .emailConvidado(emailConvidado)
                .podeVisualizarPrivado(podeVisualizarPrivado)
                .podeEditar(podeEditar)
                .build();

        return conviteRepository.save(convite);
    }

    @Transactional
    public void aceitar(Long idConvite, Usuario usuarioQueAceita) {
        ConviteRede convite = buscarPendente(idConvite);

        if (!convite.getEmailConvidado().equalsIgnoreCase(usuarioQueAceita.getEmail())) {
            throw new SecurityException("Este convite não pertence a este usuário.");
        }

        redeCuidadoService.adicionarCuidador(
                convite.getPerfil(),
                usuarioQueAceita,
                convite.getPodeVisualizarPrivado(),
                convite.getPodeEditar()
        );

        convite.setStatus(StatusConvite.ACEITO);
        convite.setRespondidoEm(LocalDateTime.now());
        conviteRepository.save(convite);
    }

    @Transactional
    public void recusar(Long idConvite, Usuario usuarioQueRecusa) {
        ConviteRede convite = buscarPendente(idConvite);

        if (!convite.getEmailConvidado().equalsIgnoreCase(usuarioQueRecusa.getEmail())) {
            throw new SecurityException("Este convite não pertence a este usuário.");
        }

        convite.setStatus(StatusConvite.RECUSADO);
        convite.setRespondidoEm(LocalDateTime.now());
        conviteRepository.save(convite);
    }

    @Transactional
    public void cancelar(Long idConvite, Long idPerfil, Usuario solicitante) {
        autorizacaoService.validarAdministrador(idPerfil, solicitante);

        ConviteRede convite = buscarPendente(idConvite);
        convite.setStatus(StatusConvite.CANCELADO);
        convite.setRespondidoEm(LocalDateTime.now());
        conviteRepository.save(convite);
    }

    @Transactional(readOnly = true)
    public List<ConviteRede> listarPendentesPorPerfil(Long idPerfil) {
        return conviteRepository.findByPerfil_IdPerfilAndStatus(idPerfil, StatusConvite.PENDENTE);
    }

    @Transactional(readOnly = true)
    public List<ConviteRede> listarPendentesPorEmail(String email) {
        return conviteRepository.findByEmailConvidadoAndStatus(email, StatusConvite.PENDENTE);
    }

    private ConviteRede buscarPendente(Long idConvite) {
        ConviteRede convite = conviteRepository.findById(idConvite)
                .orElseThrow(() -> new IllegalArgumentException("Convite não encontrado."));

        if (convite.getStatus() != StatusConvite.PENDENTE) {
            throw new IllegalArgumentException("Este convite já foi respondido ou cancelado.");
        }
        return convite;
    }
}
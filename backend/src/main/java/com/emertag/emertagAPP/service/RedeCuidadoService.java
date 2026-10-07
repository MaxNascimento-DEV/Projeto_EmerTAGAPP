package com.emertag.emertagAPP.service;

import com.emertag.emertagAPP.entity.PerfilEmergencia;
import com.emertag.emertagAPP.entity.RedeCuidado;
import com.emertag.emertagAPP.entity.Usuario;
import com.emertag.emertagAPP.repository.RedeCuidadoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RedeCuidadoService {

    private final RedeCuidadoRepository redeCuidadoRepository;
    private final AutorizacaoPerfilService autorizacaoService;

    public RedeCuidadoService(RedeCuidadoRepository redeCuidadoRepository,
                               AutorizacaoPerfilService autorizacaoService) {
        this.redeCuidadoRepository = redeCuidadoRepository;
        this.autorizacaoService = autorizacaoService;
    }

    @Transactional
    public RedeCuidado adicionarCuidador(PerfilEmergencia perfil, Usuario cuidador,
                                          boolean podeVisualizarPrivado, boolean podeEditar) {
        redeCuidadoRepository.findByPerfil_IdPerfilAndUsuario_IdUsuario(
                        perfil.getIdPerfil(), cuidador.getIdUsuario())
                .ifPresent(rede -> {
                    throw new IllegalArgumentException("Este usuário já faz parte da rede de cuidado.");
                });

        RedeCuidado rede = RedeCuidado.builder()
                .perfil(perfil)
                .usuario(cuidador)
                .podeVisualizarPrivado(podeVisualizarPrivado)
                .podeEditar(podeEditar)
                .build();

        return redeCuidadoRepository.save(rede);
    }

    @Transactional
    public RedeCuidado atualizarPermissoes(Long idPerfil, Long idUsuarioCuidador,
                                            boolean podeVisualizarPrivado, boolean podeEditar,
                                            Usuario solicitante) {
        autorizacaoService.validarAdministrador(idPerfil, solicitante);

        RedeCuidado rede = redeCuidadoRepository
                .findByPerfil_IdPerfilAndUsuario_IdUsuario(idPerfil, idUsuarioCuidador)
                .orElseThrow(() -> new IllegalArgumentException("Cuidador não encontrado nesta rede."));

        rede.setPodeVisualizarPrivado(podeVisualizarPrivado);
        rede.setPodeEditar(podeEditar);

        return redeCuidadoRepository.save(rede);
    }

    @Transactional
    public void removerCuidador(Long idPerfil, Long idUsuarioCuidador, Usuario solicitante) {
        autorizacaoService.validarAdministrador(idPerfil, solicitante);

        RedeCuidado rede = redeCuidadoRepository
                .findByPerfil_IdPerfilAndUsuario_IdUsuario(idPerfil, idUsuarioCuidador)
                .orElseThrow(() -> new IllegalArgumentException("Cuidador não encontrado nesta rede."));

        redeCuidadoRepository.delete(rede);
    }

    @Transactional(readOnly = true)
    public List<RedeCuidado> listarCuidadoresDoPerfil(Long idPerfil) {
        return redeCuidadoRepository.findByPerfil_IdPerfil(idPerfil);
    }

    @Transactional(readOnly = true)
    public List<RedeCuidado> listarPerfisQueCuido(Long idUsuario) {
        return redeCuidadoRepository.findByUsuario_IdUsuario(idUsuario);
    }
}
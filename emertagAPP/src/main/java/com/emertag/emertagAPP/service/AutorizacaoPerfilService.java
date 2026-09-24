package com.emertag.emertagAPP.service;

import com.emertag.emertagAPP.entity.PerfilEmergencia;
import com.emertag.emertagAPP.entity.Usuario;
import com.emertag.emertagAPP.repository.PerfilEmergenciaRepository;
import com.emertag.emertagAPP.repository.RedeCuidadoRepository;
import org.springframework.stereotype.Service;

@Service
public class AutorizacaoPerfilService {

    private final PerfilEmergenciaRepository perfilRepository;
    private final RedeCuidadoRepository redeCuidadoRepository;

    public AutorizacaoPerfilService(PerfilEmergenciaRepository perfilRepository,
                                     RedeCuidadoRepository redeCuidadoRepository) {
        this.perfilRepository = perfilRepository;
        this.redeCuidadoRepository = redeCuidadoRepository;
    }

    public PerfilEmergencia validarAdministrador(Long idPerfil, Usuario solicitante) {
        PerfilEmergencia perfil = buscarPerfil(idPerfil);

        if (!ehAdministrador(perfil, solicitante)) {
            throw new SecurityException("Apenas o administrador pode realizar esta ação.");
        }
        return perfil;
    }

    public PerfilEmergencia validarAcessoEdicao(Long idPerfil, Usuario solicitante) {
        PerfilEmergencia perfil = buscarPerfil(idPerfil);

        if (ehAdministrador(perfil, solicitante)) {
            return perfil;
        }

        boolean podeEditar = redeCuidadoRepository
                .findByPerfil_IdPerfilAndUsuario_IdUsuario(idPerfil, solicitante.getIdUsuario())
                .map(rede -> Boolean.TRUE.equals(rede.getPodeEditar()))
                .orElse(false);

        if (!podeEditar) {
            throw new SecurityException("Você não tem permissão para editar este perfil.");
        }
        return perfil;
    }

    public PerfilEmergencia validarAcessoVisualizacao(Long idPerfil, Usuario solicitante) {
        PerfilEmergencia perfil = buscarPerfil(idPerfil);

        if (ehAdministrador(perfil, solicitante)) {
            return perfil;
        }

        boolean temAcesso = redeCuidadoRepository
                .findByPerfil_IdPerfilAndUsuario_IdUsuario(idPerfil, solicitante.getIdUsuario())
                .isPresent();

        if (!temAcesso) {
            throw new SecurityException("Você não faz parte da rede de cuidado deste perfil.");
        }
        return perfil;
    }

    private PerfilEmergencia buscarPerfil(Long idPerfil) {
        return perfilRepository.findById(idPerfil)
                .orElseThrow(() -> new IllegalArgumentException("Perfil não encontrado."));
    }

    private boolean ehAdministrador(PerfilEmergencia perfil, Usuario solicitante) {
        return perfil.getAdministrador().getIdUsuario().equals(solicitante.getIdUsuario());
    }
}
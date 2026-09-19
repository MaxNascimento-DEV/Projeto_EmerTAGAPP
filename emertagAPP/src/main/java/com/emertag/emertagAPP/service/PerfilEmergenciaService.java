package com.emertag.emertagAPP.service;

import com.emertag.emertagAPP.entity.PerfilEmergencia;
import com.emertag.emertagAPP.entity.Usuario;
import com.emertag.emertagAPP.enums.TipoPerfil;
import com.emertag.emertagAPP.repository.PerfilEmergenciaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service 
public class PerfilEmergenciaService {

    private final PerfilEmergenciaRepository perfilRepository; 

    public PerfilEmergenciaService(PerfilEmergenciaRepository perfilRepository){
        this.perfilRepository = perfilRepository; 
    }

    @Transactional
    public PerfilEmergencia criar(PerfilEmergencia perfil, Usuario administrador){
        validarParentesco(perfil);

        perfil.setAdministrador(administrador);
        perfil.setTokenPublico(gerarTokenUnico());
        
        return perfilRepository.save(perfil); 
    }

    private void validarParentesco(PerfilEmergencia perfil){
        if (perfil.getTipoPerfil() == TipoPerfil.PROTEGIDO && (perfil.getParentesco() == null || perfil.getParentesco().isBlank())) { throw new IllegalArgumentException("Parentesco é obrigatório para perfil protegidos!");   
        }
    }

    private String gerarTokenUnico(){
        String token;
        do {
            token = UUID.randomUUID().toString().replace("-", "").substring(0, 10); 
        } while (perfilRepository.findByTokenPublico(token).isPresent());
        return token;
    }

    @Transactional
    public PerfilEmergencia regenerarToken(Long idPerfil, Usuario solicitante){
        PerfilEmergencia perfil = validarAdministrador(idPerfil, solicitante);
        perfil.setTokenPublico(gerarTokenUnico());
        return perfilRepository.save(perfil);
    }

    public PerfilEmergencia validarAdministrador(Long idPerfil, Usuario solicitante){
        PerfilEmergencia perfil = perfilRepository.findById(idPerfil).orElseThrow(() -> new IllegalArgumentException("Perfil não encontrado."));

        if (!perfil.getAdministrador().getIdUsuario().equals(solicitante.getIdUsuario())) {
            throw new SecurityException("Você não tem permissão para gerenciar este perfil.");
        }

        return perfil; 
    }

    @Transactional(readOnly = true)
        public PerfilEmergencia buscarPorToken(String token){
            return perfilRepository.findByTokenPublico(token).orElseThrow(() -> new IllegalArgumentException("QR Code inválido ou não encontrado."));
        }

    @Transactional(readOnly = true)
    public List<PerfilEmergencia> listarPorAdministrator(Long idUsuario){
        return perfilRepository.findByAdministrador_IdUsuario(idUsuario);
    }

    @Transactional
    public PerfilEmergencia atualizar(Long idPerfil, PerfilEmergencia dadosAtualizado, Usuario solicitante){
        PerfilEmergencia perfil = validarAdministrador(idPerfil, solicitante); 

        validarParentesco(dadosAtualizado);

        perfil.setNome(dadosAtualizado.getNome());
        perfil.setDataNascimento(dadosAtualizado.getDataNascimento());
        perfil.setTipoSanguineo(dadosAtualizado.getTipoSanguineo());
        perfil.setFotoUrl(dadosAtualizado.getFotoUrl());
        perfil.setParentesco(dadosAtualizado.getParentesco());

        return perfilRepository.save(perfil); 
    }

    @Transactional
    public void marcaSaudeAtualizada(Long idPerfil){
        PerfilEmergencia perfil = perfilRepository.findById(idPerfil).orElseThrow(() -> new IllegalArgumentException("Perfil não encontrado."));

        perfil.setUltimaAtualizacaoSaude(java.time.LocalDateTime.now());
        perfilRepository.save(perfil); 
    }

}   


package com.emertag.emertagAPP.service;

import com.emertag.emertagAPP.entity.ContatoEmergencia;
import com.emertag.emertagAPP.entity.PerfilEmergencia;
import com.emertag.emertagAPP.entity.Usuario;
import com.emertag.emertagAPP.repository.ContatoEmergenciaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ContatoEmergenciaService {

    private final ContatoEmergenciaRepository contatoRepository;
    private final AutorizacaoPerfilService autorizacaoService;

    public ContatoEmergenciaService(ContatoEmergenciaRepository contatoRepository,
                                     AutorizacaoPerfilService autorizacaoService) {
        this.contatoRepository = contatoRepository;
        this.autorizacaoService = autorizacaoService;
    }

    @Transactional
    public ContatoEmergencia adicionar(Long idPerfil, String nome, String relacao, String telefone, Usuario solicitante) {
        PerfilEmergencia perfil = autorizacaoService.validarAdministrador(idPerfil, solicitante);

        ContatoEmergencia contato = ContatoEmergencia.builder()
                .perfil(perfil)
                .nome(nome)
                .relacao(relacao)
                .telefone(telefone)
                .build();

        return contatoRepository.save(contato);
    }

    @Transactional
    public ContatoEmergencia atualizar(Long idContato, Long idPerfil, String nome, String relacao, String telefone, Usuario solicitante) {
        autorizacaoService.validarAdministrador(idPerfil, solicitante);
        ContatoEmergencia contato = buscarEValidarPertence(idContato, idPerfil);

        contato.setNome(nome);
        contato.setRelacao(relacao);
        contato.setTelefone(telefone);

        return contatoRepository.save(contato);
    }

    @Transactional
    public void remover(Long idContato, Long idPerfil, Usuario solicitante) {
        autorizacaoService.validarAdministrador(idPerfil, solicitante);
        ContatoEmergencia contato = buscarEValidarPertence(idContato, idPerfil);
        contatoRepository.delete(contato);
    }

    @Transactional(readOnly = true)
    public List<ContatoEmergencia> listarPorPerfil(Long idPerfil) {
        return contatoRepository.findByPerfil_IdPerfil(idPerfil);
    }

    private ContatoEmergencia buscarEValidarPertence(Long idContato, Long idPerfil) {
        ContatoEmergencia contato = contatoRepository.findById(idContato)
                .orElseThrow(() -> new IllegalArgumentException("Contato não encontrado."));

        if (!contato.getPerfil().getIdPerfil().equals(idPerfil)) {
            throw new IllegalArgumentException("Este contato não pertence a este perfil.");
        }
        return contato;
    }
}
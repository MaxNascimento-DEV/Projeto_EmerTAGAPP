package com.emertag.emertagAPP.service;

import com.emertag.emertagAPP.entity.ConfiguracaoAcessibilidade;
import com.emertag.emertagAPP.entity.Usuario;
import com.emertag.emertagAPP.enums.TamanhoTexto;
import com.emertag.emertagAPP.repository.ConfiguracaoAcessibilidadeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service 
public class ConfiguracaoAcessibilidadeService {

    private final ConfiguracaoAcessibilidadeRepository configuracaoRepository;

    public ConfiguracaoAcessibilidadeService(ConfiguracaoAcessibilidadeRepository configuracaoRepository){
        this.configuracaoRepository = configuracaoRepository; 
    }

    private ConfiguracaoAcessibilidade padrao(){
        return ConfiguracaoAcessibilidade.builder()
                .tamanhoTexto(TamanhoTexto.MEDIO)
                .altoContraste(false)
                .build(); 
    }

    @Transactional(readOnly = true )
    public ConfiguracaoAcessibilidade buscarPorUsuario(Long idUsuario){
        return configuracaoRepository.findByUsuario_IdUsuario(idUsuario).orElse(padrao());  
    }

    @Transactional
    public ConfiguracaoAcessibilidade salvar(Usuario usuario, TamanhoTexto tamanhoTexto, Boolean altoContraste){
        ConfiguracaoAcessibilidade config = configuracaoRepository.findByUsuario_IdUsuario(usuario.getIdUsuario())
        .orElseGet(() -> ConfiguracaoAcessibilidade.builder()
        .usuario(usuario)
        .build()); 

        config.setTamanhoTexto(tamanhoTexto);
        config.setAltoContraste(altoContraste);
        
        return configuracaoRepository.save(config); 
    }
}   



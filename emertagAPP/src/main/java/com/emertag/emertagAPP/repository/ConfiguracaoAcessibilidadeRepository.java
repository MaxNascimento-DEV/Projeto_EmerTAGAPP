package com.emertag.emertagAPP.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.emertag.emertagAPP.entity.ConfiguracaoAcessibilidade;

public interface ConfiguracaoAcessibilidadeRepository extends JpaRepository<ConfiguracaoAcessibilidade, Long> {
    
    Optional<ConfiguracaoAcessibilidade> findByUsuari_idUsuario(Long idUsuario);

}

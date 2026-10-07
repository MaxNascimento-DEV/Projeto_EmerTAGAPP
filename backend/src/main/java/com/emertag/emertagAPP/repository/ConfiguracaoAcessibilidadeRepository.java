package com.emertag.emertagAPP.repository;

import com.emertag.emertagAPP.entity.ConfiguracaoAcessibilidade;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ConfiguracaoAcessibilidadeRepository extends JpaRepository<ConfiguracaoAcessibilidade, Long> {

    Optional<ConfiguracaoAcessibilidade> findByUsuario_IdUsuario(Long idUsuario);
}
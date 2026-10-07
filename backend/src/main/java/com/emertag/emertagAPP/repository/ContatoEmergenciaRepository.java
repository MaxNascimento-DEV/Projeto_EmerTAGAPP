package com.emertag.emertagAPP.repository;

import com.emertag.emertagAPP.entity.ContatoEmergencia;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContatoEmergenciaRepository extends JpaRepository<ContatoEmergencia, Long> {

    List<ContatoEmergencia> findByPerfil_IdPerfil(Long idPerfil);
}
package com.emertag.emertagAPP.repository;

import com.emertag.emertagAPP.entity.PerfilEmergencia;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PerfilEmergenciaRepository extends JpaRepository<PerfilEmergencia, Long> {

    List<PerfilEmergencia> findByAdministrador_IdUsuario(Long idUsuario);

    Optional<PerfilEmergencia> findByTokenPublico(String tokenPublico);
}
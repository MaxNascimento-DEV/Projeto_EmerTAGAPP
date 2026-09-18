package com.emertag.emertagAPP.repository;

import com.emertag.emertagAPP.entity.PrivacidadePerfil;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PrivacidadePerfilRepository extends JpaRepository<PrivacidadePerfil, Long> {

    Optional<PrivacidadePerfil> findByPerfil_IdPerfil(Long idPerfil);
}
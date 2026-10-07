package com.emertag.emertagAPP.repository;

import com.emertag.emertagAPP.entity.RedeCuidado;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RedeCuidadoRepository extends JpaRepository<RedeCuidado, Long> {

    List<RedeCuidado> findByPerfil_IdPerfil(Long idPerfil);

    List<RedeCuidado> findByUsuario_IdUsuario(Long idUsuario);

    Optional<RedeCuidado> findByPerfil_IdPerfilAndUsuario_IdUsuario(Long idPerfil, Long idUsuario);
}
package com.emertag.emertagAPP.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.emertag.emertagAPP.entity.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByEmail(String email); 

}

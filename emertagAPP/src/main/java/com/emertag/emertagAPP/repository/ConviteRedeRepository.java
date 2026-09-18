package com.emertag.emertagAPP.repository;

import com.emertag.emertagAPP.entity.ConviteRede;
import com.emertag.emertagAPP.enums.StatusConvite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ConviteRedeRepository extends JpaRepository<ConviteRede, Long> {

    List<ConviteRede> findByPerfil_IdPerfilAndStatus(Long idPerfil, StatusConvite status);

    List<ConviteRede> findByEmailConvidadoAndStatus(String email, StatusConvite status);
}
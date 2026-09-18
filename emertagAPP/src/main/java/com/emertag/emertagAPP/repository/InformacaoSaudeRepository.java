package com.emertag.emertagAPP.repository;

import com.emertag.emertagAPP.entity.InformacaoSaude;
import com.emertag.emertagAPP.enums.TipoInformacaoSaude;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InformacaoSaudeRepository extends JpaRepository<InformacaoSaude, Long> {

    List<InformacaoSaude> findByPerfil_IdPerfil(Long idPerfil);

    List<InformacaoSaude> findByPerfil_IdPerfilAndTipo(Long idPerfil, TipoInformacaoSaude tipo);
}
package com.emertag.emertagAPP.mapper;

import com.emertag.emertagAPP.dtos.ConviteRedeResponseDTO;
import com.emertag.emertagAPP.entity.ConviteRede;
import org.springframework.stereotype.Component;

@Component
public class ConviteRedeMapper {

    public ConviteRedeResponseDTO paraResponseDTO(ConviteRede convite) {
        return ConviteRedeResponseDTO.builder()
                .idConvite(convite.getIdConvite())
                .idPerfil(convite.getPerfil().getIdPerfil())
                .nomePerfil(convite.getPerfil().getNome())
                .emailConvidado(convite.getEmailConvidado())
                .podeVisualizarPrivado(convite.getPodeVisualizarPrivado())
                .podeEditar(convite.getPodeEditar())
                .status(convite.getStatus())
                .criadoEm(convite.getCriadoEm())
                .respondidoEm(convite.getRespondidoEm())
                .build();
    }
}
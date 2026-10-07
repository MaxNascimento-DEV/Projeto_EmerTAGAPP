package com.emertag.emertagAPP.dtos;

import com.emertag.emertagAPP.enums.StatusConvite;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConviteRedeResponseDTO {
    private Long idConvite;
    private Long idPerfil;
    private String nomePerfil;
    private String emailConvidado;
    private Boolean podeVisualizarPrivado;
    private Boolean podeEditar;
    private StatusConvite status;
    private LocalDateTime criadoEm;
    private LocalDateTime respondidoEm;
}
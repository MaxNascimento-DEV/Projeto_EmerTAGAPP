package com.emertag.emertagAPP.dtos;

import com.emertag.emertagAPP.enums.TipoPerfil;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PerfilEmergenciaResponseDTO {

    private Long idPerfil;
    private String nome;
    private LocalDate dataNascimento;
    private String tipoSanguineo;
    private String fotoUrl;
    private TipoPerfil tipoPerfil;
    private String parentesco;
    private String tokenPublico;
    private String urlPublica;
    private LocalDateTime ultimaAtualizacaoSaude;
}
package com.emertag.emertagAPP.dtos;

import com.emertag.emertagAPP.enums.TipoPerfil;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PerfilEmergenciaRequestDTO {
    private String nome;
    private LocalDate dataNascimento;
    private String tipoSanguineo;
    private String fotoUrl;
    private TipoPerfil tipoPerfil;
    private String parentesco;
}
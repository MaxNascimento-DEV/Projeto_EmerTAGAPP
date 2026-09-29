package com.emertag.emertagAPP.dtos;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContatoEmergenciaPublicoDTO {
    private String nome;
    private String relacao;
    private String telefone;
}
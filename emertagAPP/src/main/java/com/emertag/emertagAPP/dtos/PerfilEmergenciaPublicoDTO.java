package com.emertag.emertagAPP.dtos;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PerfilEmergenciaPublicoDTO {

    private String nome;
    private Integer idade;
    private String tipoSanguineo;
    private String fotoUrl;
    private List<String> alergias;
    private List<String> condicoes;
    private List<String> medicamentos;
    private List<String> necessidadesEspecificas;
    private String biosseguranca;
    private List<ContatoEmergenciaPublicoDTO> contatos;
}
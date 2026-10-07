package com.emertag.emertagAPP.dtos;

import lombok.*;


@Getter 
@Setter 
@NoArgsConstructor 
@AllArgsConstructor 
@Builder 
public class PrivacidadePerfilDTO {
    private Boolean exibirAlergias;
    private Boolean exibirCondicoes;
    private Boolean exibirMedicamentos;
    private Boolean exibirNecessidades;
    private Boolean exibirBiosseguranca;
    private Boolean exibirIdade;
    private Boolean exibirTipoSanguineo; 
}

package com.emertag.emertagAPP.dtos;

import lombok.*;


@Setter 
@Getter 
@NoArgsConstructor 
@AllArgsConstructor 
@Builder 
public class ContatoEmergenciaRequestDTO {

    private String nome;
    private String relacao;
    private String telefone; 
    
}

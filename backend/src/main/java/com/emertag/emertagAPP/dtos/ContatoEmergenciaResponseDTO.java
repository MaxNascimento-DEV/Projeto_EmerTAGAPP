package com.emertag.emertagAPP.dtos;

import  lombok.*;

@Getter 
@Setter 
@NoArgsConstructor 
@AllArgsConstructor 
@Builder 
public class ContatoEmergenciaResponseDTO {

    private Long idContato;
    private String nome;
    private String relacao;
    private String telefone; 
    
}

package com.emertag.emertagAPP.dtos;

import lombok.*;

@Getter 
@Setter 
@NoArgsConstructor 
@AllArgsConstructor 
@Builder 

public class ConviteRedeRequestDTO {

    private String emailConvidade;
    private String podeVisualizarPrivado;
    private String podeEditar;

}

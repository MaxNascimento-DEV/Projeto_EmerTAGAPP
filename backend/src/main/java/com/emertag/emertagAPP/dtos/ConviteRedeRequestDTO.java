package com.emertag.emertagAPP.dtos;

import lombok.*;

@Getter 
@Setter 
@NoArgsConstructor 
@AllArgsConstructor 
@Builder 

public class ConviteRedeRequestDTO {

    private String emailConvidado;
    private Boolean podeVisualizarPrivado;
    private Boolean podeEditar;

}

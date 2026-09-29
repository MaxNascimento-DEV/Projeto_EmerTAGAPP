package com.emertag.emertagAPP.dtos;

import com.emertag.emertagAPP.enums.TipoInformacaoSaude;

import lombok.*;

@Getter 
@Setter 
@NoArgsConstructor 
@AllArgsConstructor 
@Builder 

public class InformacaoSaudeRequestDTO {

    private TipoInformacaoSaude tipo;
    private String descricao; 

}

package com.emertag.emertagAPP.dtos;

import com.emertag.emertagAPP.enums.TamanhoTexto;

import lombok.*;

@Getter 
@Setter 
@NoArgsConstructor 
@AllArgsConstructor 
@Builder 

public class ConfiguracaoAcessibilidadeResponseDTO {
    
    private TamanhoTexto tamanhoTexto;
    private Boolean altoContraste; 
}

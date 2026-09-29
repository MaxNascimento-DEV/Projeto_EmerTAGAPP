package com.emertag.emertagAPP.dtos;

import lombok.*;

@Getter 
@Setter 
@AllArgsConstructor 
@NoArgsConstructor 
@Builder 

public class RedeCuidadoResponseDTO {
    private Long idRede;
    private Long idPerfil;
    private String nomePerfil;
    private Long idUsuario; 
    private String nomeUsuario; 
    private Boolean podeVisualizarPrivado; 
    private Boolean podeEditar; 
}

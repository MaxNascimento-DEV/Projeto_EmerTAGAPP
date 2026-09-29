package com.emertag.emertagAPP.dtos;

import java.time.LocalDateTime;

import lombok.*;

@Getter 
@Setter 
@AllArgsConstructor 
@NoArgsConstructor 
@Builder 

public class UsuarioResponseDTO {
    
    private Long idUsuario;
    private String nome;
    private String emial;
    private String telefone;
    private String fotoUrl;
    private LocalDateTime criadoEm;
}

package com.emertag.emertagAPP.dtos;

import lombok.*;

@Getter 
@Setter 
@NoArgsConstructor 
@AllArgsConstructor 
@Builder 

public class UsuarioRequestDTO {

    private String nome;
    private String email;
    private String telefone;
    private String senha;
    private String fotoUrl;
    
}

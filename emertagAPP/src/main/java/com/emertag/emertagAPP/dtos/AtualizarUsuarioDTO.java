package com.emertag.emertagAPP.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*; 

@Getter 
@Setter 
@NoArgsConstructor 
@AllArgsConstructor 
@Builder
public class AtualizarUsuarioDTO {

    @NotBlank(message = "Nome é Obrigatório")
    @Size(min = 3, max = 100, message = "Nome deve ter entre 3 e 100 caracteres")
    private String nome;
    
    @Size(max = 20, message = "Telefone deve ter no máximo 20 caracteres")
    private String telefone; 

    private String fotoUrl;

}

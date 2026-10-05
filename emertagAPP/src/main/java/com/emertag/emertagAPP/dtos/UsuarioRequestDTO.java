package com.emertag.emertagAPP.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter 
@Setter 
@NoArgsConstructor 
@AllArgsConstructor 
@Builder 

public class UsuarioRequestDTO {

    @NotBlank(message = "O Nome é obrigatorio")
    @Size(min = 3, max = 100, message = "Nome deve ter entre 3 e 100 caracteres")
    private String nome;
    
    @NotBlank(message = "O Email é obrigatorio")
    @Email(message = "E-mail inválido")
    private String email;

    @Size(max = 20, message = "Telefone deve ter no máximo 20 caracteres")
    private String telefone;

    @NotBlank(message = "A senha é obrigatória")
    @Size(min = 8, message = "A senha deve ter no mínimo 8 caracteres")
    private String senha;

    private String fotoUrl;
    
}

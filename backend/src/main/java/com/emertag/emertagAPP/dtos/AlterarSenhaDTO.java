package com.emertag.emertagAPP.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AlterarSenhaDTO {

    @NotBlank(message = "Senha atual é obrigatória.")
    private String senhaAtual;

    @NotBlank(message = "Nova senha é obrigatória.")
    @Size(min = 8, message = "A senha deve ter no mínimo 8 caracteres")
    private String novaSenha;
}

package com.emertag.emertagAPP.dtos;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponseDTO {
    private String token;
    private UsuarioResponseDTO usuario;
}
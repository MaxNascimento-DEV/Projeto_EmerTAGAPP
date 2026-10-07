package com.emertag.emertagAPP.dtos;

import jakarta.validation.constraints.NotBlank;
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
public class FotoBase64DTO {

    @NotBlank(message = "Imagem é obrigatória.")
    private String base64;

    // Ex.: image/jpeg, image/png
    private String mimeType;
}

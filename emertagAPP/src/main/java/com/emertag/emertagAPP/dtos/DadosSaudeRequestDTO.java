package com.emertag.emertagAPP.dtos;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// Mesmo formato do DadosSaudeResponseDTO: o app envia as listas completas e o backend substitui tudo
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DadosSaudeRequestDTO {

    private List<String> alergia;
    private List<String> condicoesSaude;
    private List<String> medicamentos;
    private List<String> necessidadeEspecificas;
    private List<String> biosseguranca;

}

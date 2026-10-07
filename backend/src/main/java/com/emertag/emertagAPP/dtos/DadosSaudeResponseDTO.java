package com.emertag.emertagAPP.dtos;

import java.util.List;
import lombok.*;

@Getter 
@Setter 
@NoArgsConstructor 
@AllArgsConstructor 
@Builder 

public class DadosSaudeResponseDTO {

    private List<String> alergia;  
    private List<String> condicoesSaude;
    private List<String> medicamentos;
    private List<String> necessidadeEspecificas;
    private List<String> biosseguranca; 

}

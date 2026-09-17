package com.emertag.emertagAPP.entity;
import java.time.LocalDateTime;
import com.emertag.emertagAPP.enums.TamanhoTexto;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "configuracao_acessibilidade")
@Getter 
@Setter 
@NoArgsConstructor 
@AllArgsConstructor 
@Builder 
public class ConfiguracaoAcessibilidade {

    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_configuracao")
    private Long idConfiguracao;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false, unique = true)
    private Usuario usuario; 
    
    @Enumerated(EnumType.STRING)
    @Column(name = "tamanho_texto", length = 10)
    private TamanhoTexto tamanhoTexto;

    @Column(name = "alto_contraste")
    private boolean altoContraste; 

    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEM;

    @Column(name = "atualizado_em")
    private LocalDateTime atualizadoEm; 

    @PrePersist 
    private void prePersist(){
        this.criadoEM = LocalDateTime.now();
        this.atualizadoEm = LocalDateTime.now(); 
    }

    @PreUpdate 
    private void preUpdate(){
        this.atualizadoEm = LocalDateTime.now(); 
    }


}

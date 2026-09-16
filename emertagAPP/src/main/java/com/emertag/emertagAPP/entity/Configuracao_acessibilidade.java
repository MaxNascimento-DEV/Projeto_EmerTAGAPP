package com.emertag.emertagAPP.entity;
import java.time.LocalDateTime;
import com.emertag.emertagAPP.enums.Tamanho_texto;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "configurracao_acessibilidade")
@Getter 
@Setter 
@NoArgsConstructor 
@AllArgsConstructor 
@Builder 
public class Configuracao_acessibilidade {

    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false, unique = true)
    private Usuario usuario; 
    
    @Enumerated(EnumType.STRING)
    @Column(name = "tamanho_texto", length = 10)
    private Tamanho_texto tamanhoTexto;

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

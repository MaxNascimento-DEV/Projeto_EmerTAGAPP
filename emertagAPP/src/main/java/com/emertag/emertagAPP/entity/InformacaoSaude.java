package com.emertag.emertagAPP.entity;
import com.emertag.emertagAPP.enums.TipoInformacaoSaude;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "informacao_saude")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InformacaoSaude {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_informacao")
    private Long idInformacao;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_perfil", nullable = false)
    private PerfilEmergencia perfil;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private TipoInformacaoSaude tipo;

    @Column(nullable = false, length = 255)
    private String descricao; 
    
    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEM;

    @Column(name = "atualizado_em")
    private LocalDateTime atualizadoEM; 


    @PrePersist
    private void prePersist(){
        this.criadoEM = LocalDateTime.now();
        this.atualizadoEM = LocalDateTime.now();
    }

    @PreUpdate
    private void preUpdate(){
        this.atualizadoEM = LocalDateTime.now(); 
    }
}

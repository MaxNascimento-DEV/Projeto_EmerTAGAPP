package com.emertag.emertagAPP.entity;
import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "privacidade_perfil" )
@Getter 
@Setter
@AllArgsConstructor
@NoArgsConstructor 
@Builder 
public class PrivacidadePerfil {

    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_privacidade", nullable = false)
    private Long idPrivacidade; 

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_perfil", nullable =  false, unique = true)
    private PerfilEmergencia perfil; 

    @Column(name = "exibir_alergias", nullable = false)
    @Builder.Default
    private Boolean exibirAlergias = true; 

    @Column(name = "exibir_condicoes", nullable = false)
    @Builder.Default
    private Boolean exibirCondicoes = true; 

    @Column(name = "exibir_medicamentos", nullable = false)
    @Builder.Default
    private Boolean exibirMedicamentos = true; 

    @Column(name = "exibir_necessidades", nullable = false)
    @Builder.Default
    private Boolean exibirNecessidades = true;

    @Column(name = "exibir_biosseguranca", nullable = false)
    @Builder.Default
    private Boolean exibirBiosseguranca = true; 

    @Column(name = "exibir_idade", nullable = false)
    @Builder.Default
    private Boolean exibirIdade = true; 

    @Column(name = "exibir_tipo_sanguineo", nullable = false)
    @Builder.Default
    private Boolean exibirTipoSanguineo = true;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEm;
    
    @Column(name = "atualizado_em")
    private LocalDateTime atualizadoEm; 

    @PrePersist
    protected void prePersist(){
        this.criadoEm = LocalDateTime.now();
        this.atualizadoEm = LocalDateTime.now(); 
    }

    @PreUpdate
    protected void preUpdate(){
        this.atualizadoEm = LocalDateTime.now(); 
    } 

}

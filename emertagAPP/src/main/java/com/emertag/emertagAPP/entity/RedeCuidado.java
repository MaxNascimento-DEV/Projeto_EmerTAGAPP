package com.emertag.emertagAPP.entity;

import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
    name = "rede_cuidado",
    uniqueConstraints = @UniqueConstraint(
        name = "uk_rede_cuidado_perfil_usuario",
        columnNames = {"id_perfil", "id_usuario"}
    )
)
@Getter 
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class RedeCuidado {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_rede", nullable = false)
    private Long idRede;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_perfil", nullable = false)
    private PerfilEmergencia perfil;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario; 

    @Column(name = "pode_visualizar_privado", nullable = false)
    private Boolean podeVisualizarPrivado; 

    @Column(name = "pode_editar", nullable = false)
    private Boolean podeEditar; 

    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEm; 

    @PrePersist 
    protected void prePersist(){
        this.criadoEm = LocalDateTime.now(); 
    }
}

package com.emertag.emertagAPP.entity;

import java.time.LocalDateTime;
import com.emertag.emertagAPP.enums.StatusConvite;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "convite_rede")
@Getter 
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConviteRede {
    
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_convite", nullable = false)
    private Long idConvite;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_perfil", nullable = false)
    private PerfilEmergencia perfil;

    @Column(name = "email_convidado", nullable = false, length = 150)
    private String emailConvidado; 

    @Column(name = "pode_visualizar_privado", nullable = false)
    private Boolean podeVisualizarPrivado; 

    @Column(name = "pode_editar", nullable = false)
    private Boolean podeEditar; 

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 150)
    private StatusConvite status; 

    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEm;

     @Column(name = "respondido_em")
    private LocalDateTime respondidoEm;

    @PrePersist 
    protected void prePersist(){
        this.criadoEm = LocalDateTime.now();
        this.status = StatusConvite.PENDENTE;
    }
}

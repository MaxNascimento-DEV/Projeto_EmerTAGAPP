package com.emertag.emertagAPP.entity;
import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "contato_emergencia")
@Getter 
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class ContatoEmergencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_contato", nullable = false)
    private Long idContato;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_perfil", nullable = false)
    private PerfilEmergencia perfil;

    @Column(name = "nome", nullable = false, length = 150)
    private String nome;

    @Column(name = "relacao",nullable = false, length = 50)
    private String relacao; 

    @Column(name = "telefone", nullable = false, length = 20)
    private String telefone; 
    
    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    @Column(name = "atualizado_em")
    private LocalDateTime atualizadoEm; 

    @PrePersist
    protected  void prePresist(){
        this.criadoEm = LocalDateTime.now();
        this.atualizadoEm = LocalDateTime.now(); 
    }

    @PreUpdate
    protected void preUpdate(){
        this.atualizadoEm = LocalDateTime.now(); 
    }
}

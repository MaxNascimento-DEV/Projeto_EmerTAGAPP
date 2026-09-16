package com.emertag.emertagAPP.entity;
import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "usuario")
@Getter 
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Usuario {


    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    private Long idUsuario; 

    @Column(nullable = false, length = 255)
    private String nome;
    
    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(unique = true, length = 20)
    private String telefone;

    @Column(name = "senha_hash", nullable = false, length = 255)
    private String senhaHash;

    @Column(name = "foto_url", length = 500)
    private String fotoUrl;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEM;

    @Column(name = "atualizado_em")
    private LocalDateTime atualizaEm;

    @PrePersist
    private void prePersist(){
        this.criadoEM = LocalDateTime.now();
        this.atualizaEm = LocalDateTime.now(); 
    }
    
    @PreUpdate 
    private void preUpdate(){
        this.atualizaEm = LocalDateTime.now(); 
    }
}

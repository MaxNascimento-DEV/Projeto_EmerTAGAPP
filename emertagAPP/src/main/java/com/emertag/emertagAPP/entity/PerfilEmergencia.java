package com.emertag.emertagAPP.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import com.emertag.emertagAPP.enums.TipoPerfil;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "perfil_emergencia")
@Getter 
@Setter 
@AllArgsConstructor 
@NoArgsConstructor 
@Builder 
public class PerfilEmergencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pefil")
    private Long idPerfil;

    @ManyToOne
    @JoinColumn(name = "id_administrador", nullable = false)
    private Usuario administrador; 

    @Column(nullable = false, length = 150)
    private String nome;

    @Column(name = "data_nascimento", nullable = false)
    private LocalDate dataNascimento; 

    @Column(name = "tipo_sanguineo", length = 3)
    private String TipoSanguineo;

    @Column(name = "foto_url", length = 500)
    private String fotoUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_perfil", nullable = false, length = 15)
    private TipoPerfil tipoPerfil;

    @Column(length = 50)
    private String parentesco; 

    @Column(name = "token_publico", nullable = false, unique = true, length = 100)
    private String tokenPublico;

    @Column(name = "ultima_atualizacao_saude")
    private LocalDateTime ultimaAtualizacaoSaude; 

    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    @Column(name = "atualizado_em")
    private LocalDateTime atualizadoEm; 

    @PrePersist
    private void prePersist(){
        this.criadoEm = LocalDateTime.now();
        this.atualizadoEm = LocalDateTime.now();
    }

    @PreUpdate
    private void preUpdate(){
        this.atualizadoEm = LocalDateTime.now(); 
    }

}

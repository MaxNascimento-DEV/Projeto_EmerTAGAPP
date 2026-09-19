package com.emertag.emertagAPP.service;

import com.emertag.emertagAPP.entity.Usuario;
import com.emertag.emertagAPP.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;  

    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder){
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder; 
    }

    @Transactional
    public Usuario cadastrar(Usuario usuario, String senhaPura){
        if(usuarioRepository.findByEmail(usuario.getEmail()).isPresent()){
            throw new IllegalArgumentException("Este e-mail já está cadastrado.");
        }
        usuario.setSenhaHash(passwordEncoder.encode(senhaPura));
        return usuarioRepository.save(usuario); 
    }

    @Transactional(readOnly = true)
    public Usuario autenticar(String email, String senhaPura){
        Usuario usuario = usuarioRepository.findByEmail(email).orElseThrow(() -> new IllegalArgumentException("E-mail ou  senha inválidos."));
        if(!passwordEncoder.matches(senhaPura, usuario.getSenhaHash())){
            throw new IllegalArgumentException("E-mail ou senha invalidos."); 
        }
        return usuario; 
    }
}

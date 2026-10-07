package com.emertag.emertagAPP.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Base64;
import java.util.Map;
import java.util.UUID;

@Service
public class FotoService {

    private static final Map<String, String> EXTENSOES = Map.of(
            "image/jpeg", ".jpg",
            "image/png", ".png",
            "image/webp", ".webp",
            "image/heic", ".heic"
    );

    private static final int TAMANHO_MAXIMO = 5 * 1024 * 1024;

    private final Path pastaUploads;

    public FotoService(@Value("${app.uploads-dir}") String pastaUploads) {
        this.pastaUploads = Path.of(pastaUploads).toAbsolutePath().normalize();
    }

    // Salva a imagem com nome aleatório e devolve o caminho público (ex.: /uploads/abc.jpg)
    public String salvar(MultipartFile arquivo) {
        if (arquivo == null || arquivo.isEmpty()) {
            throw new IllegalArgumentException("Nenhuma imagem enviada.");
        }
        try (InputStream entrada = arquivo.getInputStream()) {
            return gravar(entrada, arquivo.getContentType());
        } catch (IOException e) {
            throw new IllegalStateException("Não foi possível salvar a imagem.", e);
        }
    }

    // Versão usada pelo app: a imagem chega em base64 dentro de um JSON
    public String salvarBase64(String base64, String contentType) {
        if (base64 == null || base64.isBlank()) {
            throw new IllegalArgumentException("Nenhuma imagem enviada.");
        }
        // Aceita também o formato "data:image/jpeg;base64,...."
        String dados = base64.contains(",") ? base64.substring(base64.indexOf(',') + 1) : base64;

        byte[] bytes;
        try {
            bytes = Base64.getMimeDecoder().decode(dados);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Imagem inválida.");
        }
        if (bytes.length > TAMANHO_MAXIMO) {
            throw new IllegalArgumentException("A imagem deve ter no máximo 5 MB.");
        }
        try {
            return gravar(new ByteArrayInputStream(bytes), contentType);
        } catch (IOException e) {
            throw new IllegalStateException("Não foi possível salvar a imagem.", e);
        }
    }

    private String gravar(InputStream entrada, String contentType) throws IOException {
        String extensao = EXTENSOES.get(contentType);
        if (extensao == null) {
            throw new IllegalArgumentException("Formato de imagem não suportado. Use JPG, PNG ou WEBP.");
        }

        String nome = UUID.randomUUID().toString().replace("-", "") + extensao;
        Files.createDirectories(pastaUploads);
        Files.copy(entrada, pastaUploads.resolve(nome), StandardCopyOption.REPLACE_EXISTING);

        return "/uploads/" + nome;
    }

    public Path getPastaUploads() {
        return pastaUploads;
    }
}

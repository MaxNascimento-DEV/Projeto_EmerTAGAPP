package com.emertag.emertagAPP.config;

import com.emertag.emertagAPP.service.FotoService;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final FotoService fotoService;

    public WebConfig(FotoService fotoService) {
        this.fotoService = fotoService;
    }

    // Serve as fotos enviadas em /uploads/** direto da pasta no disco
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(fotoService.getPastaUploads().toUri().toString());
    }
}

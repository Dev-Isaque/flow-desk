package br.com.api.flowDesk.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {

        registry.addResourceHandler("/uploads/photo-user/**")
                .addResourceLocations("file:uploads/photo-user/");

        registry.addResourceHandler("/uploads/task-files/**")
                .addResourceLocations("file:uploads/task-files/");
    }
}

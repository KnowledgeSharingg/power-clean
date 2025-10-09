package com.example.powerclean.config

import org.springframework.context.annotation.Configuration
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@Configuration
class WebConfig : WebMvcConfigurer {
    private val logger = org.slf4j.LoggerFactory.getLogger(WebConfig::class.java)

    override fun addResourceHandlers(registry: ResourceHandlerRegistry) {
        registry
            .addResourceHandler("/BookCoverImages/**")
            .addResourceLocations("file:BookCoverImages/")
    }
}

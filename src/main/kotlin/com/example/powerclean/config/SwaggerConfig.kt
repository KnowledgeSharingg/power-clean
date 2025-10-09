package com.example.powerclean.config

import io.swagger.v3.oas.models.Components
import io.swagger.v3.oas.models.OpenAPI
import io.swagger.v3.oas.models.info.Info
import io.swagger.v3.oas.models.security.SecurityRequirement
import io.swagger.v3.oas.models.security.SecurityScheme
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class SwaggerConfig {
    private val logger = org.slf4j.LoggerFactory.getLogger(SwaggerConfig::class.java)
    @Bean
    fun openAPI(): OpenAPI {
        val jwtSchemeName = "bearerAuth"
        val securityRequirement = SecurityRequirement().addList(jwtSchemeName)

        val securityScheme =
            SecurityScheme()
                .name(jwtSchemeName)
                .type(SecurityScheme.Type.HTTP) // HTTP 인증 스키마
                .scheme("bearer") // Bearer
                .bearerFormat("JWT") // (옵션) UI 힌트

        return OpenAPI()
            .info(apiInfo())
            .components(
                Components()
                    .addSecuritySchemes(jwtSchemeName, securityScheme),
            )
            .addSecurityItem(securityRequirement)
    }

    private fun apiInfo(): Info {
        return Info()
            .title("Power Clean API")
            .description("API for Power Clean")
            .version("1.0.0")
    }
}

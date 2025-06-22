package com.example.powerclean.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpStatus
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.HttpStatusEntryPoint
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.CorsConfigurationSource
import org.springframework.web.cors.UrlBasedCorsConfigurationSource

@Configuration
@EnableWebSecurity
class SecurityConfig {
    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .cors { it.configurationSource(corsConfigurationSource()) }
            .csrf { it.disable() } // CSRF 보호 비활성화
            .headers { headers ->
                headers.frameOptions { it.disable() } // H2 콘솔 프레임 허용
            }
            .authorizeHttpRequests {
                // it.requestMatchers(
                //     "/",
                //     "/error",
                //     "/webjars/**",
                //     "/h2-console/**",
                //     "/health-check",
                //     "/swagger-ui.html",
                //     "/swagger-ui/**",
                //     "/v3/api-docs/**",
                // ).permitAll()
                // it.anyRequest().authenticated()
                it.anyRequest().permitAll()
            }
            .exceptionHandling { exception ->
                exception.authenticationEntryPoint(HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))
            }
            .formLogin { it.disable() } // 기본 로그인 페이지 비활성화
            .oauth2Login { oauth2 ->
                oauth2
                    // .loginPage("/custom-login") // 커스텀 로그인 페이지 설정 (옵션)
                    // .userInfoEndpoint { userInfo ->
                    //     userInfo.userService(customOAuth2UserService()) // 사용자 정보 처리
                    // }
                    .loginPage("/login")
                    .defaultSuccessUrl("/oauth2/login", true)
            }

        return http.build()
    }

    fun corsConfigurationSource(): CorsConfigurationSource {
        val configuration = CorsConfiguration()
        configuration.allowedOrigins =
            listOf(
                "http://127.0.0.1:3000",
                "http://localhost:3000",
                "https://power-clean-client.vercel.app",
                "https://barely-settled-iguana.ngrok-free.app",
            )
        configuration.allowedMethods = listOf("GET", "POST", "PUT", "DELETE", "OPTIONS")
        configuration.allowedHeaders = listOf("Authorization", "Content-Type")
        configuration.allowCredentials = true

        val source = UrlBasedCorsConfigurationSource()
        source.registerCorsConfiguration("/**", configuration) // 모든 경로에 적용
        return source
    }
}

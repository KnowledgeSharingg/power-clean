package com.example.powerclean.config.security

import com.example.powerclean.application.port.outbound.persistence.AccountRepository
import com.example.powerclean.presentation.inbound.filter.JwtAuthorizationFilter
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.http.HttpStatus
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.AuthenticationProvider
import org.springframework.security.authentication.dao.DaoAuthenticationProvider
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.HttpStatusEntryPoint
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.CorsConfigurationSource
import org.springframework.web.cors.UrlBasedCorsConfigurationSource

@Configuration
@EnableWebSecurity
class SecurityConfig {
    private val logger = org.slf4j.LoggerFactory.getLogger(SecurityConfig::class.java)

    @Bean
    fun userDetailsService(accountRepository: AccountRepository): JwtUserDetailsService =
        JwtUserDetailsService(accountRepository)

    @Bean
    fun authenticationManager(config: AuthenticationConfiguration): AuthenticationManager = config.authenticationManager

    @Bean
    fun authenticationProvider(accountRepository: AccountRepository): AuthenticationProvider =
        DaoAuthenticationProvider()
            .also {
                it.setUserDetailsService(userDetailsService(accountRepository))
                it.setPasswordEncoder(encoder())
            }

    @Bean
    fun securityFilterChain(
        http: HttpSecurity,
        jwtAuthenticationFilter: JwtAuthorizationFilter,
        authenticationProvider: AuthenticationProvider,
    ): SecurityFilterChain {
        http
            .cors { it.configurationSource(corsConfigurationSource()) }
            .csrf { it.disable() } // CSRF 보호 비활성화
            .headers { headers ->
                headers.frameOptions { it.disable() } // H2 콘솔 프레임 허용
            }
            .authorizeHttpRequests {
                it.requestMatchers(
                    "/auth",
                    "/auth/refresh",
                    "/account/register",
                    "/account/login",
                    "/error",
                    "/h2-console/**",
                    "/oauth2/**",
                    "/login",
                    "/swagger-ui/**",
                    "/v3/api-docs/**",
                    "/exception-test/**",
                    "/api/v1/book-data/**",
                )
                    .permitAll()
                    .requestMatchers(HttpMethod.GET, "/**").permitAll()
                    .requestMatchers(HttpMethod.POST, "/**").authenticated()
                    .requestMatchers(HttpMethod.PUT, "/**").authenticated()
                    .requestMatchers(HttpMethod.DELETE, "/**").authenticated()
                    .requestMatchers(HttpMethod.PATCH, "/**").authenticated()
                    .anyRequest()
                    .fullyAuthenticated()
//                it.anyRequest().permitAll()
            }
            .sessionManagement {
                it.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            }
            .authenticationProvider(authenticationProvider)
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter::class.java)
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

    @Bean
    fun encoder(): PasswordEncoder = BCryptPasswordEncoder()

    fun corsConfigurationSource(): CorsConfigurationSource {
        val configuration = CorsConfiguration()
        configuration.allowedOrigins =
            listOf(
                "http://127.0.0.1:3000",
                "http://localhost:3000",
                "http://127.0.0.1:3001",
                "http://localhost:3001",
                "https://power-clean-client.vercel.app",
                "https://barely-settled-iguana.ngrok-free.app",
            )
        configuration.allowedMethods = listOf("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
        configuration.allowedHeaders = listOf("Authorization", "Content-Type")
        configuration.allowCredentials = true

        val source = UrlBasedCorsConfigurationSource()
        source.registerCorsConfiguration("/**", configuration) // 모든 경로에 적용
        return source
    }
}

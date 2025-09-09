package com.example.powerclean.config

import com.example.powerclean.application.inbound.AccountAuthenticateUseCase
import com.example.powerclean.application.service.AuthenticationService
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class ServiceConfig {
    @Bean("accountAuthenticationUseCase")
    fun authenticationService(authenticationService: AuthenticationService): AccountAuthenticateUseCase =
        authenticationService
}

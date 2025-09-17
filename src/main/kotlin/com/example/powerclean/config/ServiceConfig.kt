package com.example.powerclean.config

import com.example.powerclean.application.port.inbound.AccountAuthenticateUseCase
import com.example.powerclean.application.port.inbound.AccountRegisterUseCase
import com.example.powerclean.application.service.AccountService
import com.example.powerclean.application.service.AuthenticationService
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class ServiceConfig {
    // 구현 클래스(accountService)의 이름과 중복되어서 다른 이름으로 지정해줌.
    @Bean("AccountRegisterUseCase")
    fun accountService(accountService: AccountService): AccountRegisterUseCase = accountService

    @Bean("AccountAuthenticationUseCase")
    fun authenticationService(authenticationService: AuthenticationService): AccountAuthenticateUseCase =
        authenticationService

//    @Bean("TokenProvider")
//    fun tokenProvider(tokenProvider: JwtTokenProvider): TokenProvider = tokenProvider
}

package com.example.powerclean.presentation.inbound.rest

import com.example.powerclean.application.service.AuthService
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.oauth2.core.user.OAuth2User
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class AuthController(private val authService: AuthService) {
    @GetMapping("oauth2/login")
    fun oauth2Login(
        @AuthenticationPrincipal principal: OAuth2User,
    ): String = authService.oauth2Login(principal)
}

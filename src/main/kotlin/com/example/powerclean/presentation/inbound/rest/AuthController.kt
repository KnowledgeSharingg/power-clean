package com.example.powerclean.presentation.inbound.rest

import com.example.powerclean.application.port.inbound.AccountAuthenticateUseCase
import com.example.powerclean.application.service.AuthService
import com.example.powerclean.presentation.dto.RefreshAccessTokenReqDto
import com.example.powerclean.presentation.dto.RefreshAccessTokenResDto
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.oauth2.core.user.OAuth2User
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController

@RestController("/auth")
class AuthController(
    private val authService: AuthService,
    private val authenticationService: AccountAuthenticateUseCase,
) {
    @PostMapping("/refresh")
    fun refreshAccessToken(
        @RequestBody request: RefreshAccessTokenReqDto,
    ): RefreshAccessTokenResDto =
        RefreshAccessTokenResDto(
            accessToken = authenticationService.refreshAccessToken(request.refreshToken),
        )

    @GetMapping("oauth2/login")
    fun oauth2Login(
        @AuthenticationPrincipal principal: OAuth2User,
    ): String = authService.oauth2Login(principal)
}

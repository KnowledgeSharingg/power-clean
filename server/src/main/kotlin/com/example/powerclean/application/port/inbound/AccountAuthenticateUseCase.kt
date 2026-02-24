package com.example.powerclean.application.port.inbound

import com.example.powerclean.presentation.dto.AuthenticationReqDto
import com.example.powerclean.presentation.dto.AuthenticationResDto

interface AccountAuthenticateUseCase {
    /**
     * 인증 및 JWT 발급.
     */
    fun authentication(authenticationRequest: AuthenticationReqDto): AuthenticationResDto

    /**
     * refreshToken으로 accessToken 재발급.
     */
    fun refreshAccessToken(refreshToken: String): String
}

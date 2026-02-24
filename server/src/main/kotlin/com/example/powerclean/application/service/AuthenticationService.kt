package com.example.powerclean.application.service

import com.example.powerclean.application.port.inbound.AccountAuthenticateUseCase
import com.example.powerclean.application.port.outbound.TokenProvider
import com.example.powerclean.application.port.outbound.persistence.AccountRepository
import com.example.powerclean.config.security.JwtUserDetailsService
import com.example.powerclean.presentation.dto.AuthenticationReqDto
import com.example.powerclean.presentation.dto.AuthenticationResDto
import org.springframework.beans.factory.annotation.Value
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.AuthenticationServiceException
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.stereotype.Service
import java.util.Date

@Service
class AuthenticationService(
    private val authManager: AuthenticationManager,
    private val userDetailsService: JwtUserDetailsService,
    private val tokenService: TokenProvider,
    @Value("\${jwt.access-token-expiration-time}") private val accessTokenExpiration: Long = 0,
    @Value("\${jwt.refresh-token-expiration-time}") private val refreshTokenExpiration: Long = 0,
    private val accountRepository: AccountRepository,
) : AccountAuthenticateUseCase {
    private val logger = org.slf4j.LoggerFactory.getLogger(AuthenticationService::class.java)

    override fun authentication(authenticationRequest: AuthenticationReqDto): AuthenticationResDto {
        // TODO: 내부 동작 플로우 파악하기.
        // 이메일, 패스워드 일치 등 계정 정보에 대해 request값과 DB값 비교 검증.
        authManager.authenticate(
            UsernamePasswordAuthenticationToken(
                authenticationRequest.email,
                authenticationRequest.password,
            ),
        )

        // 계정 정보 조회.
        val user = userDetailsService.loadUserByUsername(authenticationRequest.email)

        // jwt 생성.
        val accessToken = createAccessToken(user)
        val refreshToken = createRefreshToken(user)

        return AuthenticationResDto(
            accessToken = accessToken,
            refreshToken = refreshToken,
        )
    }

    override fun refreshAccessToken(refreshToken: String): String {
        val username = tokenService.extractUsername(refreshToken)

        return username.let { user ->
            val currentUserDetails = userDetailsService.loadUserByUsername(user)
            val foundAccount = accountRepository.findByPersonalInfo_Name(username)

            if (currentUserDetails.getEmail() == foundAccount?.email) {
                createAccessToken(currentUserDetails)
            } else {
                throw AuthenticationServiceException("Invalid refresh token")
            }
        }
    }

    private fun createAccessToken(user: UserDetails): String {
        return tokenService.generateToken(
            subject = user.username,
            expiration = Date(System.currentTimeMillis() + accessTokenExpiration * 60 * 60 * 1000),
        )
    }

    private fun createRefreshToken(user: UserDetails) =
        tokenService.generateToken(
            subject = user.username,
            expiration = Date(System.currentTimeMillis() + refreshTokenExpiration * 60 * 60 * 1000),
        )
}

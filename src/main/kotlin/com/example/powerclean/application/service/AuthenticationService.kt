package com.example.powerclean.application.service

import com.example.powerclean.application.inbound.AccountAuthenticateUseCase
import com.example.powerclean.presentation.dto.AuthenticationReqDto
import com.example.powerclean.presentation.dto.AuthenticationResDto
import com.example.powerclean.presentation.outbound.persistence.port.AccountRepository
import org.springframework.beans.factory.annotation.Value
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.AuthenticationServiceException
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.stereotype.Service
import java.util.*

@Service
class AuthenticationService(
    private val authManager: AuthenticationManager,
    private val userDetailsService: UserDetailsService,
    private val tokenService: TokenService,
    @Value("\${jwt.access-token-expiration-time}") private val accessTokenExpiration: Long = 0,
    @Value("\${jwt.refresh-token-expiration-time}") private val refreshTokenExpiration: Long = 0,
    private val accountRepository: AccountRepository,
) : AccountAuthenticateUseCase {
    override fun authentication(authenticationRequest: AuthenticationReqDto): AuthenticationResDto {
        authManager.authenticate(
            UsernamePasswordAuthenticationToken(
                authenticationRequest.username,
                authenticationRequest.password,
            ),
        )

        val user = userDetailsService.loadUserByUsername(authenticationRequest.username)

        val accessToken = _createAccessToken(user)
        val refreshToken = _createRefreshToken(user)

        return AuthenticationResDto(
            accessToken = accessToken,
            refreshToken = refreshToken,
        )
    }

    override fun refreshAccessToken(refreshToken: String): String {
        val username = tokenService.extractUsername(refreshToken)

        return username.let { user ->
            val currentUserDetails = userDetailsService.loadUserByUsername(user)
            val foundAccount = accountRepository.findByEmail(username)

            if (currentUserDetails.username == foundAccount?.email) {
                _createAccessToken(currentUserDetails)
            } else {
                throw AuthenticationServiceException("Invalid refresh token")
            }
        }
    }

    private fun _createAccessToken(user: UserDetails): String {
        return tokenService.generateToken(
            subject = user.username,
            expiration = Date(System.currentTimeMillis() + accessTokenExpiration),
        )
    }

    private fun _createRefreshToken(user: UserDetails) =
        tokenService.generateToken(
            subject = user.username,
            expiration = Date(System.currentTimeMillis() + refreshTokenExpiration),
        )
}

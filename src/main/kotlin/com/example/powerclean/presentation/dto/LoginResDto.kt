package com.example.powerclean.presentation.dto

data class LoginResDto(
    val accessToken: String,
    val refreshToken: String,
) {
    companion object {
        fun of(
            accessToken: String,
            refreshToken: String,
        ): LoginResDto {
            return LoginResDto(accessToken, refreshToken)
        }
    }
}

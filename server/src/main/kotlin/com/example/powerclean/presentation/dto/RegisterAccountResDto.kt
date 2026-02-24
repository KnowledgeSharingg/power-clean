package com.example.powerclean.presentation.dto

data class RegisterAccountResDto(
    val accessToken: String,
    val refreshToken: String,
) {
    companion object {
        fun of(
            accessToken: String,
            refreshToken: String,
        ): RegisterAccountResDto {
            return RegisterAccountResDto(accessToken, refreshToken)
        }
    }
}

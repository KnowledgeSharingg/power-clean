package com.example.powerclean.presentation.dto

import jakarta.validation.constraints.NotBlank

data class RefreshAccessTokenReqDto(
    @get:NotBlank
    val refreshToken: String,
)

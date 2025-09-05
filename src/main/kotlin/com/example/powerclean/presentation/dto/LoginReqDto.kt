package com.example.powerclean.presentation.dto

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank

data class LoginReqDto(
    @get:NotBlank
    @get:Email
    val email: String,
    @get:NotBlank
    val password: String,
)

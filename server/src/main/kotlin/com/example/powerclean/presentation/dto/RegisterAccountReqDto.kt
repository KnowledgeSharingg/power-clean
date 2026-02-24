package com.example.powerclean.presentation.dto

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank

data class RegisterAccountReqDto(
    @get:NotBlank
    @get:Email
    val email: String,
    @get:NotBlank
    var password: String,
) {
    companion object {
        fun of(
            email: String,
            password: String,
        ): RegisterAccountReqDto {
            return RegisterAccountReqDto(email, password)
        }
    }
}

package com.example.powerclean.presentation.dto

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank

data class RegisterAccountReqDto(
    @get:NotBlank
    @get:Email
    val email: String,
    @get:NotBlank
    var password: String,
    @get:NotBlank
    val nickname: String,
) {
    companion object {
        fun of(
            email: String,
            password: String,
            nickname: String,
        ): RegisterAccountReqDto {
            return RegisterAccountReqDto(email, password, nickname)
        }
    }
}

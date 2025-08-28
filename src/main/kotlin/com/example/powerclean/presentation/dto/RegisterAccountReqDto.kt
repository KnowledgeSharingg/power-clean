package com.example.powerclean.presentation.dto

data class RegisterAccountReqDto(
    val email: String,
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

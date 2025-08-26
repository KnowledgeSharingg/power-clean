package com.example.powerclean.presentation.dto

import java.time.LocalDateTime

data class GetAccountInfoResDto(
    val email: String,
    val nickname: String,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime,
)

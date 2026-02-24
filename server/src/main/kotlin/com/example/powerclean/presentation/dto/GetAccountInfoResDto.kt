package com.example.powerclean.presentation.dto

import java.time.LocalDateTime
import java.util.UUID

data class GetAccountInfoResDto(
    val id: UUID,
    val email: String,
    val nickname: String,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime,
)

package com.example.powerclean.presentation.dto

import java.util.UUID

data class CreateReviewResDto(
    val id: UUID,
    val content: String,
    val rating: Int,
    val postId: UUID,
)

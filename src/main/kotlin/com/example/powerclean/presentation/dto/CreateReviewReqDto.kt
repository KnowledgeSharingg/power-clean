package com.example.powerclean.presentation.dto

import java.util.UUID

data class CreateReviewReqDto(
    val content: String,
    val rating: Int,
    val postId: UUID,
    val creatorAccountId: UUID,
)

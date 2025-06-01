package com.example.powerclean.presentation.dto

import java.util.UUID


data class GetReviewDetailResDto(
    val id: UUID,
    val content: String,
    val rating: Int,
    val postId: UUID,
    val creatorAccountId: UUID,
    val createdAt: String,
    val updatedAt: String,
)
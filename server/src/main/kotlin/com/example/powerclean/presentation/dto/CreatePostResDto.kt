package com.example.powerclean.presentation.dto

import java.util.UUID

data class CreatePostResDto(
    val id: UUID,
    val title: String,
    val content: String,
    val bookInfo: GetBookDetailResDto,
)

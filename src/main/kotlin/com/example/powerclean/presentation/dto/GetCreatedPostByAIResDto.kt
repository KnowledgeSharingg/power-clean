package com.example.powerclean.presentation.dto

data class GetCreatedPostByAIResDto(
    val title: String,
    val content: String,
    val bookInfo: GetBookDetailResDto,
)

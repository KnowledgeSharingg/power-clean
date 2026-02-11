package com.example.powerclean.presentation.dto

import java.util.UUID

data class GetPostDetailResDto(
    val id: UUID,
    val title: String,
    val content: String,
    val likeCount: Int? = null,
    val bookmarkCount: Int? = null,
    val createdAt: String,
    val updatedAt: String,
    val bookInfo: GetBookDetailResDto,
    val likedByMe: Boolean,
    val bookmarkedByMe: Boolean,
    val tags: List<String> = emptyList(),
)

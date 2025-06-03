package com.example.powerclean.presentation.dto

data class GetReviewListResDto(
    val reviews: List<GetReviewDetailResDto>,
    val totalPages: Int,
    val totalElements: Long,
)

package com.example.powerclean.presentation.dto

import io.swagger.v3.oas.annotations.media.Schema

data class RegisterPostsResDto(
    @Schema(description = "결과 메시지", example = "등록 완료")
    val message: String,
    @Schema(description = "Post로 등록된 Book의 개수", example = "5")
    val registeredCount: Int,
)

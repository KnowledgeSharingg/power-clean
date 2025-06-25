package com.example.powerclean.presentation.dto

import io.swagger.v3.oas.annotations.media.Schema
import java.util.UUID

data class UpdatePostReqDto(
    @Schema(description = "포스트의 id.", example = "123e4567-e89b-12d3-a456-426614174000")
    val id: UUID,
    @Schema(description = "포스트의 타이틀.", example = "포스트 타이틀!")
    val title: String,
    @Schema(description = "포스트의 컨텐츠.", example = "포스트 컨텐츠!")
    val content: String,
    val bookInfo: UpdateBookReqDto,
)

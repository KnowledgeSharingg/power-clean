package com.example.powerclean.presentation.dto

import io.swagger.v3.oas.annotations.media.Schema
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size
import java.util.UUID

data class UpdatePostReqDto(
    @Schema(description = "포스트의 id.", example = "123e4567-e89b-12d3-a456-426614174000")
    val id: UUID,
    @Schema(description = "포스트의 타이틀.", example = "포스트 타이틀!")
    @get:Size(min = 1, max = 50)
    val title: String,
    @Schema(description = "포스트의 컨텐츠.", example = "포스트 컨텐츠!")
    @get:NotBlank()
    @get:Size(min = 1, max = 1000)
    val content: String,
    val bookInfo: UpdateBookReqDto,
    @Schema(description = "포스트에 등록될 태그 목록.", example = "[\"소설\", \"추천\"]")
    val tags: List<String> = emptyList(),
)

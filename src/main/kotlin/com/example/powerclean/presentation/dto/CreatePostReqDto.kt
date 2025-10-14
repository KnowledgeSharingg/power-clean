package com.example.powerclean.presentation.dto

import io.swagger.v3.oas.annotations.media.Schema
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size
import java.util.UUID

data class CreatePostReqDto(
    @Schema(description = "포스트의 타이틀.", example = "포스트 타이틀!")
    @get:NotBlank()
    @get:Size(min = 1, max = 50)
    val title: String,
    @Schema(description = "포스트의 컨텐츠.", example = "포스트 컨텐츠!")
    @get:NotBlank()
    @get:Size(min = 1, max = 1000)
    val content: String,
    @Schema(description = "포스트 생성자 Account id 값.", example = "123e4567-e89b-12d3-a456-426614174000")
    var creatorAccountId: UUID?,
    @Schema(description = "포스트에 등록될 책 정보.")
    val bookInfo: CreateBookReqDto,
)

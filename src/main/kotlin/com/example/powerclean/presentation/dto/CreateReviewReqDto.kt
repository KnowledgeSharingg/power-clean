package com.example.powerclean.presentation.dto

import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size
import java.util.UUID

data class CreateReviewReqDto(
    @get:NotBlank
    @get:Size(min = 1, max = 255)
    val content: String,
    @get:Min(1)
    @get:Max(5)
    val rating: Int,
    val postId: UUID,
    var creatorAccountId: UUID,
)

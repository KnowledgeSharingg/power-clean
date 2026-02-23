package com.example.powerclean.presentation.dto

import io.swagger.v3.oas.annotations.media.Schema
import java.util.UUID

data class RegisterPostsReqDto(
    @Schema(
        description = "Post로 등록할 Book ID 목록. 빈 목록이면 post가 null인 모든 Book을 대상으로 함.",
        example = "[\"123e4567-e89b-12d3-a456-426614174000\", \"987fcdeb-51a2-43d1-b456-426614174001\"]",
    )
    val bookIds: List<UUID> = emptyList(),
)

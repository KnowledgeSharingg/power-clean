package com.example.powerclean.presentation.dto

import com.example.powerclean.domain.valueobject.AuthorInfo
import java.util.UUID

data class GetBookDetailResDto(
    val id: UUID?,
    val title: String?,
    val content: String?,
    val link: String?,
    val coverImageUrl: String?,
    val authorInfo: AuthorInfo?,
)

package com.example.powerclean.presentation.dto

import com.example.powerclean.domain.valueobject.AuthorInfo
import com.example.powerclean.utils.DefaultBookCoverImageUrl
import io.swagger.v3.oas.annotations.media.Schema

data class CreateBookReqDto(
    @Schema(description = "책 제목.", example = "이방인")
    val title: String,
    @Schema(description = "책 내용.", example = "이방인의 삶.")
    val content: String,
    @Schema(
        description = "책 커버 이미지",
        example = "https://github.com/user-attachments/assets/a4143315-2f76-44a2-8f0d-517414e95906",
    )
    val coverImageUrl: String = DefaultBookCoverImageUrl,
    @Schema(
        description = "책 정보 링크.",
        example =
            "https://search.kyobobook.co.kr/search?" +
                "keyword=%25EC%259D%25B4%25EB%25B0%25A9%25EC%259D%25B8&gbCode=TOT&target=total",
    )
    val link: String,
    @Schema(description = "저자 정보.")
    var authorInfo: AuthorInfo,
)

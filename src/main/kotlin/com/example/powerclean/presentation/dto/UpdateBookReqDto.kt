package com.example.powerclean.presentation.dto

import com.example.powerclean.domain.valueobject.AuthorInfo
import io.swagger.v3.oas.annotations.media.Schema
import jakarta.annotation.Nullable
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size
import org.hibernate.validator.constraints.URL

data class UpdateBookReqDto(
    @Schema(description = "책 제목.", example = "이방인")
    @get:NotBlank()
    @get:Size(min = 1, max = 50)
    val title: String,
    @Schema(description = "책 내용.", example = "이방인의 삶.")
    @get:NotBlank()
    @get:Size(min = 1, max = 1000)
    val content: String,
    @Schema(
        description = "책 정보 링크.",
        example =
            "https://search.kyobobook.co.kr/search?" +
                "keyword=%25EC%259D%25B4%25EB%25B0%25A9%25EC%259D%25B8&gbCode=TOT&target=total",
    )
    @get:NotBlank()
    @get:URL()
    val link: String,
    @Schema(description = "저자 정보.")
    val authorInfo: AuthorInfo? = null,
)

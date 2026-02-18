package com.example.powerclean.application.port.outbound.api.dto

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.annotation.JsonProperty

/**
 * 알라딘 API 응답 DTO
 */
@JsonIgnoreProperties(ignoreUnknown = true)
data class AladinSearchResult(
    val version: String? = null,
    val title: String? = null,
    val link: String? = null,
    val totalResults: Int = 0,
    val startIndex: Int = 0,
    val itemsPerPage: Int = 0,
    @JsonProperty("item")
    val items: List<AladinBookItem> = emptyList(),
)

@JsonIgnoreProperties(ignoreUnknown = true)
data class AladinBookItem(
    val title: String = "",
    val link: String = "",
    val author: String = "",
    val pubDate: String = "",           // yyyy-MM-dd
    val description: String = "",
    val isbn: String = "",              // ISBN-10
    val isbn13: String = "",            // ISBN-13
    val priceSales: Int = 0,            // 판매가
    val priceStandard: Int = 0,         // 정가
    val publisher: String = "",
    val cover: String = "",             // 표지 이미지 URL
    val categoryId: Int = 0,
    val categoryName: String = "",
    val customerReviewRank: Int = 0,    // 리뷰 평점 (0-10)
    val bestRank: Int? = null,          // 베스트셀러 순위
)

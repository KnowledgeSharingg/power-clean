package com.example.powerclean.application.port.outbound.api

import com.example.powerclean.application.port.outbound.api.dto.AladinBookItem
import com.example.powerclean.application.port.outbound.api.dto.AladinSearchResult

/**
 * 알라딘 Open API 클라이언트 포트.
 */
interface AladinApiClient {
    /** 키워드로 도서 검색 */
    fun searchBooks(
        query: String,
        maxResults: Int = 20,
        start: Int = 1,
    ): AladinSearchResult

    /** 베스트셀러 목록 조회 */
    fun getBestSellers(
        categoryId: Int = 0,
        maxResults: Int = 50,
    ): AladinSearchResult

    /** 신간 목록 조회 */
    fun getNewBooks(
        categoryId: Int = 0,
        maxResults: Int = 50,
    ): AladinSearchResult

    /** 주목할만한 신간 조회 */
    fun getNewSpecialBooks(
        categoryId: Int = 0,
        maxResults: Int = 50,
    ): AladinSearchResult

    /** ISBN으로 도서 상세 조회 */
    fun getBookDetail(isbn13: String): AladinBookItem?
}

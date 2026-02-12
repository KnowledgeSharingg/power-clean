package com.example.powerclean.domain.model

import com.example.powerclean.application.port.outbound.api.dto.AladinBookItem
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Index
import jakarta.persistence.Table

/**
 * 알라딘 API에서 수집한 도서 원본 데이터.
 * 기존 Book 엔티티(Post 연결용)와 분리하여 독립적으로 관리.
 */
@Entity
@Table(
    name = "book_data",
    indexes = [
        Index(name = "idx_book_data_isbn13", columnList = "isbn13", unique = true),
        Index(name = "idx_book_data_category", columnList = "categoryId"),
    ],
)
class BookData(
    @Column(nullable = false)
    var title: String,

    @Column(nullable = false)
    var author: String,

    @Column(length = 5000)
    var description: String = "",

    @Column(nullable = false, unique = true)
    var isbn13: String,

    var isbn10: String = "",

    @Column(nullable = false)
    var publisher: String = "",

    var pubDate: String = "",

    var priceSales: Int = 0,

    var priceStandard: Int = 0,

    @Column(length = 1000)
    var coverImageUrl: String = "",

    @Column(length = 2000)
    var link: String = "",

    var categoryId: Int = 0,

    var categoryName: String = "",

    var customerReviewRank: Int = 0,

    var bestRank: Int? = null,

    /** 수집 출처: BESTSELLER, NEW, NEW_SPECIAL, SEARCH */
    var source: String = "",
) : BaseEntity() {

    companion object {
        fun fromAladin(item: AladinBookItem, source: String): BookData =
            BookData(
                title = item.title,
                author = item.author,
                description = item.description,
                isbn13 = item.isbn13,
                isbn10 = item.isbn,
                publisher = item.publisher,
                pubDate = item.pubDate,
                priceSales = item.priceSales,
                priceStandard = item.priceStandard,
                coverImageUrl = item.cover,
                link = item.link,
                categoryId = item.categoryId,
                categoryName = item.categoryName,
                customerReviewRank = item.customerReviewRank,
                bestRank = item.bestRank,
                source = source,
            )
    }
}

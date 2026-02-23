package com.example.powerclean.domain.model

import com.example.powerclean.application.port.outbound.api.dto.AladinBookItem
import com.example.powerclean.presentation.dto.CreateBookReqDto
import com.example.powerclean.utils.DEFAULT_BOOK_COVER_IMAGE_URL
import com.fasterxml.jackson.annotation.JsonIgnore
import jakarta.persistence.Column
import jakarta.persistence.ConstraintMode
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.ForeignKey
import jakarta.persistence.Index
import jakarta.persistence.JoinColumn
import jakarta.persistence.OneToOne
import jakarta.persistence.Table

@Entity
@Table(
    name = "book",
    indexes = [
        Index(name = "idx_book_isbn13", columnList = "isbn13", unique = true),
        Index(name = "idx_book_category", columnList = "categoryId"),
    ],
)
class Book(
    @Column(nullable = false)
    var title: String,
    @Column(length = 10000)
    var content: String = "",
    var link: String = "",
    var coverImageUrl: String = DEFAULT_BOOK_COVER_IMAGE_URL,
    // Replace embedded AuthorInfo with simple string
    var author: String = "",
    // Post relationship - NOW NULLABLE (collected books won't have posts)
    @JsonIgnore
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", foreignKey = ForeignKey(ConstraintMode.NO_CONSTRAINT))
    var post: Post? = null,
    // --- Fields from BookData ---
    @Column(length = 5000)
    var description: String = "",
    @Column(unique = true)
    var isbn13: String = "",
    var isbn10: String = "",
    var publisher: String = "",
    var pubDate: String = "",
    var priceSales: Int = 0,
    var priceStandard: Int = 0,
    var categoryId: Int = 0,
    var categoryName: String = "",
    var customerReviewRank: Int = 0,
    var bestRank: Int? = null,
    /** 수집 출처: BESTSELLER, NEW, NEW_SPECIAL, SEARCH, MANUAL */
    var source: String = "",
) : BaseEntity() {
    companion object {
        fun from(
            requestDto: CreateBookReqDto,
            post: Post,
        ): Book =
            Book(
                title = requestDto.title,
                content = requestDto.content,
                link = requestDto.link,
                coverImageUrl =
                    requestDto.coverImageUrl.takeIf { it.isNotBlank() }
                        ?: DEFAULT_BOOK_COVER_IMAGE_URL,
                author = requestDto.author,
                post = post,
                source = "MANUAL",
            )

        fun fromAladin(
            item: AladinBookItem,
            source: String,
        ): Book =
            Book(
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

    fun updateInfo(
        title: String,
        content: String,
        link: String,
    ): Book =
        this.apply {
            this.title = title
            this.content = content
            this.link = link
        }
}

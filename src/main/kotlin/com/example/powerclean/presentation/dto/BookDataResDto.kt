package com.example.powerclean.presentation.dto

import com.example.powerclean.domain.model.Book
import java.time.LocalDateTime
import java.util.UUID

data class BookDataResDto(
    val id: UUID,
    val title: String,
    val author: String,
    val description: String,
    val isbn13: String,
    val isbn10: String,
    val publisher: String,
    val pubDate: String,
    val priceSales: Int,
    val priceStandard: Int,
    val coverImageUrl: String,
    val link: String,
    val categoryId: Int,
    val categoryName: String,
    val customerReviewRank: Int,
    val bestRank: Int?,
    val source: String,
    val hasPost: Boolean,
    val postId: UUID?,
    val createdAt: LocalDateTime,
) {
    companion object {
        fun from(book: Book): BookDataResDto =
            BookDataResDto(
                id = book.id,
                title = book.title,
                author = book.author,
                description = book.description,
                isbn13 = book.isbn13,
                isbn10 = book.isbn10,
                publisher = book.publisher,
                pubDate = book.pubDate,
                priceSales = book.priceSales,
                priceStandard = book.priceStandard,
                coverImageUrl = book.coverImageUrl,
                link = book.link,
                categoryId = book.categoryId,
                categoryName = book.categoryName,
                customerReviewRank = book.customerReviewRank,
                bestRank = book.bestRank,
                source = book.source,
                hasPost = book.post != null,
                postId = book.post?.id,
                createdAt = book.createdAt,
            )
    }
}

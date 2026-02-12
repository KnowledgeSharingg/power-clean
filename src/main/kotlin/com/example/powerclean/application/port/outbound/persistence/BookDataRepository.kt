package com.example.powerclean.application.port.outbound.persistence

import com.example.powerclean.domain.model.BookData
import java.util.UUID

interface BookDataRepository {
    fun save(bookData: BookData): BookData
    fun existsByIsbn13(isbn13: String): Boolean
    fun findByIsbn13(isbn13: String): BookData?
    fun findById(id: UUID): BookData?
    fun findByCategoryId(categoryId: Int): List<BookData>
    fun findByTitleContaining(keyword: String): List<BookData>
    fun findByAuthorContaining(keyword: String): List<BookData>
    fun findAll(): List<BookData>
    fun count(): Long
}

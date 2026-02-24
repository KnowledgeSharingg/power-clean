package com.example.powerclean.application.port.outbound.persistence

import com.example.powerclean.domain.model.Book

public interface BookRepository {
    fun save(book: Book): Book

    fun findByTitle(title: String): Book?

    fun existsByIsbn13(isbn13: String): Boolean

    fun findByIsbn13(isbn13: String): Book?

    fun findByCategoryId(categoryId: Int): List<Book>

    fun findByTitleContaining(keyword: String): List<Book>

    fun findByAuthorContaining(keyword: String): List<Book>

    fun findAll(): List<Book>

    fun findByPostIsNull(): List<Book>

    fun count(): Long
}

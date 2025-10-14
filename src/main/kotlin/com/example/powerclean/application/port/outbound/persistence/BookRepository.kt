package com.example.powerclean.application.port.outbound.persistence

import com.example.powerclean.domain.model.Book

public interface BookRepository {
    fun save(book: Book): Book

    fun findByTitle(title: String): Book?
}

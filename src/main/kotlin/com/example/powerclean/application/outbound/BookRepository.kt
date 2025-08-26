package com.example.powerclean.application.outbound

import com.example.powerclean.domain.model.Book

public interface BookRepository {
    fun save(book: Book): Book
}

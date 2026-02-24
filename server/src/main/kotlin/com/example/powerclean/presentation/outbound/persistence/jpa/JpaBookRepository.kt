package com.example.powerclean.presentation.outbound.persistence.jpa

import com.example.powerclean.application.port.outbound.persistence.BookRepository
import com.example.powerclean.domain.model.Book
import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

public interface JpaBookRepository : JpaRepository<Book, UUID>, BookRepository {
    override fun findByTitleContaining(keyword: String): List<Book>

    override fun findByAuthorContaining(keyword: String): List<Book>
}

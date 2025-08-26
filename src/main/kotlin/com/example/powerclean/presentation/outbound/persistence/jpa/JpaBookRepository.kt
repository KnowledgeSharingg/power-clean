package com.example.powerclean.presentation.outbound.persistence.jpa

import com.example.powerclean.application.outbound.BookRepository
import com.example.powerclean.domain.model.Book
import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

public interface JpaBookRepository : JpaRepository<Book, UUID>, BookRepository

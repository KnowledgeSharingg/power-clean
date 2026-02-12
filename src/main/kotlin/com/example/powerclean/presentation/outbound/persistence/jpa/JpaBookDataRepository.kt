package com.example.powerclean.presentation.outbound.persistence.jpa

import com.example.powerclean.application.port.outbound.persistence.BookDataRepository
import com.example.powerclean.domain.model.BookData
import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface JpaBookDataRepository : JpaRepository<BookData, UUID>, BookDataRepository {
    override fun findByTitleContaining(keyword: String): List<BookData>
    override fun findByAuthorContaining(keyword: String): List<BookData>
}

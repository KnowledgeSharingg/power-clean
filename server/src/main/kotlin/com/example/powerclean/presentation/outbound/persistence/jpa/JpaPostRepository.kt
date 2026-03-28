package com.example.powerclean.presentation.outbound.persistence.jpa

import com.example.powerclean.application.port.outbound.persistence.PostRepository
import com.example.powerclean.domain.model.Post
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import java.util.Optional
import java.util.UUID

public interface JpaPostRepository : JpaRepository<Post, UUID>, PostRepository {
    @Query("SELECT p FROM Post p JOIN FETCH p.book WHERE p.id = :id")
    override fun findByIdWithBook(id: UUID): Optional<Post>

    @Query("SELECT p FROM Post p LEFT JOIN FETCH p.book")
    override fun findAllWithBook(): List<Post>

    @Query(
        "SELECT p FROM Post p LEFT JOIN FETCH p.book b " +
            "WHERE LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(p.content) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%'))",
    )
    override fun searchByKeyword(keyword: String): List<Post>
}

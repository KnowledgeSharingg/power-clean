package com.example.powerclean.presentation.outbound.persistence.jpa

import com.example.powerclean.application.outbound.PostRepository
import com.example.powerclean.domain.model.Post
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import java.util.Optional
import java.util.UUID

public interface JpaPostRepository : JpaRepository<Post, UUID>, PostRepository {
    @Query("SELECT p FROM Post p JOIN FETCH p.book WHERE p.id = :id")
    override fun findByIdWithBook(id: UUID): Optional<Post>
}

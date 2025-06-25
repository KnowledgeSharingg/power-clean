package com.example.powerclean.domain.repository.orm.jpa

import com.example.powerclean.domain.model.Post
import com.example.powerclean.domain.repository.PostRepository
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import java.util.Optional
import java.util.UUID

public interface JpaPostRepository : JpaRepository<Post, UUID>, PostRepository {
    @Query("SELECT p FROM Post p JOIN FETCH p.book WHERE p.id = :id")
    override fun findByIdWithBook(id: UUID): Optional<Post>
}

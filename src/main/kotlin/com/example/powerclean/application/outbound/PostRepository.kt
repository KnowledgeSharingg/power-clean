package com.example.powerclean.application.outbound

import com.example.powerclean.domain.model.Post
import java.util.Optional
import java.util.UUID

public interface PostRepository {
    fun save(post: Post): Post

    fun findById(id: UUID): Optional<Post>

    fun findByIdWithBook(id: UUID): Optional<Post>

    fun findAll(): List<Post>

    fun deleteById(id: UUID)
}

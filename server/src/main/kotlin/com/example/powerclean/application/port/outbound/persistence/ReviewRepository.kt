package com.example.powerclean.application.port.outbound.persistence

import com.example.powerclean.domain.model.Review
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import java.util.Optional
import java.util.UUID

public interface ReviewRepository {
    fun save(review: Review): Review

    fun findById(id: UUID): Optional<Review>

    fun findAll(pageable: Pageable): Page<Review>

    fun findAllByPostId(
        postId: UUID,
        pageable: Pageable,
    ): Page<Review>

    fun deleteById(id: UUID): Unit

    fun findAverageRatingByPostId(postId: UUID): Double?
}

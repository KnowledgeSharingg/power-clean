package com.example.powerclean.presentation.outbound.persistence.jpa

import com.example.powerclean.application.port.outbound.persistence.ReviewRepository
import com.example.powerclean.domain.model.Review
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import java.util.UUID

public interface JpaReviewRepository : JpaRepository<Review, UUID>, ReviewRepository {
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.postId = :postId")
    override fun findAverageRatingByPostId(postId: UUID): Double?
}

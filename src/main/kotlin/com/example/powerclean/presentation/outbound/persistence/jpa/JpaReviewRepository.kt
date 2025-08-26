package com.example.powerclean.presentation.outbound.persistence.jpa

import com.example.powerclean.application.outbound.ReviewRepository
import com.example.powerclean.domain.model.Review
import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

public interface JpaReviewRepository : JpaRepository<Review, UUID>, ReviewRepository

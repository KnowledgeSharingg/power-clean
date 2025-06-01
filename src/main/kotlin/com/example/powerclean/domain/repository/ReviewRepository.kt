package com.example.powerclean.domain.repository

import org.springframework.data.domain.Pageable
import org.springframework.data.domain.Page
import com.example.powerclean.domain.model.Review
import java.util.UUID
import java.util.Optional

public interface ReviewRepository {
    fun save(review: Review): Review

    fun findById(id: UUID): Optional<Review>

    fun findAll(pageable: Pageable): Page<Review>

    fun deleteById(id: UUID): Unit

}

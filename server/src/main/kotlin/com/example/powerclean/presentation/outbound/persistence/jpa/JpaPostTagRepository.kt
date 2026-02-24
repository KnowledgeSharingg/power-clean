package com.example.powerclean.presentation.outbound.persistence.jpa

import com.example.powerclean.application.port.outbound.persistence.PostTagRepository
import com.example.powerclean.domain.model.PostTag
import jakarta.transaction.Transactional
import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

public interface JpaPostTagRepository : JpaRepository<PostTag, UUID>, PostTagRepository {
    override fun findAllByPostId(postId: UUID): List<PostTag>

    override fun findAllByTagId(tagId: UUID): List<PostTag>

    @Transactional
    override fun deleteAllByPostId(postId: UUID)
}

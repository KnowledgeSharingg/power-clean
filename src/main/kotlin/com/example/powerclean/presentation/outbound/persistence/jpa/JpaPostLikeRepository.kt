package com.example.powerclean.presentation.outbound.persistence.jpa

import com.example.powerclean.application.port.outbound.persistence.PostLikeRepository
import com.example.powerclean.domain.model.PostLike
import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface JpaPostLikeRepository : JpaRepository<PostLike, UUID>, PostLikeRepository {
    override fun existsByPostIdAndAccountId(
        postId: UUID,
        accountId: UUID,
    ): Boolean

    override fun deleteByPostIdAndAccountId(
        postId: UUID,
        accountId: UUID,
    )

    override fun countByPostId(postId: UUID): Long

    override fun findAllByAccountId(accountId: UUID): List<PostLike>
}

package com.example.powerclean.presentation.outbound.persistence.jpa

import com.example.powerclean.application.port.outbound.persistence.PostBookmarkRepository
import com.example.powerclean.domain.model.PostBookmark
import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface JpaPostBookmarkRepository : JpaRepository<PostBookmark, UUID>, PostBookmarkRepository {
    override fun existsByPostIdAndAccountId(
        postId: UUID,
        accountId: UUID,
    ): Boolean

    override fun deleteByPostIdAndAccountId(
        postId: UUID,
        accountId: UUID,
    )

    override fun findAllByAccountId(accountId: UUID): List<PostBookmark>
}

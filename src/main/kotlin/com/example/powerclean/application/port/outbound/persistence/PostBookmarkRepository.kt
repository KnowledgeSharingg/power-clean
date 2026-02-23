package com.example.powerclean.application.port.outbound.persistence

import com.example.powerclean.domain.model.PostBookmark
import java.util.UUID

interface PostBookmarkRepository {
    fun save(postBookmark: PostBookmark): PostBookmark

    fun existsByPostIdAndAccountId(
        postId: UUID,
        accountId: UUID,
    ): Boolean

    fun deleteByPostIdAndAccountId(
        postId: UUID,
        accountId: UUID,
    )

    fun findAllByAccountId(accountId: UUID): List<PostBookmark>

    fun countByPostId(postId: UUID): Int

    fun findAll(): List<PostBookmark>
}

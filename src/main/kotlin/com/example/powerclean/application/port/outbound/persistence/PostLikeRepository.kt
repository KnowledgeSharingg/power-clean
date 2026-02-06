package com.example.powerclean.application.port.outbound.persistence

import com.example.powerclean.domain.model.PostLike
import java.util.UUID

interface PostLikeRepository {
    fun save(postLike: PostLike): PostLike

    fun existsByPostIdAndAccountId(
        postId: UUID,
        accountId: UUID,
    ): Boolean

    fun deleteByPostIdAndAccountId(
        postId: UUID,
        accountId: UUID,
    )

    fun countByPostId(postId: UUID): Int

    fun findAllByAccountId(accountId: UUID): List<PostLike>
}

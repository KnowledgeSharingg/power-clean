package com.example.powerclean.application.service

import com.example.powerclean.application.port.outbound.persistence.PostLikeRepository
import com.example.powerclean.common.exception.CustomConflictException
import com.example.powerclean.common.exception.CustomNotFoundException
import com.example.powerclean.domain.model.PostLike
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
@Transactional
class PostLikeService(
    private val postLikeRepository: PostLikeRepository,
) {
    fun addLike(
        postId: UUID,
        accountId: UUID,
    ): String {
        if (postLikeRepository.existsByPostIdAndAccountId(postId, accountId)) {
            throw CustomConflictException("이미 좋아요했습니다.")
        }
        postLikeRepository.save(PostLike(postId = postId, accountId = accountId))
        return "ok"
    }

    fun removeLike(
        postId: UUID,
        accountId: UUID,
    ): String {
        if (!postLikeRepository.existsByPostIdAndAccountId(postId, accountId)) {
            throw CustomNotFoundException("좋아요가 되어 있지 않습니다.")
        }
        postLikeRepository.deleteByPostIdAndAccountId(postId, accountId)
        return "ok"
    }

    fun countLikes(postId: UUID): Int = postLikeRepository.countByPostId(postId)

    fun existsByPostIdAndAccountId(
        postId: UUID,
        accountId: UUID,
    ): Boolean = postLikeRepository.existsByPostIdAndAccountId(postId, accountId)
}

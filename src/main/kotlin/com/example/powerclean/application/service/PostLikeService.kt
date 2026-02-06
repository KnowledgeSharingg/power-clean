package com.example.powerclean.application.service

import com.example.powerclean.application.port.outbound.persistence.PostBookmarkRepository
import com.example.powerclean.application.port.outbound.persistence.PostLikeRepository
import com.example.powerclean.application.port.outbound.persistence.PostRepository
import com.example.powerclean.common.exception.CustomConflictException
import com.example.powerclean.common.exception.CustomNotFoundException
import com.example.powerclean.domain.model.PostLike
import com.example.powerclean.presentation.dto.GetBookDetailResDto
import com.example.powerclean.presentation.dto.GetPostDetailResDto
import com.example.powerclean.presentation.dto.GetPostListResDto
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
@Transactional
class PostLikeService(
    private val postLikeRepository: PostLikeRepository,
    private val postRepository: PostRepository,
    private val postBookmarkRepository: PostBookmarkRepository,
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

    fun findLikesByAccount(accountId: UUID): GetPostListResDto {
        val likes = postLikeRepository.findAllByAccountId(accountId)
        val posts =
            likes.mapNotNull { like ->
                postRepository.findById(like.postId).orElse(null)
            }
        return GetPostListResDto(
            postList =
                posts.map { p ->
                    GetPostDetailResDto(
                        id = p.id,
                        title = p.title,
                        content = p.content,
                        likeCount = countLikes(p.id).toInt(),
                        createdAt = p.createdAt.toString(),
                        updatedAt = p.updatedAt.toString(),
                        bookInfo =
                            GetBookDetailResDto(
                                id = p.book?.id,
                                title = p.book?.title,
                                content = p.book?.content,
                                link = p.book?.link,
                                coverImageUrl = p.book?.coverImageUrl,
                                authorInfo = p.book?.authorInfo,
                            ),
                        likedByMe = true,
                        bookmarkedByMe = postBookmarkRepository.existsByPostIdAndAccountId(p.id, accountId),
                    )
                },
        )
    }

    fun existsByPostIdAndAccountId(
        postId: UUID,
        accountId: UUID,
    ): Boolean = postLikeRepository.existsByPostIdAndAccountId(postId, accountId)
}

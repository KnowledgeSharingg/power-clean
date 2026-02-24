package com.example.powerclean.application.service

import com.example.powerclean.application.port.outbound.persistence.PostBookmarkRepository
import com.example.powerclean.application.port.outbound.persistence.PostRepository
import com.example.powerclean.common.exception.CustomConflictException
import com.example.powerclean.common.exception.CustomNotFoundException
import com.example.powerclean.domain.model.PostBookmark
import com.example.powerclean.presentation.dto.GetBookDetailResDto
import com.example.powerclean.presentation.dto.GetPostDetailResDto
import com.example.powerclean.presentation.dto.GetPostListResDto
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
@Transactional
class PostBookmarkService(
    private val postBookmarkRepository: PostBookmarkRepository,
    private val postRepository: PostRepository,
    private val postLikeService: PostLikeService,
) {
    fun addBookmark(
        postId: UUID,
        accountId: UUID,
    ): String {
        if (postBookmarkRepository.existsByPostIdAndAccountId(postId, accountId)) {
            throw CustomConflictException("이미 북마크했습니다.")
        }
        postBookmarkRepository.save(PostBookmark(postId = postId, accountId = accountId))
        return "ok"
    }

    fun removeBookmark(
        postId: UUID,
        accountId: UUID,
    ): String {
        if (!postBookmarkRepository.existsByPostIdAndAccountId(postId, accountId)) {
            throw CustomNotFoundException("북마크가 되어 있지 않습니다.")
        }
        postBookmarkRepository.deleteByPostIdAndAccountId(postId, accountId)
        return "ok"
    }

    fun findBookmarksByAccount(accountId: UUID): GetPostListResDto {
        val bookmarks = postBookmarkRepository.findAllByAccountId(accountId)
        val posts =
            bookmarks.mapNotNull { bookmark ->
                postRepository.findById(bookmark.postId).orElse(null)
            }
        return GetPostListResDto(
            postList =
                posts.map { p ->
                    GetPostDetailResDto(
                        id = p.id,
                        title = p.title,
                        content = p.content,
                        likeCount = postLikeService.countLikes(p.id).toInt(),
                        createdAt = p.createdAt.toString(),
                        updatedAt = p.updatedAt.toString(),
                        bookInfo =
                            GetBookDetailResDto(
                                id = p.book?.id,
                                title = p.book?.title,
                                content = p.book?.content,
                                link = p.book?.link,
                                coverImageUrl = p.book?.coverImageUrl,
                                author = p.book?.author,
                            ),
                        likedByMe = postLikeService.existsByPostIdAndAccountId(p.id, accountId),
                        bookmarkedByMe = true,
                    )
                },
        )
    }

    fun existsByPostIdAndAccountId(
        postId: UUID,
        accountId: UUID,
    ): Boolean = postBookmarkRepository.existsByPostIdAndAccountId(postId, accountId)

    fun countBookmarks(postId: UUID): Int = postBookmarkRepository.countByPostId(postId)
}

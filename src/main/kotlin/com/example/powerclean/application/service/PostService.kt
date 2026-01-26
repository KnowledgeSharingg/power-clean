package com.example.powerclean.application.service

import com.example.powerclean.application.port.outbound.ai.AiProvider
import com.example.powerclean.application.port.outbound.persistence.BookRepository
import com.example.powerclean.application.port.outbound.persistence.PostBookmarkRepository
import com.example.powerclean.application.port.outbound.persistence.PostLikeRepository
import com.example.powerclean.application.port.outbound.persistence.PostRepository
import com.example.powerclean.common.exception.CustomConflictException
import com.example.powerclean.common.exception.CustomNotFoundException
import com.example.powerclean.domain.model.Book
import com.example.powerclean.domain.model.Post
import com.example.powerclean.domain.model.PostBookmark
import com.example.powerclean.domain.model.PostLike
import com.example.powerclean.presentation.dto.CreatePostReqDto
import com.example.powerclean.presentation.dto.CreatePostResDto
import com.example.powerclean.presentation.dto.GetBookDetailResDto
import com.example.powerclean.presentation.dto.GetCreatedPostByAIResDto
import com.example.powerclean.presentation.dto.GetPostDetailResDto
import com.example.powerclean.presentation.dto.GetPostListResDto
import com.example.powerclean.presentation.dto.UpdatePostReqDto
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.webjars.NotFoundException
import java.util.UUID

// TODO: mapper class.

@Service
class PostService(
    private val postRepository: PostRepository,
    private val bookRepository: BookRepository,
    private val aiProvider: AiProvider,
    private val postLikeRepository: PostLikeRepository,
    private val postBookmarkRepository: PostBookmarkRepository,
) {
    private val logger = LoggerFactory.getLogger(PostService::class.java)

    fun createPost(requestDto: CreatePostReqDto): CreatePostResDto {
        bookRepository.findByTitle(
            requestDto.bookInfo.title,
        )?.let { throw CustomConflictException("Book already exists.") }

        val savedPost =
            postRepository.save(
                Post.from(requestDto),
            )

        val savedBook =
            bookRepository.save(
                Book.from(requestDto.bookInfo, savedPost),
            )

        return CreatePostResDto(
            id = savedPost.id,
            title = savedPost.title,
            content = savedPost.content,
            bookInfo =
                GetBookDetailResDto(
                    id = savedBook.id,
                    title = savedBook.title,
                    content = savedBook.content,
                    link = savedBook.link,
                    coverImageUrl = savedBook.coverImageUrl,
                    authorInfo = savedBook.authorInfo,
                ),
        )
    }

    fun getPostDetail(
        postId: UUID,
        accountId: UUID,
    ): GetPostDetailResDto {
        val foundPost = postRepository.findById(postId).orElse(null) ?: throw CustomNotFoundException("Post not found")
        return GetPostDetailResDto(
            id = foundPost.id,
            title = foundPost.title,
            content = foundPost.content,
            likeCount = postLikeRepository.countByPostId(foundPost.id).toInt(),
            createdAt = foundPost.createdAt.toString(),
            updatedAt = foundPost.updatedAt.toString(),
            bookInfo =
                GetBookDetailResDto(
                    id = foundPost.book?.id,
                    title = foundPost.book?.title,
                    content = foundPost.book?.content,
                    link = foundPost.book?.link,
                    coverImageUrl = foundPost.book?.coverImageUrl,
                    authorInfo = foundPost.book?.authorInfo,
                ),
            likedByMe = postLikeRepository.existsByPostIdAndAccountId(foundPost.id, accountId),
            bookmarkedByMe = postBookmarkRepository.existsByPostIdAndAccountId(foundPost.id, accountId),
        )
    }

    // TODO: Paging.
    fun getPostList(
        page: Int,
        size: Int,
    ): GetPostListResDto {
        val foundPosts: List<Post> = postRepository.findAll()
        return GetPostListResDto(
            postList =
                foundPosts.map {
                    GetPostDetailResDto(
                        id = it.id,
                        title = it.title,
                        content = it.content,
                        likeCount = postLikeRepository.countByPostId(it.id).toInt(),
                        createdAt = it.createdAt.toString(),
                        updatedAt = it.updatedAt.toString(),
                        bookInfo =
                            GetBookDetailResDto(
                                id = it.book?.id,
                                title = it.book?.title,
                                content = it.book?.content,
                                link = it.book?.link,
                                coverImageUrl = it.book?.coverImageUrl,
                                authorInfo = it.book?.authorInfo,
                            ),
                        likedByMe = false,
                        bookmarkedByMe = false,
                    )
                },
        )
    }

    fun updatePost(requestDto: UpdatePostReqDto): String {
        (
            postRepository.findByIdWithBook(requestDto.id).orElse(null)
                ?: throw NotFoundException("Post not found")
        )
            .apply {
                updateInfo(requestDto.title, requestDto.content)
                this.book?.updateInfo(
                    requestDto.bookInfo.title,
                    requestDto.bookInfo.content,
                    requestDto.bookInfo.link,
                )
            }
            .also {
                postRepository.save(it)
            }

        return "ok"
    }

    fun deletePost(postId: UUID): String {
        postRepository.deleteById(postId)
        return "ok"
    }

    fun getCreatedPostContentByAI(script: String): GetCreatedPostByAIResDto {
        val result = aiProvider.getBookInfo(script)
        return GetCreatedPostByAIResDto(
            title = result.postTitle,
            content = result.postContent,
            bookInfo =
                GetBookDetailResDto(
                    id = null,
                    title = result.bookTitle,
                    content = result.bookContent,
                    link = result.bookLink,
                    coverImageUrl = result.coverImageUrl,
                    authorInfo = result.authorInfo,
                ),
        )
    }

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

    fun countLikes(postId: UUID): Long = postLikeRepository.countByPostId(postId)

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
                        likeCount = postLikeRepository.countByPostId(p.id).toInt(),
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
                        likedByMe = postLikeRepository.existsByPostIdAndAccountId(p.id, accountId),
                        bookmarkedByMe = true,
                    )
                },
        )
    }
}

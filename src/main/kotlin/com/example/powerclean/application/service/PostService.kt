package com.example.powerclean.application.service

import com.example.powerclean.application.port.outbound.ai.AiProvider
import com.example.powerclean.application.port.outbound.persistence.BookRepository
import com.example.powerclean.application.port.outbound.persistence.PostRepository
import com.example.powerclean.common.exception.CustomConflictException
import com.example.powerclean.common.exception.CustomNotFoundException
import com.example.powerclean.domain.model.Book
import com.example.powerclean.domain.model.Post
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
    private val postLikeService: PostLikeService,
    private val postBookmarkService: PostBookmarkService,
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
        accountId: UUID?,
    ): GetPostDetailResDto {
        val foundPost = postRepository.findById(postId).orElse(null) ?: throw CustomNotFoundException("Post not found")
        return GetPostDetailResDto(
            id = foundPost.id,
            title = foundPost.title,
            content = foundPost.content,
            likeCount = postLikeService.countLikes(foundPost.id).toInt(),
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
            likedByMe =
                accountId?.let { postLikeService.existsByPostIdAndAccountId(foundPost.id, it) } ?: false,
            bookmarkedByMe =
                accountId?.let { postBookmarkService.existsByPostIdAndAccountId(foundPost.id, it) } ?: false,
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
                        likeCount = postLikeService.countLikes(it.id).toInt(),
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
}

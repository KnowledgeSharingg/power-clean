package com.example.powerclean.application.service

import com.example.powerclean.domain.model.Book
import com.example.powerclean.domain.model.Post
import com.example.powerclean.domain.repository.BookRepository
import com.example.powerclean.domain.repository.PostRepository
import com.example.powerclean.presentation.dto.CreatePostReqDto
import com.example.powerclean.presentation.dto.CreatePostResDto
import com.example.powerclean.presentation.dto.GetBookDetailResDto
import com.example.powerclean.presentation.dto.GetPostDetailResDto
import com.example.powerclean.presentation.dto.GetPostListResDto
import com.example.powerclean.presentation.dto.UpdatePostReqDto
import org.springframework.stereotype.Service
import org.webjars.NotFoundException
import java.util.UUID

// TODO: mapper class.

@Service
class PostService(private val postRepository: PostRepository, private val bookRepository: BookRepository) {
    fun createPost(requestDto: CreatePostReqDto): CreatePostResDto {
        val savedPost =
            postRepository.save(
                Post(
                    title = requestDto.title,
                    content = requestDto.content,
                    creatorAccountId = requestDto.creatorAccountId,
                    likeCount = 0,
                ),
            )

        val savedBook =
            bookRepository.save(
                Book(
                    title = requestDto.bookInfo.title,
                    content = requestDto.bookInfo.content,
                    link = requestDto.bookInfo.link,
                    authorInfo = requestDto.bookInfo.authorInfo,
                    post = savedPost,
                ),
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
                    authorInfo = savedBook.authorInfo,
                ),
        )
    }

    fun getPostDetail(postId: UUID): GetPostDetailResDto {
        val foundPost = postRepository.findById(postId).orElse(null) ?: throw NotFoundException("Post not found")
        return GetPostDetailResDto(
            id = foundPost.id,
            title = foundPost.title,
            content = foundPost.content,
            likeCount = foundPost.likeCount,
            createdAt = foundPost.createdAt.toString(),
            updatedAt = foundPost.updatedAt.toString(),
            bookInfo =
                GetBookDetailResDto(
                    id = foundPost.book?.id,
                    title = foundPost.book?.title,
                    content = foundPost.book?.content,
                    link = foundPost.book?.link,
                    authorInfo = foundPost.book?.authorInfo,
                ),
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
                        likeCount = it.likeCount,
                        createdAt = it.createdAt.toString(),
                        updatedAt = it.updatedAt.toString(),
                        bookInfo =
                            GetBookDetailResDto(
                                id = it.book?.id,
                                title = it.book?.title,
                                content = it.book?.content,
                                link = it.book?.link,
                                authorInfo = it.book?.authorInfo,
                            ),
                    )
                },
        )
    }

    fun updatePost(requestDto: UpdatePostReqDto): String {
        val foundPost = postRepository.findById(requestDto.id).orElse(null) ?: throw NotFoundException("Post not found")
        foundPost.title = requestDto.title
        foundPost.content = requestDto.content
        postRepository.save(foundPost)
        return "ok"
    }

    fun deletePost(postId: UUID): String {
        postRepository.deleteById(postId)
        return "ok"
    }
}

package com.example.powerclean.application.service

import com.example.powerclean.application.port.outbound.ai.AiProvider
import com.example.powerclean.application.port.outbound.persistence.BookRepository
import com.example.powerclean.application.port.outbound.persistence.PostBookmarkRepository
import com.example.powerclean.application.port.outbound.persistence.PostLikeRepository
import com.example.powerclean.application.port.outbound.persistence.PostRepository
import com.example.powerclean.application.port.outbound.persistence.PostTagRepository
import com.example.powerclean.application.port.outbound.persistence.TagRepository
import com.example.powerclean.common.exception.CustomConflictException
import com.example.powerclean.common.exception.CustomNotFoundException
import com.example.powerclean.domain.model.Book
import com.example.powerclean.domain.model.Post
import com.example.powerclean.domain.model.PostBookmark
import com.example.powerclean.domain.model.PostLike
import com.example.powerclean.domain.model.PostTag
import com.example.powerclean.domain.model.Tag
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
    private val postLikeRepository: PostLikeRepository,
    private val postBookmarkRepository: PostBookmarkRepository,
    private val tagRepository: TagRepository,
    private val postTagRepository: PostTagRepository,
    private val aiProvider: AiProvider,
    private val postLikeService: PostLikeService,
    private val postBookmarkService: PostBookmarkService,
) {
    private val logger = LoggerFactory.getLogger(PostService::class.java)

    private fun findOrCreateTags(tagNames: List<String>): List<Tag> {
        if (tagNames.isEmpty()) return emptyList()
        val existingTags = tagRepository.findAllByNameIn(tagNames)
        val existingTagNames = existingTags.map { it.name }.toSet()
        val newTags =
            tagNames.filter { it !in existingTagNames }.map { tagRepository.save(Tag(name = it)) }
        return existingTags + newTags
    }

    private fun syncPostTags(
        postId: java.util.UUID,
        tags: List<Tag>,
    ) {
        postTagRepository.deleteAllByPostId(postId)
        tags.forEach { tag ->
            postTagRepository.save(PostTag(postId = postId, tagId = tag.id))
        }
    }

    private fun getTagNamesForPost(postId: java.util.UUID): List<String> {
        val postTags = postTagRepository.findAllByPostId(postId)
        if (postTags.isEmpty()) return emptyList()
        return postTags.mapNotNull { postTag ->
            tagRepository.findById(postTag.tagId).orElse(null)?.name
        }
    }

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

        val tags = findOrCreateTags(requestDto.tags)
        syncPostTags(savedPost.id, tags)

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
        logger.debug("getPostDetail: postId={}, accountId={}", postId, accountId)
        val foundPost = postRepository.findById(postId).orElse(null) ?: throw CustomNotFoundException("Post not found")
        return GetPostDetailResDto(
            id = foundPost.id,
            title = foundPost.title,
            content = foundPost.content,
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
            likeCount = postLikeService.countLikes(foundPost.id).toInt(),
            bookmarkCount = postBookmarkService.countBookmarks(foundPost.id),
            tags = getTagNamesForPost(foundPost.id),
        )
    }

    // TODO: Paging.
    fun getPostList(
        page: Int,
        size: Int,
        accountId: UUID?,
        tag: String? = null,
    ): GetPostListResDto {
        val allPosts: List<Post> = postRepository.findAll()
        val foundPosts: List<Post> =
            if (tag != null) {
                val foundTag = tagRepository.findByName(tag)
                if (foundTag != null) {
                    val postTagList = postTagRepository.findAllByTagId(foundTag.id)
                    val postIds = postTagList.map { it.postId }.toSet()
                    allPosts.filter { it.id in postIds }
                } else {
                    emptyList()
                }
            } else {
                allPosts
            }
        val foundPostLikes: List<PostLike> =
            if (accountId !== null) {
                postLikeRepository.findAllByAccountId(
                    accountId,
                )
            } else {
                emptyList()
            }
        val foundPostBookmarks: List<PostBookmark> =
            if (accountId !== null) {
                postBookmarkRepository.findAllByAccountId(
                    accountId,
                )
            } else {
                emptyList()
            }
        val postIdAndIsLikedMap: Map<UUID, Boolean> = foundPostLikes.associate { it.postId to true }
        val postIdAndIsBookmarkedMap: Map<UUID, Boolean> = foundPostBookmarks.associate { it.postId to true }
        val postIdAndLikeCountMap: Map<UUID, Int> = foundPosts.associate { it.id to postLikeService.countLikes(it.id) }
        val postIdAndBookmarkCountMap: Map<UUID, Int> =
            foundPosts.associate {
                it.id to postBookmarkService.countBookmarks(it.id)
            }

        return GetPostListResDto(
            postList =
                foundPosts.map {
                    GetPostDetailResDto(
                        id = it.id,
                        title = it.title,
                        content = it.content,
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
                        likedByMe = postIdAndIsLikedMap[it.id] ?: false,
                        bookmarkedByMe = postIdAndIsBookmarkedMap[it.id] ?: false,
                        likeCount = postIdAndLikeCountMap[it.id] ?: 0,
                        bookmarkCount = postIdAndBookmarkCountMap[it.id] ?: 0,
                        tags = getTagNamesForPost(it.id),
                    )
                },
        )
    }

    fun updatePost(requestDto: UpdatePostReqDto): String {
        val post =
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

        val tags = findOrCreateTags(requestDto.tags)
        syncPostTags(post.id, tags)

        return "ok"
    }

    fun getAllTags(): List<String> = tagRepository.findAll().map { it.name }

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

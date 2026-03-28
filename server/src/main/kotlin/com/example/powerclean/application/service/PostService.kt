package com.example.powerclean.application.service

import com.example.powerclean.application.port.outbound.ai.AiProvider
import com.example.powerclean.application.port.outbound.persistence.BookRepository
import com.example.powerclean.application.port.outbound.persistence.PostBookmarkRepository
import com.example.powerclean.application.port.outbound.persistence.PostLikeRepository
import com.example.powerclean.application.port.outbound.persistence.PostRepository
import com.example.powerclean.application.port.outbound.persistence.PostTagRepository
import com.example.powerclean.application.port.outbound.persistence.ReviewRepository
import com.example.powerclean.application.port.outbound.persistence.TagRepository
import com.example.powerclean.common.exception.CustomConflictException
import com.example.powerclean.common.exception.CustomNotFoundException
import com.example.powerclean.domain.model.Book
import com.example.powerclean.domain.model.Post
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

@Service
class PostService(
    private val postRepository: PostRepository,
    private val bookRepository: BookRepository,
    private val postLikeRepository: PostLikeRepository,
    private val postBookmarkRepository: PostBookmarkRepository,
    private val tagRepository: TagRepository,
    private val postTagRepository: PostTagRepository,
    private val reviewRepository: ReviewRepository,
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
            tagNames.filter { it !in existingTagNames }
                .map { tagRepository.save(Tag(name = it)) }
        return existingTags + newTags
    }

    private fun syncPostTags(
        postId: UUID,
        tags: List<Tag>,
    ) {
        postTagRepository.deleteAllByPostId(postId)
        tags.forEach { tag ->
            postTagRepository.save(PostTag(postId = postId, tagId = tag.id))
        }
    }

    private fun getTagNamesForPost(postId: UUID): List<String> {
        val postTags = postTagRepository.findAllByPostId(postId)
        if (postTags.isEmpty()) return emptyList()
        return postTags.mapNotNull { postTag ->
            tagRepository.findById(postTag.tagId).orElse(null)?.name
        }
    }

    /**
     * 여러 Post의 태그를 한 번에 조회 (N+1 방지)
     */
    private fun getTagNamesForPosts(postIds: List<UUID>): Map<UUID, List<String>> {
        if (postIds.isEmpty()) return emptyMap()
        val allTags = tagRepository.findAll().associateBy { it.id }
        val allPostTags = postIds.flatMap { postTagRepository.findAllByPostId(it) }
        return allPostTags
            .groupBy { it.postId }
            .mapValues { (_, postTags) ->
                postTags.mapNotNull { allTags[it.tagId]?.name }
            }
    }

    fun createPost(requestDto: CreatePostReqDto): CreatePostResDto {
        bookRepository.findByTitle(
            requestDto.bookInfo.title,
        )?.let { throw CustomConflictException("Book already exists.") }

        val savedPost = postRepository.save(Post.from(requestDto))
        val savedBook = bookRepository.save(Book.from(requestDto.bookInfo, savedPost))
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
                    author = savedBook.author,
                ),
        )
    }

    fun getPostDetail(
        postId: UUID,
        accountId: UUID?,
    ): GetPostDetailResDto {
        val foundPost =
            postRepository.findByIdWithBook(postId).orElse(null)
                ?: throw CustomNotFoundException("Post not found")
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
                    author = foundPost.book?.author,
                ),
            likedByMe =
                accountId?.let {
                    postLikeService.existsByPostIdAndAccountId(foundPost.id, it)
                } ?: false,
            bookmarkedByMe =
                accountId?.let {
                    postBookmarkService.existsByPostIdAndAccountId(foundPost.id, it)
                } ?: false,
            likeCount = postLikeService.countLikes(foundPost.id).toInt(),
            bookmarkCount = postBookmarkService.countBookmarks(foundPost.id),
            tags = getTagNamesForPost(foundPost.id),
            averageRating = reviewRepository.findAverageRatingByPostId(foundPost.id),
            creatorAccountId = foundPost.creatorAccountId,
        )
    }

    fun getPostList(
        page: Int,
        size: Int,
        accountId: UUID?,
        tag: String? = null,
    ): GetPostListResDto {
        // 1. Book과 함께 한 번에 로드 (JOIN FETCH)
        val allPosts: List<Post> = postRepository.findAllWithBook()

        // 2. 태그 필터링
        val foundPosts: List<Post> =
            if (tag != null) {
                val foundTag = tagRepository.findByName(tag)
                if (foundTag != null) {
                    val postIds =
                        postTagRepository.findAllByTagId(foundTag.id)
                            .map { it.postId }.toSet()
                    allPosts.filter { it.id in postIds }
                } else {
                    emptyList()
                }
            } else {
                allPosts
            }

        val postIds = foundPosts.map { it.id }

        // 3. 좋아요/북마크 상태 배치 조회 (1쿼리씩)
        val likedPostIds: Set<UUID> =
            if (accountId != null) {
                postLikeRepository.findAllByAccountId(accountId)
                    .map { it.postId }.toSet()
            } else {
                emptySet()
            }
        val bookmarkedPostIds: Set<UUID> =
            if (accountId != null) {
                postBookmarkRepository.findAllByAccountId(accountId)
                    .map { it.postId }.toSet()
            } else {
                emptySet()
            }

        // 4. 좋아요/북마크 카운트 배치 조회 (1쿼리씩, groupBy)
        val likeCountMap: Map<UUID, Int> =
            postLikeRepository.findAll()
                .groupBy { it.postId }
                .mapValues { it.value.size }
        val bookmarkCountMap: Map<UUID, Int> =
            postBookmarkRepository.findAll()
                .groupBy { it.postId }
                .mapValues { it.value.size }

        // 5. 태그 배치 조회
        val tagMap = getTagNamesForPosts(postIds)

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
                                author = it.book?.author,
                            ),
                        likedByMe = it.id in likedPostIds,
                        bookmarkedByMe = it.id in bookmarkedPostIds,
                        likeCount = likeCountMap[it.id] ?: 0,
                        bookmarkCount = bookmarkCountMap[it.id] ?: 0,
                        tags = tagMap[it.id] ?: emptyList(),
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
                .also { postRepository.save(it) }

        val tags = findOrCreateTags(requestDto.tags)
        syncPostTags(post.id, tags)
        return "ok"
    }

    fun searchPosts(
        keyword: String,
        accountId: UUID?,
    ): GetPostListResDto {
        val foundPosts = postRepository.searchByKeyword(keyword)
        val postIds = foundPosts.map { it.id }

        val likedPostIds: Set<UUID> =
            if (accountId != null) {
                postLikeRepository.findAllByAccountId(accountId).map { it.postId }.toSet()
            } else {
                emptySet()
            }
        val bookmarkedPostIds: Set<UUID> =
            if (accountId != null) {
                postBookmarkRepository.findAllByAccountId(accountId).map { it.postId }.toSet()
            } else {
                emptySet()
            }
        val likeCountMap: Map<UUID, Int> =
            postLikeRepository.findAll().groupBy { it.postId }.mapValues { it.value.size }
        val bookmarkCountMap: Map<UUID, Int> =
            postBookmarkRepository.findAll().groupBy { it.postId }.mapValues { it.value.size }
        val tagMap = getTagNamesForPosts(postIds)

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
                                author = it.book?.author,
                            ),
                        likedByMe = it.id in likedPostIds,
                        bookmarkedByMe = it.id in bookmarkedPostIds,
                        likeCount = likeCountMap[it.id] ?: 0,
                        bookmarkCount = bookmarkCountMap[it.id] ?: 0,
                        tags = tagMap[it.id] ?: emptyList(),
                        creatorAccountId = it.creatorAccountId,
                    )
                },
        )
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
                    author = result.author,
                ),
        )
    }
}

import com.example.powerclean.application.port.outbound.ai.AiProvider
import com.example.powerclean.application.port.outbound.persistence.BookRepository
import com.example.powerclean.application.port.outbound.persistence.PostBookmarkRepository
import com.example.powerclean.application.port.outbound.persistence.PostLikeRepository
import com.example.powerclean.application.port.outbound.persistence.PostRepository
import com.example.powerclean.application.port.outbound.persistence.PostTagRepository
import com.example.powerclean.application.port.outbound.persistence.TagRepository
import com.example.powerclean.application.service.PostBookmarkService
import com.example.powerclean.application.service.PostLikeService
import com.example.powerclean.application.service.PostService
import com.example.powerclean.common.exception.CustomNotFoundException
import com.example.powerclean.domain.model.Book
import com.example.powerclean.domain.model.Post
import com.example.powerclean.presentation.dto.CreateBookReqDto
import com.example.powerclean.presentation.dto.CreatePostReqDto
import com.example.powerclean.presentation.dto.UpdateBookReqDto
import com.example.powerclean.presentation.dto.UpdatePostReqDto
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.Mockito.mock
import org.mockito.Mockito.`when`
import org.mockito.kotlin.any
import org.webjars.NotFoundException
import java.util.UUID

class PostServiceTest {
    private lateinit var postRepository: PostRepository
    private lateinit var bookRepository: BookRepository
    private lateinit var postLikeRepository: PostLikeRepository
    private lateinit var postBookmarkRepository: PostBookmarkRepository
    private lateinit var tagRepository: TagRepository
    private lateinit var postTagRepository: PostTagRepository
    private lateinit var aiProvider: AiProvider
    private lateinit var postLikeService: PostLikeService
    private lateinit var postBookmarkService: PostBookmarkService
    private lateinit var postService: PostService

    @BeforeEach
    fun setUp() {
        postRepository = mock(PostRepository::class.java)
        bookRepository = mock(BookRepository::class.java)
        postLikeRepository = mock(PostLikeRepository::class.java)
        postBookmarkRepository = mock(PostBookmarkRepository::class.java)
        tagRepository = mock(TagRepository::class.java)
        postTagRepository = mock(PostTagRepository::class.java)
        aiProvider = mock(AiProvider::class.java)
        postLikeService = mock(PostLikeService::class.java)
        postBookmarkService = mock(PostBookmarkService::class.java)
        postService =
            PostService(
                postRepository, bookRepository, postLikeRepository, postBookmarkRepository,
                tagRepository, postTagRepository, aiProvider, postLikeService, postBookmarkService,
            )
    }

    @Test
    fun `포스트_생성_시_포스트_정보와_책_정보_저자_정보가_모두_저장되어_반환된다`() {
        // Given.
        val requestDto =
            CreatePostReqDto(
                title = "Test Title",
                content = "Test Content",
                creatorAccountId = UUID.randomUUID(),
                bookInfo =
                    CreateBookReqDto(
                        title = "Test Book Title",
                        content = "Test Book Content",
                        link = "Test Book Link",
                        author = "Test Author",
                    ),
            )
        val savedPost =
            Post(
                title = requestDto.title,
                content = requestDto.content,
                creatorAccountId =
                    requestDto.creatorAccountId
                        ?: throw IllegalStateException("creatorAccountId must not be null."),
                likeCount = 0,
            )
        val savedBook =
            Book(
                title = requestDto.bookInfo.title,
                content = requestDto.bookInfo.content,
                link = requestDto.bookInfo.link,
                author = requestDto.bookInfo.author,
                post = savedPost,
            )
        `when`(postRepository.save(any<Post>())).thenReturn(savedPost)
        `when`(bookRepository.save(any())).thenReturn(savedBook)

        // When
        val result = postService.createPost(requestDto)

        // Then
        assertNotNull(result.id)
        assertEquals(requestDto.title, result.title)
        assertEquals(requestDto.content, result.content)
        assertNotNull(result.bookInfo)
        assertEquals(requestDto.bookInfo.title, result.bookInfo.title)
        assertEquals(requestDto.bookInfo.content, result.bookInfo.content)
        assertEquals(requestDto.bookInfo.link, result.bookInfo.link)
        assertEquals(requestDto.bookInfo.author, result.bookInfo.author)
    }

    @Test
    fun `포스트_상세_조회_시_책정보와_저자정보도_함께 조회된다`() {
        // Given
        val postId = UUID.randomUUID()
        val accountId = UUID.randomUUID()
        val foundPost =
            Post(
                title = "Test Title",
                content = "Test Content",
                creatorAccountId = UUID.randomUUID(),
                likeCount = 0,
            )
        val foundBook =
            Book(
                title = "Test Book Title",
                content = "Test Book Content",
                link = "Test Book Link",
                author = "Test Author",
                post = foundPost,
            )
        foundPost.book = foundBook
        `when`(postRepository.findById(postId)).thenReturn(java.util.Optional.of(foundPost))
        `when`(postLikeService.countLikes(foundPost.id)).thenReturn(0)
        `when`(postLikeService.existsByPostIdAndAccountId(foundPost.id, accountId)).thenReturn(false)
        `when`(postBookmarkService.existsByPostIdAndAccountId(foundPost.id, accountId)).thenReturn(false)

        // When
        val result = postService.getPostDetail(postId, accountId)

        // Then
        assertEquals(foundPost.id, result.id)
        assertEquals(foundPost.title, result.title)
        assertEquals(foundPost.content, result.content)
        assertEquals(0, result.likeCount)
        assertNotNull(result.createdAt)
        assertNotNull(result.updatedAt)
        assertNotNull(result.bookInfo)
        assertEquals(foundBook.id, result.bookInfo.id)
        assertEquals(foundBook.title, result.bookInfo.title)
        assertEquals(foundBook.content, result.bookInfo.content)
        assertEquals(foundBook.link, result.bookInfo.link)
        assertEquals(foundBook.author, result.bookInfo.author)
    }

    @Test
    fun `포스트_상세_조회시_조회된_포스트가_없는경우_NotFoundException을_발생시킨다`() {
        // Given
        val postId = UUID.randomUUID()
        val accountId = UUID.randomUUID()
        `when`(postRepository.findById(postId)).thenReturn(java.util.Optional.empty())

        // When
        val exception =
            assertThrows(CustomNotFoundException::class.java) {
                postService.getPostDetail(postId, accountId)
            }

        // Then
        assertEquals("Post not found", exception.message)
    }

    @Test
    fun `포스트_리스트_조회시_각_포스트의_책정보_저자정보도_반환된다`() {
        // Given
        val foundPosts =
            listOf(
                Post(
                    title = "Test Title 1",
                    content = "Test Content 1",
                    creatorAccountId = UUID.randomUUID(),
                    likeCount = 0,
                ),
                Post(
                    title = "Test Title 2",
                    content = "Test Content 2",
                    creatorAccountId = UUID.randomUUID(),
                    likeCount = 0,
                ),
            )
        `when`(postRepository.findAll()).thenReturn(foundPosts)
        `when`(postLikeService.countLikes(any())).thenReturn(0)

        // When
        val result = postService.getPostList(page = 1, size = 10, accountId = null)

        // Then
        assertEquals(foundPosts.size, result.postList.size)
        for (i in foundPosts.indices) {
            val foundPost = foundPosts[i]
            val resultPost = result.postList[i]
            assertEquals(foundPost.id, resultPost.id)
            assertEquals(foundPost.title, resultPost.title)
            assertEquals(foundPost.content, resultPost.content)
            assertEquals(0, resultPost.likeCount)
            assertNotNull(resultPost.createdAt)
            assertNotNull(resultPost.updatedAt)
            assertNotNull(resultPost.bookInfo)
            assertEquals(foundPost.book?.id, resultPost.bookInfo.id)
            assertEquals(foundPost.book?.title, resultPost.bookInfo.title)
            assertEquals(foundPost.book?.content, resultPost.bookInfo.content)
            assertEquals(foundPost.book?.link, resultPost.bookInfo.link)
            assertEquals(foundPost.book?.author, resultPost.bookInfo.author)
        }
    }

    @Test
    fun `포스트업데이트시_책정보와_저자정보도_한번에_업데이트가능하다`() {
        // Given
        val requestDto =
            UpdatePostReqDto(
                id = UUID.randomUUID(),
                title = "Updated Title",
                content = "Updated Content",
                bookInfo =
                    UpdateBookReqDto(
                        "Updated Book Title",
                        "Updated Book Content",
                        "Updated Book Link",
                    ),
            )
        val updatedPost =
            Post(
                title = requestDto.title,
                content = requestDto.content,
                creatorAccountId = UUID.randomUUID(),
                likeCount = 0,
            )
        val foundPost =
            Post(
                title = "Test Title",
                content = "Test Content",
                creatorAccountId = UUID.randomUUID(),
                likeCount = 0,
            )
        `when`(postRepository.findByIdWithBook(requestDto.id)).thenReturn(java.util.Optional.of(foundPost))
        `when`(postRepository.save(foundPost)).thenReturn(updatedPost)

        // When
        val result = postService.updatePost(requestDto)

        // Then
        assertEquals("ok", result)
        assertEquals(requestDto.title, foundPost.title)
        assertEquals(requestDto.content, foundPost.content)
    }

    @Test
    fun `업데이트하고자하는 포스트가 조회되지 않는 경우 NotfoundException을 발생시킨다`() {
        // Given
        val requestDto =
            UpdatePostReqDto(
                id = UUID.randomUUID(),
                title = "Updated Title",
                content = "Updated Content",
                bookInfo =
                    UpdateBookReqDto(
                        "Updated Book Title",
                        "Updated Book Content",
                        "Updated Book Link",
                    ),
            )
        `when`(postRepository.findByIdWithBook(requestDto.id)).thenReturn(java.util.Optional.empty())

        // When
        val exception =
            assertThrows(NotFoundException::class.java) {
                postService.updatePost(requestDto)
            }

        // Then
        assertEquals("Post not found", exception.message)
    }

    @Test
    fun `포스트 삭제가 가능하다`() {
        // Given
        val postId = UUID.randomUUID()

        // When
        val result = postService.deletePost(postId)

        // Then
        assertEquals("ok", result)
    }
}

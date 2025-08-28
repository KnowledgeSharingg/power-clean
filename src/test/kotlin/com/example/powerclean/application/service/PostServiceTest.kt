import com.example.powerclean.application.outbound.BookRepository
import com.example.powerclean.application.outbound.PostRepository
import com.example.powerclean.application.service.PostService
import com.example.powerclean.domain.model.Book
import com.example.powerclean.domain.model.Post
import com.example.powerclean.domain.valueobject.AuthorInfo
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
    private lateinit var postService: PostService

    @BeforeEach
    fun setUp() {
        postRepository = mock(PostRepository::class.java)
        bookRepository = mock(BookRepository::class.java)
        postService = PostService(postRepository, bookRepository)
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
                        authorInfo =
                            AuthorInfo(
                                name = "Test Author",
                                dateOfBirth = "2000-01-01",
                                phoneNumber = "010-3333-4444",
                                gender = "male",
                                history = "hihihi",
                            ),
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
                authorInfo = requestDto.bookInfo.authorInfo,
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
        assertEquals(requestDto.bookInfo.authorInfo, result.bookInfo.authorInfo)
    }

    @Test
    fun `포스트_상세_조회_시_책정보와_저자정보도_함께 조회된다`() {
        // Given
        val postId = UUID.randomUUID()
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
                authorInfo =
                    AuthorInfo(
                        name = "Test Author",
                        dateOfBirth = "2000-01-01",
                        phoneNumber = "010-3333-4444",
                        gender = "male",
                        history = "hihihi",
                    ),
                post = foundPost,
            )
        foundPost.book = foundBook
        `when`(postRepository.findById(postId)).thenReturn(java.util.Optional.of(foundPost))

        // When
        val result = postService.getPostDetail(postId)

        // Then
        assertEquals(foundPost.id, result.id)
        assertEquals(foundPost.title, result.title)
        assertEquals(foundPost.content, result.content)
        assertEquals(foundPost.likeCount, result.likeCount)
        assertNotNull(result.createdAt)
        assertNotNull(result.updatedAt)
        assertNotNull(result.bookInfo)
        assertEquals(foundBook.id, result.bookInfo.id)
        assertEquals(foundBook.title, result.bookInfo.title)
        assertEquals(foundBook.content, result.bookInfo.content)
        assertEquals(foundBook.link, result.bookInfo.link)
        assertEquals(foundBook.authorInfo, result.bookInfo.authorInfo)
    }

    @Test
    fun `포스트_상세_조회시_조회된_포스트가_없는경우_NotFoundException을_발생시킨다`() {
        // Given
        val postId = UUID.randomUUID()
        `when`(postRepository.findById(postId)).thenReturn(java.util.Optional.empty())

        // When
        val exception =
            assertThrows(NotFoundException::class.java) {
                postService.getPostDetail(postId)
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

        // When
        val result = postService.getPostList(page = 1, size = 10)

        // Then
        assertEquals(foundPosts.size, result.postList.size)
        for (i in foundPosts.indices) {
            val foundPost = foundPosts[i]
            val resultPost = result.postList[i]
            assertEquals(foundPost.id, resultPost.id)
            assertEquals(foundPost.title, resultPost.title)
            assertEquals(foundPost.content, resultPost.content)
            assertEquals(foundPost.likeCount, resultPost.likeCount)
            assertNotNull(resultPost.createdAt)
            assertNotNull(resultPost.updatedAt)
            assertNotNull(resultPost.bookInfo)
            assertEquals(foundPost.book?.id, resultPost.bookInfo.id)
            assertEquals(foundPost.book?.title, resultPost.bookInfo.title)
            assertEquals(foundPost.book?.content, resultPost.bookInfo.content)
            assertEquals(foundPost.book?.link, resultPost.bookInfo.link)
            assertEquals(foundPost.book?.authorInfo, resultPost.bookInfo.authorInfo)
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

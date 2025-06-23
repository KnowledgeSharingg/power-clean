import com.example.powerclean.application.service.PostService
import com.example.powerclean.domain.model.Book
import com.example.powerclean.domain.model.Post
import com.example.powerclean.domain.repository.BookRepository
import com.example.powerclean.domain.repository.PostRepository
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
    fun createPost_WhenValidRequestDto_ReturnsCreatePostResDto() {
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
                creatorAccountId = requestDto.creatorAccountId,
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
    fun getPostDetail_WhenValidPostId_ReturnsGetPostDetailResDto() {
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
    fun getPostDetail_WhenInvalidPostId_ThrowsNotFoundException() {
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
    fun getPostList_WhenValidPageAndSize_ReturnsGetPostListResDto() {
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
    fun updatePost_WhenValidRequestDto_ReturnsOk() {
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
    fun updatePost_WhenInvalidPostId_ThrowsNotFoundException() {
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
        `when`(postRepository.findById(requestDto.id)).thenReturn(java.util.Optional.empty())

        // When
        val exception =
            assertThrows(NotFoundException::class.java) {
                postService.updatePost(requestDto)
            }

        // Then
        assertEquals("Post not found", exception.message)
    }

    @Test
    fun deletePost_WhenValidPostId_ReturnsOk() {
        // Given
        val postId = UUID.randomUUID()

        // When
        val result = postService.deletePost(postId)

        // Then
        assertEquals("ok", result)
    }
}

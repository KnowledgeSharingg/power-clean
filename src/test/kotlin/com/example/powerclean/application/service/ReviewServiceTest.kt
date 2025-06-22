import com.example.powerclean.application.service.ReviewService
import com.example.powerclean.domain.model.Post
import com.example.powerclean.domain.model.Review
import com.example.powerclean.domain.repository.PostRepository
import com.example.powerclean.domain.repository.ReviewRepository
import com.example.powerclean.presentation.dto.CreateReviewReqDto
import com.example.powerclean.presentation.dto.UpdateReviewReqDto
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.Mockito.mock
import org.mockito.Mockito.`when`
import org.mockito.kotlin.any
import org.mockito.kotlin.mock
import org.mockito.kotlin.verify
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.PageRequest
import java.util.Optional
import java.util.UUID
import kotlin.test.assertEquals

class ReviewServiceTest {
    private lateinit var reviewRepository: ReviewRepository
    private lateinit var postRepository: PostRepository
    private lateinit var reviewService: ReviewService

    @BeforeEach
    fun setUp() {
        reviewRepository = mock()
        postRepository = mock()
        reviewService = ReviewService(reviewRepository, postRepository)
    }

    @Test
    fun `createReview should save and return created review`() {
        // Given
        val postId = UUID.randomUUID()
        val creatorAccountId = UUID.randomUUID()
        val request = CreateReviewReqDto("Great post!", 5, postId, creatorAccountId)
        val post = Post("Sample Post", "Content", creatorAccountId, 10)
        `when`(postRepository.findById(request.postId)).thenReturn(Optional.of(post))
        val savedReview = Review(request.content, request.rating, creatorAccountId, post)
        `when`(reviewRepository.save(any())).thenReturn(savedReview)

        // When
        val response = reviewService.createReview(request)

        // Then
        assertEquals(savedReview.id, response.id)
        assertEquals(savedReview.content, response.content)
        assertEquals(savedReview.rating, response.rating)
        assertEquals(savedReview.post.id, response.postId)
    }

    @Test
    fun `getReviewDetail should return review details`() {
        // Given
        val creatorAccountId = UUID.randomUUID()
        val post = Post("Sample Post", "Content", creatorAccountId, 10)
        val review = Review("Great post!", 5, creatorAccountId, post)
        `when`(reviewRepository.findById(review.id)).thenReturn(Optional.of(review))

        // When
        val response = reviewService.getReviewDetail(review.id)

        // Then
        assertEquals(review.id, response.id)
        assertEquals(review.content, response.content)
        assertEquals(review.rating, response.rating)
    }

    @Test
    fun `getReviewListOfPost should return paginated reviews`() {
        // Given
        val creatorAccountId = UUID.randomUUID()
        val pageable = PageRequest.of(0, 10)
        val post = Post("Sample Post", "Content", creatorAccountId, 10)
        val reviews = listOf(Review("Great post!", 5, creatorAccountId, post))
        val reviewPage = PageImpl(reviews, pageable, reviews.size.toLong())
        `when`(reviewRepository.findAllByPostId(post.id, pageable)).thenReturn(reviewPage)

        // When
        val response = reviewService.getReviewListOfPost(post.id, 0, 10)

        // Then
        assertEquals(reviews.size, response.reviews.size)
        assertEquals(reviewPage.totalPages, response.totalPages)
        assertEquals(reviewPage.totalElements, response.totalElements)
    }

    @Test
    fun `updateReview should update and return ok`() {
        // Given
        val creatorAccountId = UUID.randomUUID()
        val review = Review("Old content", 3, creatorAccountId, mock(Post::class.java))
        val request = UpdateReviewReqDto("Updated content", 4, review.id)
        `when`(reviewRepository.findById(review.id)).thenReturn(Optional.of(review))

        // When
        val response = reviewService.updateReview(request)

        // Then
        assertEquals("ok", response)
        assertEquals(request.content, review.content)
        assertEquals(request.rating, review.rating)
    }

    @Test
    fun `deleteReview should delete review and return ok`() {
        // Given
        val creatorAccountId = UUID.randomUUID()
        val review = Review("Content", 5, creatorAccountId, mock(Post::class.java))
        `when`(reviewRepository.findById(review.id)).thenReturn(Optional.of(review))

        // When
        val response = reviewService.deleteReview(review.id)

        // Then
        assertEquals("ok", response)
        verify(reviewRepository).deleteById(review.id)
    }
}

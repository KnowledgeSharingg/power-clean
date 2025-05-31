
@Service
class ReviewService(
    private val reviewRepository: ReviewRepository) {
    fun createReview(request: CreateReviewReqDto): CreateReviewResDto {
        val savedReview =
            reviewRepository.save(
                Review(
                    content = request.content,
                    rating = request.rating,
                    creatorAccountId = request.creatorAccountId,
                ),
            )

        return CreateReviewResDto(
            id = savedReview.id,
            content = savedReview.content,
            rating = savedReview.rating,
            postId = savedReview.post.id,
        )
    }

    fun getReviewDetail(reviewId: UUID): GetReviewDetailResDto {
        val foundReview = reviewRepository.findById(reviewId).orElse(null)
            ?: throw NotFoundException("Review not found")
        return GetReviewDetailResDto(
            id = foundReview.id,
            content = foundReview.content,
            rating = foundReview.rating,
            createdAt = foundReview.createdAt.toString(),
            updatedAt = foundReview.updatedAt.toString(),
            postId = foundReview.post.id,
        )
    }

    fun getReviewList(page: Int, size: Int): GetReviewListResDto {
        val pageable = PageRequest.of(page, size)
        val reviewPage = reviewRepository.findAll(pageable)
        return GetReviewListResDto(
            reviews = reviewPage.content.map {
                GetReviewDetailResDto(
                    id = it.id,
                    content = it.content,
                    rating = it.rating,
                    createdAt = it.createdAt.toString(),
                    updatedAt = it.updatedAt.toString(),
                    postId = it.post.id,
                )
            },
            totalPages = reviewPage.totalPages,
            totalElements = reviewPage.totalElements,
        )
    }

    fun updateReview(request: UpdateReviewReqDto): String {
        val review = reviewRepository.findById(request.id).orElse(null)
            ?: throw NotFoundException("Review not found")
        review.content = request.content
        review.rating = request.rating
        reviewRepository.save(review)
        return "ok"
    }

    fun deleteReview(reviewId: UUID): String {
        val review = reviewRepository.findById(reviewId).orElse(null)
            ?: throw NotFoundException("Review not found")

        // TODO : soft deleete로 변경.
        reviewRepository.delete(review)
        return "ok"
    }
}
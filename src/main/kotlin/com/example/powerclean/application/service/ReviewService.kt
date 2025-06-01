package com.example.powerclean.application.service

import org.springframework.stereotype.Service
import org.springframework.data.domain.PageRequest
import org.webjars.NotFoundException
import com.example.powerclean.domain.repository.ReviewRepository
import com.example.powerclean.domain.model.Review
import com.example.powerclean.presentation.dto.CreateReviewResDto
import com.example.powerclean.presentation.dto.CreateReviewReqDto
import com.example.powerclean.presentation.dto.GetReviewDetailResDto
import com.example.powerclean.presentation.dto.UpdateReviewReqDto
import java.util.UUID
import GetReviewListResDto

@Service
class ReviewService(
    private val reviewRepository: ReviewRepository, val postRepository: PostRepository) {
    fun createReview(request: CreateReviewReqDto): CreateReviewResDto {
        val savedReview =
            reviewRepository.save(
                Review(
                    content = request.content,
                    rating = request.rating,
                    creatorAccountId = request.creatorAccountId,
                    post = postRepository.findById(UUID.fromString(request.postId)).orElseThrow {
                        NotFoundException("Post not found")
                    },
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
            creatorAccountId = foundReview.creatorAccountId
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
                    creatorAccountId = it.creatorAccountId
                )
            },
            totalPages = reviewPage.totalPages,
            totalElements = reviewPage.totalElements,
        )
    }

    fun updateReview(request: UpdateReviewReqDto): String {
        val review = reviewRepository.findById(request.reviewId).orElse(null)
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
        reviewRepository.deleteById(review.id)
        return "ok"
    }
}
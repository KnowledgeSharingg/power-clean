package com.example.powerclean.application.service

import com.example.powerclean.application.port.outbound.persistence.PostRepository
import com.example.powerclean.application.port.outbound.persistence.ReviewRepository
import com.example.powerclean.common.exception.CustomNotFoundException
import com.example.powerclean.domain.model.Review
import com.example.powerclean.presentation.dto.CreateReviewReqDto
import com.example.powerclean.presentation.dto.CreateReviewResDto
import com.example.powerclean.presentation.dto.GetReviewDetailResDto
import com.example.powerclean.presentation.dto.GetReviewListResDto
import com.example.powerclean.presentation.dto.UpdateReviewReqDto
import jakarta.transaction.Transactional
import org.springframework.data.domain.PageRequest
import org.springframework.stereotype.Service
import java.util.UUID

@Service
@Transactional
class ReviewService(
    private val reviewRepository: ReviewRepository,
    private val postRepository: PostRepository,
) {
    private val logger = org.slf4j.LoggerFactory.getLogger(ReviewService::class.java)

    fun createReview(requestDto: CreateReviewReqDto): CreateReviewResDto {
        return reviewRepository.save(
            Review.from(
                requestDto,
                postRepository.findById(requestDto.postId).orElse(null)
                    ?: throw CustomNotFoundException("Post not found"),
            ),
        ).let {
            CreateReviewResDto(
                id = it.id,
                content = it.content,
                rating = it.rating,
                postId = it.post.id,
            )
        }
    }

    fun getReviewDetail(reviewId: UUID): GetReviewDetailResDto {
        return (
            reviewRepository.findById(reviewId).orElse(null)
                ?: throw CustomNotFoundException("Review not found")
        ).let {
            GetReviewDetailResDto(
                id = it.id,
                content = it.content,
                rating = it.rating,
                createdAt = it.createdAt.toString(),
                updatedAt = it.updatedAt.toString(),
                postId = it.post.id,
                creatorAccountId = it.creatorAccountId,
            )
        }
    }

    fun getReviewListOfPost(
        postId: UUID,
        page: Int,
        size: Int,
    ): GetReviewListResDto {
        val pageable = PageRequest.of(page, size)
        val reviewPage = reviewRepository.findAllByPostId(postId, pageable)
        return GetReviewListResDto(
            reviews =
                reviewPage.content.map {
                    GetReviewDetailResDto(
                        id = it.id,
                        content = it.content,
                        rating = it.rating,
                        createdAt = it.createdAt.toString(),
                        updatedAt = it.updatedAt.toString(),
                        postId = it.post.id,
                        creatorAccountId = it.creatorAccountId,
                    )
                },
            totalPages = reviewPage.totalPages,
            totalElements = reviewPage.totalElements,
        )
    }

    fun updateReview(requestDto: UpdateReviewReqDto): String {
        (
            reviewRepository.findById(requestDto.reviewId).orElse(null)
                ?: throw CustomNotFoundException("Review not found")
        )
            .apply {
                this.updateInfo(requestDto.content, requestDto.rating)
            }.also {
                reviewRepository.save(it)
            }
        return "ok"
    }

    fun deleteReview(reviewId: UUID): String {
        (
            reviewRepository.findById(reviewId).orElse(null)
                ?: throw CustomNotFoundException("Review not found")
        ).let {
            // TODO : soft deleete로 변경.
            reviewRepository.deleteById(it.id)
        }

        return "ok"
    }
}

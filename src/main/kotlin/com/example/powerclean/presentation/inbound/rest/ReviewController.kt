package com.example.powerclean.presentation.inbound.rest

import com.example.powerclean.application.service.ReviewService
import com.example.powerclean.presentation.dto.CreateReviewReqDto
import com.example.powerclean.presentation.dto.CreateReviewResDto
import com.example.powerclean.presentation.dto.GetReviewDetailResDto
import com.example.powerclean.presentation.dto.GetReviewListResDto
import com.example.powerclean.presentation.dto.UpdateReviewReqDto
import io.swagger.v3.oas.annotations.Operation
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
@RequestMapping("/review")
class ReviewController(private val reviewService: ReviewService) {
    @Operation(summary = "리뷰 생성 API", description = "리뷰를 생성합니다.")
    @PostMapping
    fun createReview(
        @AuthenticationPrincipal(expression = "id") accountId: UUID,
        @RequestBody request: CreateReviewReqDto,
    ): CreateReviewResDto = reviewService.createReview(request.apply { creatorAccountId = accountId })

    @Operation(summary = "리뷰 상세 조회 API", description = "리뷰의 상세 정보를 조회합니다.")
    @GetMapping("/{reviewId}")
    fun getReviewDetail(
        @PathVariable reviewId: UUID,
    ): GetReviewDetailResDto = reviewService.getReviewDetail(reviewId)

    @Operation(summary = "특정 게시글 리뷰 리스트 조회 API", description = "리뷰 리스트를 조회합니다.")
    @GetMapping("/list/post/{postId}")
    fun getReviewList(
        @PathVariable postId: UUID,
        @RequestParam page: Int,
        @RequestParam size: Int,
    ): GetReviewListResDto = reviewService.getReviewListOfPost(postId, page, size)

    @Operation(summary = "리뷰 수정 API", description = "리뷰를 수정합니다.")
    @PatchMapping()
    fun updateReview(
        @RequestBody request: UpdateReviewReqDto,
    ): String = reviewService.updateReview(request)

    @Operation(summary = "리뷰 삭제 API", description = "리뷰를 삭제합니다.")
    @DeleteMapping("/{reviewId}")
    fun deleteReview(
        @PathVariable reviewId: UUID,
    ): String = reviewService.deleteReview(reviewId)
}

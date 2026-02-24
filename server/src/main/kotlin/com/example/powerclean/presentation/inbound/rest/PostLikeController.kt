package com.example.powerclean.presentation.inbound.rest

import com.example.powerclean.application.service.PostLikeService
import com.example.powerclean.presentation.dto.CountResDto
import com.example.powerclean.presentation.dto.GetPostListResDto
import io.swagger.v3.oas.annotations.Operation
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
@RequestMapping("/post")
class PostLikeController(
    private val postLikeService: PostLikeService,
) {
    @Operation(summary = "Post 좋아요 추가 API.", description = "포스트에 좋아요 추가.")
    @PostMapping("/{postId}/like")
    fun addLike(
        @AuthenticationPrincipal(expression = "id") accountId: UUID,
        @PathVariable postId: UUID,
    ): String = postLikeService.addLike(postId, accountId)

    @Operation(summary = "Post 좋아요 제거 API.", description = "포스트에 좋아요 제거.")
    @DeleteMapping("/{postId}/like")
    fun removeLike(
        @AuthenticationPrincipal(expression = "id") accountId: UUID,
        @PathVariable postId: UUID,
    ): String = postLikeService.removeLike(postId, accountId)

    @Operation(summary = "Post 좋아요 카운트 조회 API.", description = "포스트 좋아요 카운트 조회.")
    @GetMapping("/{postId}/likes/count")
    fun countLikes(
        @PathVariable postId: UUID,
    ): CountResDto = CountResDto(postLikeService.countLikes(postId))

    @Operation(summary = "내 좋아요 목록 조회 API.", description = "인증된 사용자의 좋아요한 포스트 목록 조회.")
    @GetMapping("/me/likes")
    fun getMyLikes(
        @AuthenticationPrincipal(expression = "id") accountId: UUID,
    ): GetPostListResDto = postLikeService.findLikesByAccount(accountId)
}

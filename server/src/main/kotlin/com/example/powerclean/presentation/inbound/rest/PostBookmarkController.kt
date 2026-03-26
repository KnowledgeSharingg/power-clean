package com.example.powerclean.presentation.inbound.rest

import com.example.powerclean.application.service.PostBookmarkService
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
class PostBookmarkController(
    private val postBookmarkService: PostBookmarkService,
) {
    @Operation(summary = "Post 북마크 추가 API.", description = "포스트를 북마크.")
    @PostMapping("/{postId}/bookmark")
    fun addBookmark(
        @AuthenticationPrincipal(expression = "id") accountId: UUID,
        @PathVariable postId: UUID,
    ): String = postBookmarkService.addBookmark(postId, accountId)

    @Operation(summary = "Post 북마크 제거 API.", description = "포스트 북마크를 해제.")
    @DeleteMapping("/{postId}/bookmark")
    fun removeBookmark(
        @AuthenticationPrincipal(expression = "id") accountId: UUID,
        @PathVariable postId: UUID,
    ): String = postBookmarkService.removeBookmark(postId, accountId)

    @Operation(summary = "내 북마크 목록 조회 API.", description = "인증된 사용자의 북마크한 포스트 목록 조회.")
    @GetMapping("/bookmark/list")
    fun getMyBookmarks(
        @AuthenticationPrincipal(expression = "id") accountId: UUID,
    ): GetPostListResDto = postBookmarkService.findBookmarksByAccount(accountId)
}

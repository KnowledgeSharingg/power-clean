package com.example.powerclean.presentation.inbound.rest

import com.example.powerclean.application.service.PostService
import com.example.powerclean.presentation.dto.CreatePostReqDto
import com.example.powerclean.presentation.dto.CreatePostResDto
import com.example.powerclean.presentation.dto.GetCreatedPostByAIResDto
import com.example.powerclean.presentation.dto.GetPostDetailResDto
import com.example.powerclean.presentation.dto.GetPostListResDto
import com.example.powerclean.presentation.dto.UpdatePostReqDto
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
@RequestMapping("/post")
class PostController(private val postService: PostService) {
    private val logger = org.slf4j.LoggerFactory.getLogger(PostController::class.java)

    @Operation(summary = "Post 생성 API.", description = "포스트 생성")
    @PostMapping()
    fun createPost(
        @AuthenticationPrincipal(expression = "id") accountId: UUID,
        @RequestBody request: CreatePostReqDto,
    ): CreatePostResDto = postService.createPost(request.copy(creatorAccountId = accountId))

    @Operation(summary = "Post 생성 데이터 조회 by AI API", description = "스크립트를 받아 AI를 활용해 포스트 생성 내용 자동으로 채워 데이터 내려주는 API.")
    @GetMapping("/ai")
    fun getCreatedPostContentByAI(
        @RequestParam script: String,
    ): GetCreatedPostByAIResDto = postService.getCreatedPostContentByAI(script)

    @Operation(summary = "Post 상세 조회 API.", description = "포스트 상세 조회.")
    @GetMapping("/{postId}")
    fun getPostDetail(
        @AuthenticationPrincipal(expression = "id") accountId: UUID?,
        @PathVariable postId: UUID,
    ): GetPostDetailResDto = postService.getPostDetail(postId, accountId)

    @Operation(summary = "Post 리스트 조회 API.", description = "포스트 리스트 조회.")
    @GetMapping("/list")
    fun getPostList(
        @RequestParam page: Int,
        @RequestParam size: Int,
    ): GetPostListResDto = postService.getPostList(page, size)

    @Operation(summary = "Post 수정 API.", description = "포스트 수정.")
    @PatchMapping()
    fun updatePost(
        @RequestBody request: UpdatePostReqDto,
    ): String = postService.updatePost(request)

    @Operation(summary = "Post 삭제 API.", description = "포스트 삭제.")
    @DeleteMapping("/{postId}")
    fun deletePost(
        @PathVariable postId: UUID,
    ): String = postService.deletePost(postId)
}

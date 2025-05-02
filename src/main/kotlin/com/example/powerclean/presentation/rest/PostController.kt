package com.example.powerclean.presentation.rest

import com.example.powerclean.application.service.PostService
import com.example.powerclean.presentation.dto.CreatePostReqDto
import com.example.powerclean.presentation.dto.CreatePostResDto
import com.example.powerclean.presentation.dto.GetPostDetailResDto
import com.example.powerclean.presentation.dto.GetPostListResDto
import com.example.powerclean.presentation.dto.UpdatePostReqDto
import io.swagger.v3.oas.annotations.Operation
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
    @Operation(summary = "Post 생성 API.", description = "포스트 생성")
    @PostMapping()
    fun createPost(
        @RequestBody request: CreatePostReqDto,
    ): CreatePostResDto = postService.createPost(request)

    @Operation(summary = "Post 상세 조회 API.", description = "포스트 상세 조회.")
    @GetMapping("/{postId}")
    fun getPostDetail(
        @PathVariable postId: UUID,
    ): GetPostDetailResDto = postService.getPostDetail(postId)

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

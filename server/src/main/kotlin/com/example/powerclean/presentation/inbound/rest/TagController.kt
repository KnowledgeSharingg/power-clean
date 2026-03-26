package com.example.powerclean.presentation.inbound.rest

import com.example.powerclean.application.service.PostService
import io.swagger.v3.oas.annotations.Operation
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/tags")
class TagController(private val postService: PostService) {
    @Operation(summary = "태그 목록 조회 API.", description = "전체 태그 목록을 조회합니다.")
    @GetMapping()
    fun getAllTags(): List<String> = postService.getAllTags()
}

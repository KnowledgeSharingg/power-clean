package com.example.powerclean.presentation.rest

import com.example.powerclean.application.service.ImageService
import io.swagger.v3.oas.annotations.Operation
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.multipart.MultipartFile

@RestController("image")
class ImageController(
    private val imageService: ImageService,
) {
    @Operation(
        summary = "이미지 업로드 API",
        description = "이미지를 업로드하고 URL을 반환합니다.",
    )
    @PostMapping("/upload")
    fun uploadImage(
        @RequestParam("file") file: MultipartFile,
    ): String {
        return imageService.uploadImage(file)
    }
}

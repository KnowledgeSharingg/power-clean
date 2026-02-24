package com.example.powerclean.application.service

import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.Paths

@Service
class ImageService(
    private val uploadDir: Path = Paths.get("BookCoverImages"),
) {
    private val logger = org.slf4j.LoggerFactory.getLogger(ImageService::class.java)

    fun uploadImage(file: MultipartFile): String {
        // 디렉토리가 없으면 생성
        if (!Files.exists(uploadDir)) {
            Files.createDirectories(uploadDir)
        }

        val originalFilename = file.originalFilename?.let { Paths.get(it).fileName.toString() } ?: return ""
        val filePath = uploadDir.resolve(originalFilename)
        file.transferTo(filePath)

        return "/BookCoverImages/$originalFilename"
    }
}

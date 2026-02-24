package com.example.powerclean.application.port.outbound.ai.dto

/**
 * Result from AI for creating a Post and Book suggestion based on a script.
 */
data class AiBookInfoResult(
    val postTitle: String,
    val postContent: String,
    val bookTitle: String,
    val bookContent: String,
    val bookLink: String,
    val coverImageUrl: String?,
    val author: String?,
)

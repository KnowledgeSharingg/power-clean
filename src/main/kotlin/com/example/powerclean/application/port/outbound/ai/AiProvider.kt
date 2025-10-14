package com.example.powerclean.application.port.outbound.ai

import com.example.powerclean.application.port.outbound.ai.dto.AiBookInfoResult

/**
 * Abstraction for AI providers capable of generating content for posts and extracting book info
 * from a user-provided script. Implementations can be backed by Gemini, ChatGPT, or others.
 */
interface AiProvider {
    /**
     * Compose a prompt based on the given script and ask the AI to extract or propose
     * the needed information to create a Post and its related Book.
     */
    fun getBookInfo(script: String): AiBookInfoResult

    /** Basic text generation for extensibility/testing. */
    fun generateText(prompt: String): String

    /** Simple chat entry point for future extensions. */
    fun chat(messages: List<String>): String
}

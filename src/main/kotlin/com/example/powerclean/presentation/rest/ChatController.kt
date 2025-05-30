
package com.example.powerclean.presentation.rest

import org.springframework.ai.chat.messages.UserMessage
import org.springframework.ai.chat.model.ChatResponse
import org.springframework.ai.chat.prompt.Prompt
import org.springframework.ai.openai.OpenAiChatModel
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import reactor.core.publisher.Flux

@RestController
class ChatController(private val chatModel: OpenAiChatModel) {
    @GetMapping("/ai/generate")
    fun generate(
        @RequestParam(value = "message", defaultValue = "Tell me a joke") message: String,
    ): Map<String, Any> {
        return mapOf("generation" to chatModel.call(message))
    }

    @GetMapping("/ai/generateStream")
    fun generaeStream(
        @RequestParam(value = "message", defaultValue = "Tell me a joke") message: String,
    ): Flux<ChatResponse> {
        val prompt: Prompt = Prompt(UserMessage(message))
        return chatModel.stream(prompt)
    }
}

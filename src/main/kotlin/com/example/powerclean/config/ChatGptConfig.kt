package com.example.powerclean.config

import org.springframework.ai.model.ApiKey
import org.springframework.ai.openai.OpenAiChatModel
import org.springframework.ai.openai.OpenAiChatOptions
import org.springframework.ai.openai.api.OpenAiApi
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class ChatGptConfig {
    @Bean
    fun openAiChatModel(
        @Value("\${spring.ai.openai.api-key}") apiKey: String,
        @Value("\${spring.ai.openai.chat.options.model}") model: String,
        @Value("\${spring.ai.openai.base-url}") baseUrl: String,
    ): OpenAiChatModel {
        val api =
            OpenAiApi.builder()
                .baseUrl(baseUrl)
                .apiKey(ApiKey { apiKey })
                .build()
        val options = OpenAiChatOptions()
        options.model = model

        return OpenAiChatModel.builder()
            .openAiApi(api)
            .defaultOptions(options)
            .build()
    }`
}

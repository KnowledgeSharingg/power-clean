package com.example.powerclean.presentation.outbound.ai.gemini

import com.example.powerclean.application.port.outbound.ai.AiProvider
import com.example.powerclean.application.port.outbound.ai.dto.AiBookInfoResult
import com.example.powerclean.common.exception.CustomInternalServerErrorException
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import java.net.HttpURLConnection
import java.net.URI

@Service
class GeminiAiProvider(
    @Value("\${gemini.api.key:}") private val apiKey: String,
    @Value("\${gemini.api.base-url:}") private val apiBaseUrl: String,
) : AiProvider {
    private val logger = LoggerFactory.getLogger(GeminiAiProvider::class.java)

    override fun getBookInfo(script: String): AiBookInfoResult {
        val prompt = buildPromptForBookInfo(script)
        val raw = safeGenerateText(prompt)
        this.logger.debug("Gemini API response by safeGenerateText: $raw")
        // Very lightweight parser: expecting a simple JSON-like block. If parsing fails, fallback heuristics.
        return parseBookInfoOrFallback(raw, script)
    }

    override fun generateText(prompt: String): String = safeGenerateText(prompt)

    override fun chat(messages: List<String>): String {
        val joined = messages.joinToString("\n")
        return safeGenerateText(joined)
    }

    private fun safeGenerateText(prompt: String): String {
        return if (apiKey.isNullOrBlank()) {
            // Fallback behavior when API key is not provided: return a deterministic stub.
            logger.warn("Gemini API key not set. Returning stubbed AI response.")
            """
            {"postTitle":"${prompt.take(
                20,
            )}...의 요약","postContent":"$prompt","bookTitle":"${prompt.take(
                10,
            )} 추천 도서","bookContent":"이 스크립트를 기반으로 한 도서 소개입니다.","bookLink":"https://example.com/book","coverImageUrl":"","author":"알 수 없음"}
            """.trimIndent()
        } else {
            try {
                callGeminiGenerateContent(prompt)
            } catch (e: Exception) {
                logger.error("Gemini call failed, falling back to stub.", e)
                throw e
            }
        }
    }

    private fun buildPromptForBookInfo(script: String): String =
        """
        다음 사용자 스크립트를 바탕으로 블로그 포스트와 연결할 도서 정보를 제안해줘.
        꼭 아래 JSON 형식으로만 응답해. 추가 설명 금지.
        {
          "postTitle": "포스트 제목(최대 50자)",
          "postContent": "포스트 본문(최대 1000자)",
          "bookTitle": "도서 제목",
          "bookContent": "도서 소개(최대 1000자)",
          "bookLink": "도서 링크(URL 없으면 빈 문자열)",
          "coverImageUrl": "표지 이미지 URL(없으면 빈 문자열)",
          "author": "저자명(없으면 '알 수 없음')"
        }
        사용자 스크립트:
        $script
        """.trimIndent()

    private fun parseBookInfoOrFallback(
        jsonLike: String,
        script: String,
    ): AiBookInfoResult {
        this.logger.debug("parseBookInfoOrFallback::jsonLike:: $jsonLike")

        // Very naive parsing to keep dependencies minimal. Tries to find values by keys.
        fun pick(key: String): String? {
            val pattern = ("\\\"" + key + "\\\"\\s*:\\s*\\\"").toRegex()
            val start = pattern.find(jsonLike)?.range?.last?.plus(1) ?: return null
            val end = jsonLike.indexOf('"', start)
            return if (end > start) jsonLike.substring(start, end) else null
        }
        val postTitle = pick("postTitle") ?: (script.take(30) + if (script.length > 30) "..." else "")
        val postContent = pick("postContent") ?: script.take(1000)
        val bookTitle = pick("bookTitle") ?: "$postTitle 관련 도서"
        val bookContent = pick("bookContent") ?: "사용자 스크립트를 기반으로 한 도서 소개"
        val bookLink = pick("bookLink") ?: ""
        val cover = pick("coverImageUrl")
        val authorName = pick("author") ?: "알 수 없음"
        return AiBookInfoResult(
            postTitle = postTitle,
            postContent = postContent,
            bookTitle = bookTitle,
            bookContent = bookContent,
            bookLink = bookLink,
            coverImageUrl = if (cover.isNullOrBlank()) null else cover,
            author = authorName,
        )
    }

    // Minimal Gemini Free API call using HTTP URL connection to avoid extra dependencies.
    private fun callGeminiGenerateContent(prompt: String): String {
        val endpoint =
            apiBaseUrl +
                "/v1beta/models/gemini-2.5-flash:generateContent?key=$apiKey"
        val body =
            """
            {
              "contents": [
                {
                  "parts": [ { "text": ${prompt.trimIndent().toJsonString()} } ]
                }
              ]
            }
            """.trimIndent()
        val url = URI(endpoint).toURL()
        val conn =
            (url.openConnection() as HttpURLConnection).apply {
                requestMethod = "POST"
                setRequestProperty("Content-Type", "application/json; charset=UTF-8")
                doOutput = true
                outputStream.use { os ->
                    os.write(body.toByteArray(Charsets.UTF_8))
                }
            }

        this.logger.debug("Gemini API request: $body")
        this.logger.debug("Gemini API conn: $conn")
        this.logger.debug("Gemini API responseCode: ${conn.responseCode}")
        val code = conn.responseCode
        val stream =
            if (code in 200..299) {
                conn.inputStream
            } else {
                throw CustomInternalServerErrorException(
                    conn.errorStream.bufferedReader(
                        Charsets.UTF_8,
                    ).readText(),
                )
            }
        this.logger.debug("Gemini API stream: $stream")
        val response = stream.bufferedReader(Charsets.UTF_8).readText()
        this.logger.debug("Gemini API response: $response")
        // Gemini returns a JSON; extract the text from candidates[0].content.parts[0].text if possible
        return extractTextFromGeminiResponse(response)
    }

    private fun extractTextFromGeminiResponse(response: String): String {
        // Robust extraction: parse Gemini JSON and gather candidates[].content.parts[].text
        return try {
            val mapper = com.fasterxml.jackson.module.kotlin.jacksonObjectMapper()
            val root = mapper.readTree(response)
            val candidates = root.path("candidates")
            if (!candidates.isArray || candidates.size() == 0) return response

            val sb = StringBuilder()
            for (cand in candidates) {
                val parts = cand.path("content").path("parts")
                if (parts.isArray) {
                    for (p in parts) {
                        val t = p.path("text").asText(null)
                        if (!t.isNullOrBlank()) sb.append(t)
                    }
                }
            }
            val combined = sb.toString().ifBlank { response }
            sanitizeCodeFence(combined)
        } catch (e: Exception) {
            // Fallback to original response if we cannot parse JSON
            response
        }
    }

    private fun sanitizeCodeFence(text: String): String {
        // Remove leading/trailing Markdown code fences like ```json ... ```
        val trimmed = text.trim()
        if (trimmed.startsWith("```")) {
            val firstNewline = trimmed.indexOf('\n')
            val withoutOpening =
                if (firstNewline >= 0) {
                    trimmed.substring(
                        firstNewline + 1,
                    )
                } else {
                    trimmed.removePrefix("```")
                }
            val endFence = withoutOpening.lastIndexOf("```")
            return if (endFence >= 0) withoutOpening.substring(0, endFence).trim() else withoutOpening.trim()
        }
        return trimmed
    }
}

// Small helper to JSON-escape a Kotlin string without bringing a JSON dependency
private fun String.toJsonString(): String =
    buildString {
        append('"')
        for (ch in this@toJsonString) {
            when (ch) {
                '\\' -> append("\\\\")
                '"' -> append("\\\"")
                '\n' -> append("\\n")
                '\r' -> append("\\r")
                '\t' -> append("\\t")
                else -> append(ch)
            }
        }
        append('"')
    }

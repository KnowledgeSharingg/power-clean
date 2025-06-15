
package com.example.powerclean.presentation.dto
import java.util.UUID

data class UpdateReviewReqDto(
    val content: String,
    val rating: Int,
    val reviewId: UUID,
) {
    fun toMap(): Map<String, Any> {
        return mapOf(
            "content" to content,
            "rating" to rating,
        )
    }
}

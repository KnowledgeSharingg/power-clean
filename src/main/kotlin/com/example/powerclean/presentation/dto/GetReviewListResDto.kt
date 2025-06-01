

import com.example.powerclean.presentation.dto.GetReviewDetailResDto

data class GetReviewListResDto(
    val reviews: List<GetReviewDetailResDto>
    val totalPages: Int,
    val totalElements: Long,
)

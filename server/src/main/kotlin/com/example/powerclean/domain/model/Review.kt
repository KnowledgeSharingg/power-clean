package com.example.powerclean.domain.model

import com.example.powerclean.presentation.dto.CreateReviewReqDto
import jakarta.persistence.Column
import jakarta.persistence.ConstraintMode
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.ForeignKey
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import java.util.UUID

@Entity
@Table(name = "review")
class Review(
    @Column(name = "content", length = 1000, nullable = false)
    var content: String,
    @Column(name = "rating", nullable = false)
    var rating: Int,
    @Column(name = "creator_account_id", nullable = false)
    var creatorAccountId: UUID,
    // TODO: 주인 쪽에 cascade 설정 해도되나 ?
    // BOOK과 POST 관계를 확인해보면, 주인이 아닌 POST 쪽에 cascade 설정이 되어있음.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", foreignKey = ForeignKey(ConstraintMode.NO_CONSTRAINT))
    var post: Post,
) : BaseEntity() {
    companion object {
        fun from(
            requestDto: CreateReviewReqDto,
            post: Post,
        ): Review =
            Review(
                content = requestDto.content,
                rating = requestDto.rating,
                creatorAccountId = requestDto.creatorAccountId,
                post = post,
            )
    }

    fun updateInfo(
        content: String,
        rating: Int,
    ): Review =
        this.apply {
            this.content = content
            this.rating = rating
        }
}

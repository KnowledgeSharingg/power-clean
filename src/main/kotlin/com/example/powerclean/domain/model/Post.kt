package com.example.powerclean.domain.model

import com.example.powerclean.presentation.dto.CreatePostReqDto
import jakarta.persistence.CascadeType
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.OneToOne
import jakarta.persistence.Table
import java.util.UUID

@Entity
@Table(name = "post")
class Post(
    @Column(name = "title", nullable = false)
    var title: String,
    @Column(name = "content", length = 10000, nullable = false)
    var content: String,
    @Column(name = "creator_account_id", nullable = false)
    var creatorAccountId: UUID,
    @Column(name = "like_count", nullable = false)
    var likeCount: Int,
    @OneToOne(mappedBy = "post", cascade = [CascadeType.ALL], fetch = FetchType.LAZY, optional = true)
    var book: Book? = null,
) : BaseEntity() {
    companion object {
        fun from(requestDto: CreatePostReqDto): Post =
            Post(
                title = requestDto.title,
                content = requestDto.content,
                creatorAccountId = requestDto.creatorAccountId,
                likeCount = 0,
            )
    }

    fun updateInfo(
        title: String,
        content: String,
    ): Post =
        this.apply {
            this.title = title
            this.content = content
        }
}

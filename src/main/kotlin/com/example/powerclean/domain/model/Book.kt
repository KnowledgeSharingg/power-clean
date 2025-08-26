package com.example.powerclean.domain.model

import com.example.powerclean.domain.valueobject.AuthorInfo
import com.example.powerclean.presentation.dto.CreateBookReqDto
import com.example.powerclean.utils.DEFAULT_BOOK_COVER_IMAGE_URL
import jakarta.persistence.Column
import jakarta.persistence.ConstraintMode
import jakarta.persistence.Embedded
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.ForeignKey
import jakarta.persistence.JoinColumn
import jakarta.persistence.OneToOne
import jakarta.persistence.Table

@Entity
@Table(name = "book")
class Book(
    @Column(name = "title", nullable = false)
    var title: String,
    @Column(name = "content", length = 10000, nullable = false)
    var content: String,
    @Column(name = "link", nullable = false)
    var link: String,
    @Column(name = "cover_image_url", nullable = false)
    var coverImageUrl: String = DEFAULT_BOOK_COVER_IMAGE_URL,
    @Embedded
    var authorInfo: AuthorInfo,
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", foreignKey = ForeignKey(ConstraintMode.NO_CONSTRAINT))
    var post: Post,
) : BaseEntity() {
    companion object {
        fun from(
            requestDto: CreateBookReqDto,
            post: Post,
        ): Book =
            Book(
                title = requestDto.title,
                content = requestDto.content,
                link = requestDto.link,
                coverImageUrl =
                    requestDto.coverImageUrl.takeIf { it.isNotBlank() }
                        ?: DEFAULT_BOOK_COVER_IMAGE_URL,
                authorInfo = requestDto.authorInfo,
                post = post,
            )
    }

    fun updateInfo(
        title: String,
        content: String,
        link: String,
    ): Book =
        this.apply {
            this.title = title
            this.content = content
            this.link = link
        }
}

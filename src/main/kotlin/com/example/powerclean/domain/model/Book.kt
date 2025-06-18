package com.example.powerclean.domain.model

import com.example.powerclean.domain.valueobject.AuthorInfo
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
    @Embedded
    var authorInfo: AuthorInfo,
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", foreignKey = ForeignKey(ConstraintMode.NO_CONSTRAINT))
    var post: Post,
) : BaseEntity()

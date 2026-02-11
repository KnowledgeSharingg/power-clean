package com.example.powerclean.domain.model

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Table
import jakarta.persistence.UniqueConstraint
import java.util.UUID

@Entity
@Table(name = "post_tag", uniqueConstraints = [UniqueConstraint(columnNames = ["post_id", "tag_id"])])
class PostTag(
    @Column(name = "post_id", nullable = false)
    var postId: UUID,
    @Column(name = "tag_id", nullable = false)
    var tagId: UUID,
) : BaseEntity()

package com.example.powerclean.domain.model

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Table
import jakarta.persistence.UniqueConstraint
import java.util.UUID

@Entity
@Table(name = "post_like", uniqueConstraints = [UniqueConstraint(columnNames = ["post_id", "account_id"])])
class PostLike(
    @Column(name = "post_id", nullable = false)
    var postId: UUID,
    @Column(name = "account_id", nullable = false)
    var accountId: UUID,
) : BaseEntity()

package com.example.powerclean.domain.model

import jakarta.persistence.Column
import jakarta.persistence.ConstraintMode
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.ForeignKey
import jakarta.persistence.JoinColumn
import jakarta.persistence.OneToOne
import jakarta.persistence.Table

@Entity
@Table(name = "oauth_profile")
class OauthProfile(
    @Column(name = "type", nullable = false)
    var type: String,
    @Column(name = "email", nullable = false, unique = true)
    var email: String,
    @Column(name = "login", nullable = true)
    var login: String,
    @Column(name = "profile_image_url", nullable = true)
    var profileImageUrl: String,
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", foreignKey = ForeignKey(ConstraintMode.NO_CONSTRAINT))
    var account: Account? = null,
) : BaseEntity()

package com.example.powerclean.domain.model

import com.example.powerclean.domain.valueobject.PersonalInfo
import com.example.powerclean.presentation.dto.RegisterAccountReqDto
import jakarta.persistence.Column
import jakarta.persistence.Embedded
import jakarta.persistence.Entity
import jakarta.persistence.Table

@Entity
@Table(name = "account")
class Account(
    @Column(name = "nickname", nullable = false)
    var nickname: String,
    @Column(name = "email", nullable = false, unique = true)
    var email: String,
    @Column(name = "password", nullable = false)
    var password: String,
    @Embedded
    var personalInfo: PersonalInfo? = null,
    // @OneToOne(
    //     mappedBy = "account",
    //     cascade = [CascadeType.ALL],
    //     fetch = FetchType.LAZY,
    //     optional = true,
    // )
    // var oauthProfile: OauthProfile? = null,
) : BaseEntity() {
    companion object {
        fun from(requestDto: RegisterAccountReqDto): Account =
            Account(email = requestDto.email, nickname = requestDto.nickname, password = requestDto.password)
    }
}

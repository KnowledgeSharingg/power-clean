package com.example.powerclean.application.service

import com.example.powerclean.application.port.outbound.persistence.AccountRepository
import com.example.powerclean.application.port.outbound.persistence.OauthProfileRepository
import com.example.powerclean.common.exception.CustomIllegalArgumentException
import com.example.powerclean.domain.model.Account
import com.example.powerclean.domain.model.OauthProfile
import com.example.powerclean.domain.valueobject.PersonalInfo
import org.springframework.security.oauth2.core.user.OAuth2User
import org.springframework.stereotype.Service

@Service
class AuthService(
    private val accountRepository: AccountRepository,
    private val oauthProfileRepository: OauthProfileRepository,
) {
    fun oauth2Login(principal: OAuth2User): String {
        // TODO: jwt 토큰 발급.
        // TODO: 랜덤 닉네임 할당해주기.

        val foundAccount =
            accountRepository.findByPersonalInfo_Name(
                principal.getAttribute<String>("name") ?: throw IllegalArgumentException("name"),
            )
        if (foundAccount == null) {
            val savedAccount: Account =
                accountRepository.save(
                    Account(
                        nickname = "nickname",
                        email = "email",
                        password = "password",
                        personalInfo =
                            PersonalInfo(
                                name =
                                    principal.getAttribute<String>("name")
                                        ?: throw CustomIllegalArgumentException(
                                            "name",
                                        ),
                            ),
                    ),
                )
            oauthProfileRepository.save(
                OauthProfile(
                    account = savedAccount,
                    email =
                        principal.getAttribute<String>("email") ?: throw IllegalArgumentException(
                            "email",
                        ),
                    login =
                        principal.getAttribute<String>("login") ?: throw IllegalArgumentException(
                            "login",
                        ),
                    profileImageUrl =
                        principal.getAttribute<String>("avatar_url")
                            ?: throw CustomIllegalArgumentException(
                                "profileImageUrl",
                            ),
                    type = "github",
                ),
            )
        }
        return principal.attributes.toString()
    }
}

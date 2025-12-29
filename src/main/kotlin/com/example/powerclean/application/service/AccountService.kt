package com.example.powerclean.application.service

import com.example.powerclean.application.port.inbound.AccountAuthenticateUseCase
import com.example.powerclean.application.port.inbound.AccountRegisterUseCase
import com.example.powerclean.application.port.outbound.persistence.AccountRepository
import com.example.powerclean.common.exception.CustomConflictException
import com.example.powerclean.domain.model.Account
import com.example.powerclean.presentation.dto.*
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.*
import javax.security.auth.login.AccountNotFoundException

@Service
@Transactional
class AccountService(
    private val accountRepository: AccountRepository,
    private val authenticationService: AccountAuthenticateUseCase,
    private val passwordEncoder: PasswordEncoder,
) : AccountRegisterUseCase {
    private val logger = org.slf4j.LoggerFactory.getLogger(AccountService::class.java)

    override fun registerAccount(requestDto: RegisterAccountReqDto): Account {
        return requestDto
            .also {
                if (accountRepository.findByEmail(it.email) != null) {
                    throw CustomConflictException(
                        "Email already exists.",
                    )
                }
            }
            .apply { password = passwordEncoder.encode(password) }
            .let { Account.from(it) }
            .let { accountRepository.save(it) }
    }

    // TODO: usecase 이 메소드에 해당되는걸 만들까 ? 아님 accountRegisterUseCase랑 합칠까 ? => 강의 코드 확인해보기.
    fun login(requestDto: LoginReqDto): LoginResDto {
        val authenticationResponse: AuthenticationResDto =
            authenticationService.authentication(
                AuthenticationReqDto(requestDto.email, requestDto.password),
            )
        return LoginResDto.of(authenticationResponse.accessToken, authenticationResponse.refreshToken)
    }

    fun updateNickname(
        nickname: String,
        accountId: UUID,
    ): String {
        this.accountRepository.updateNicknameById(accountId, nickname)
        return "닉네임이 수정되었습니다."
    }

    fun getAccountInfo(accountId: UUID): GetAccountInfoResDto {
        val foundAccount: Account =
            this.accountRepository.findById(accountId).orElse(null)
                ?: throw AccountNotFoundException()
        return GetAccountInfoResDto(
            foundAccount.email,
            foundAccount.nickname,
            foundAccount.createdAt,
            foundAccount.updatedAt,
        )
    }
}

package com.example.powerclean.application.service

import com.example.powerclean.application.inbound.AccountRegisterUseCase
import com.example.powerclean.application.outbound.AccountRepository
import com.example.powerclean.domain.model.Account
import com.example.powerclean.presentation.dto.RegisterAccountReqDto
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class AccountService(
    private val accountRepository: AccountRepository,
) : AccountRegisterUseCase {
    override fun registerAccount(requestDto: RegisterAccountReqDto): Account {
        return accountRepository.save(
            Account(
                email = requestDto.email,
                password = requestDto.password,
                nickname = requestDto.email,
            ),
        )
    }

    @Transactional()
    fun updateNickname(
        nickname: String,
        accountId: String,
    ): String {
        this.accountRepository.updateNicknameById(accountId, nickname)
        return "닉네임이 수정되었습니다."
    }
}

package com.example.powerclean.application.service

import com.example.powerclean.application.inbound.AccountRegisterPort
import com.example.powerclean.domain.repository.AccountRepository
import com.example.powerclean.presentation.dto.RegisterAccountReqDto
import com.example.powerclean.presentation.dto.RegisterAccountResDto
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class AccountService(
    private val accountRepository: AccountRepository,
) : AccountRegisterPort {
    override fun registerAccount(requestDto: RegisterAccountReqDto): RegisterAccountResDto {
        // val savedAccount = accountRepository.save(
        //     Account(
        //         email = requestDto.email,
        //         password = requestDto.password,
        //         nickname = requestDto.nickname ?: requestDto.email,
        //     )
        // )

        // return RegisterAccountResDto.of(
        //     createAccessToken(savedAccount.id),
        //     createRefreshToken(savedAccount.id)
        // )

        return RegisterAccountResDto.of(
            "",
            "",
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

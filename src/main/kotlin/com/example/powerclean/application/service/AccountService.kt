package com.example.powerclean.application.service

import com.example.powerclean.domain.repository.AccountRepository
import com.example.powerclean.presentation.dto.RegisterAccountReqDto
import com.example.powerclean.presentation.dto.RegisterAccountResDto
import org.springframework.stereotype.Service

@Service
class AccountService(
    private val accountRepository: AccountRepository,
) {
    fun registerAccount(requestDto: RegisterAccountReqDto): RegisterAccountResDto {
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
}

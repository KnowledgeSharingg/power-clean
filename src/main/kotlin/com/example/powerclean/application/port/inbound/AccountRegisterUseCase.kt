package com.example.powerclean.application.port.inbound

import com.example.powerclean.domain.model.Account
import com.example.powerclean.presentation.dto.RegisterAccountReqDto

interface AccountRegisterUseCase {
    /*
     * 계정 등록.
     */
    fun registerAccount(requestDto: RegisterAccountReqDto): Account
}

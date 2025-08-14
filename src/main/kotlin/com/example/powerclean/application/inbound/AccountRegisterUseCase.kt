package com.example.powerclean.application.inbound

import com.example.powerclean.presentation.dto.RegisterAccountReqDto
import com.example.powerclean.presentation.dto.RegisterAccountResDto

interface AccountRegisterUseCase {
    /*
     * 계정 등록.
     */
    fun registerAccount(requestDto: RegisterAccountReqDto): RegisterAccountResDto
}

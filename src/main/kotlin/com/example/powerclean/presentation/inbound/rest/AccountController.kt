package com.example.powerclean.presentation.inbound.rest

import com.example.powerclean.application.port.inbound.AccountRegisterUseCase
import com.example.powerclean.application.service.AccountService
import com.example.powerclean.presentation.dto.*
import io.swagger.v3.oas.annotations.Operation
import jakarta.validation.constraints.NotBlank
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/account")
class AccountController(
    private val accountRegisterService: AccountRegisterUseCase,
    private val accountService: AccountService,
) {
    @Operation(summary = "회원 가입 API", description = "새로운 계정을 등록합니다.")
    @PostMapping("/register")
    fun registerAccount(
        @RequestBody requestDto: RegisterAccountReqDto,
    ): String {
        // TODO: 이메일 인증 로직 추가.
        this.accountRegisterService.registerAccount(requestDto)
        return "ok"
    }

    @Operation(summary = "로그인 API", description = "사용자 인증을 수행합니다.")
    @PostMapping("/login")
    fun login(
        @RequestBody requestDto: LoginReqDto,
    ): LoginResDto {
        return this.accountService.login(requestDto)
    }

    @Operation(summary = "사용자 정보 조회 API", description = "사용자의 정보를 조회합니다.")
    @GetMapping("/info")
    fun getAccountInfo(
        @AuthenticationPrincipal(expression = "id") accountId: UUID,
    ): GetAccountInfoResDto {
        return this.accountService.getAccountInfo(accountId)
    }

    @Operation(summary = "닉네임 수정 API", description = "사용자의 닉네임을 수정합니다.")
    @PatchMapping("/nickname/{nickname}")
    fun updateNickname(
        @PathVariable @NotBlank nickname: String,
        @AuthenticationPrincipal(expression = "id") accountId: UUID,
    ): String {
        return this.accountService.updateNickname(nickname, accountId)
    }
}

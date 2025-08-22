package com.example.powerclean.presentation.inbound.rest

import com.example.powerclean.application.inbound.AccountAuthenticateUseCase
import com.example.powerclean.application.service.AccountService
import com.example.powerclean.presentation.dto.AuthenticationReqDto
import com.example.powerclean.presentation.dto.AuthenticationResDto
import com.example.powerclean.presentation.dto.RegisterAccountReqDto
import com.example.powerclean.presentation.dto.RegisterAccountResDto
import io.swagger.v3.oas.annotations.Operation
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

// 가설: 인바운드 상황에서 port는 service 구현체들의 명세서로 사용되고, adaptor에서는 구현체를 바로 사용해서 의존성을 내부로 향하게 유지한다.
@RestController
@RequestMapping("/account")
class AccountController(
    private val accountService: AccountService,
    private val authenticationService: AccountAuthenticateUseCase,
) {
    @Operation(summary = "회원 가입 API", description = "새로운 계정을 등록합니다.")
    @PostMapping("/register")
    fun registerAccount(
        @RequestBody requestDto: RegisterAccountReqDto,
    ): RegisterAccountResDto {
        // TODO: 이메일 인증 로직 추가.
        val registeredAccount = this.accountService.registerAccount(requestDto)
        val authenticationResponse: AuthenticationResDto =
            authenticationService.authentication(
                AuthenticationReqDto(registeredAccount.email, requestDto.password),
            )
        return RegisterAccountResDto.of(authenticationResponse.accessToken, authenticationResponse.refreshToken)
    }

    // @Operation(summary = "로그인 API", description = "사용자 인증을 수행합니다.")
    // @PostMapping("/login")
    // fun login(@RequestBody requestDto: LoginReqDto): LoginResDto {
    //     return this.accountService.login(requestDto)
    // }

    // @Operation(summary = "사용자 정보 조회 API", description = "사용자의 정보를 조회합니다.")
    // @GetMapping("/info")
    // fun getUserInfo(): GetUserInfoResDto {
    //     return this.accountService.getUserInfo()
    // }

    @Operation(summary = "닉네임 수정 API", description = "사용자의 닉네임을 수정합니다.")
    @PatchMapping("/nickname/{nickname}")
    fun updateNickname(
        @PathVariable nickname: String,
    ): String {
        // TODO: accountId는 jwt에서 획득하기.
        return this.accountService.updateNickname(nickname, "accountId")
    }
}

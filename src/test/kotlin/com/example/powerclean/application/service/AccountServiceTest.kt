import com.example.powerclean.application.port.inbound.AccountAuthenticateUseCase
import com.example.powerclean.application.port.outbound.persistence.AccountRepository
import com.example.powerclean.application.service.AccountService
import com.example.powerclean.domain.model.Account
import com.example.powerclean.presentation.dto.AuthenticationResDto
import com.example.powerclean.presentation.dto.LoginReqDto
import com.example.powerclean.presentation.dto.RegisterAccountReqDto
import com.fasterxml.uuid.Generators
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.Mockito
import org.mockito.Mockito.`when`
import org.mockito.kotlin.any
import org.springframework.security.crypto.password.PasswordEncoder
import java.util.Optional
import java.util.UUID
import javax.security.auth.login.AccountNotFoundException

class AccountServiceTest {
    private lateinit var accountRepository: AccountRepository
    private lateinit var authenticateUseCase: AccountAuthenticateUseCase
    private lateinit var passwordEncoder: PasswordEncoder
    private lateinit var accountService: AccountService

    @BeforeEach
    fun setUp() {
        accountRepository = Mockito.mock(AccountRepository::class.java)
        authenticateUseCase = Mockito.mock(AccountAuthenticateUseCase::class.java)
        passwordEncoder = Mockito.mock(PasswordEncoder::class.java)
        accountService = AccountService(accountRepository, authenticateUseCase, passwordEncoder)
    }

    @Test
    fun `회원가입시_비밀번호는_인코딩되어_저장된다`() {
        // Given
        val rawPassword = "plainPassword123!"
        val encodedPassword = "encodedPasswordHash"
        val request = RegisterAccountReqDto.of("user@example.com", rawPassword)

        `when`(passwordEncoder.encode(rawPassword)).thenReturn(encodedPassword)
        // Stub repository.save to return the same account (simulate that JPA saved it)
        Mockito.doAnswer { invocation ->
            val arg = invocation.getArgument<Account>(0)
            // Ensure the Account passed to save has encoded password
            assertEquals(encodedPassword, arg.password)
            assertEquals("user@example.com", arg.email)
            assertEquals("user@example.com", arg.nickname)
            arg
        }.`when`(accountRepository).save(any())

        // When
        val saved: Account = accountService.registerAccount(request)

        // Then
        Mockito.verify(passwordEncoder).encode(rawPassword)
        assertEquals(encodedPassword, saved.password)
        assertEquals("user@example.com", saved.email)
        assertEquals("user@example.com", saved.nickname)
        assertNotNull(saved.id)
        assertNotNull(saved.createdAt)
        assertNotNull(saved.updatedAt)
    }

    @Test
    fun `로그인시_인증서비스에_위임하고_토큰_정보를_반환한다`() {
        // Given
        val req = LoginReqDto(email = "user@example.com", password = "secret!")
        val access = "access-token-123"
        val refresh = "refresh-token-456"
        `when`(authenticateUseCase.authentication(any())).thenReturn(AuthenticationResDto(access, refresh))

        // When
        val res = accountService.login(req)

        // Then
        assertEquals(access, res.accessToken)
        assertEquals(refresh, res.refreshToken)
        Mockito.verify(authenticateUseCase).authentication(any())
    }

    @Test
    fun `닉네임_수정시_리포지토리를_호출하고_성공메시지를_반환한다`() {
        // Given
        val nickname = "new-nickname"
        val accountId = Generators.timeBasedEpochGenerator().generate()
        `when`(accountRepository.updateNicknameById(accountId, nickname)).thenReturn("ok")

        // When
        val res = accountService.updateNickname(nickname, accountId)

        // Then
        assertEquals("닉네임이 수정되었습니다.", res)
        Mockito.verify(accountRepository).updateNicknameById(accountId, nickname)
    }

    @Test
    fun `계정정보_조회시_존재하면_DTO로_반환한다`() {
        // Given
        val account = Account(nickname = "nick", email = "user@example.com", password = "pw")
        val accountId = account.id
        `when`(accountRepository.findById(accountId)).thenReturn(Optional.of(account))

        // When
        val info = accountService.getAccountInfo(accountId)

        // Then
        assertEquals(account.email, info.email)
        assertEquals(account.nickname, info.nickname)
        assertNotNull(info.createdAt)
        assertNotNull(info.updatedAt)
    }

    @Test
    fun `계정정보_조회시_없으면_AccountNotFoundException을_던진다`() {
        // Given
        val id = UUID.randomUUID()
        `when`(accountRepository.findById(id)).thenReturn(Optional.empty())

        // When / Then
        assertThrows(AccountNotFoundException::class.java) {
            accountService.getAccountInfo(id)
        }
    }
}

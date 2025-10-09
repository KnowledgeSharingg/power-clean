package com.example.powerclean.config.security

import com.example.powerclean.application.port.outbound.persistence.AccountRepository
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException

class JwtUserDetailsService(
    private val accountRepository: AccountRepository,
) : UserDetailsService {
    private val logger = org.slf4j.LoggerFactory.getLogger(JwtUserDetailsService::class.java)
    override fun loadUserByUsername(email: String): CustomUser {
        val user =
            accountRepository.findByEmail(email)
                ?: throw UsernameNotFoundException("User $email not found!")

        return CustomUser(
            // TODO: personalInfo.name not-null로 변경 ?
            username = user.personalInfo?.name ?: user.email,
            email = user.email,
            password = user.password,
            id = user.id,
        )
    }
}

package com.example.powerclean.application.service

import com.example.powerclean.application.outbound.AccountRepository
import org.springframework.security.core.userdetails.User
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException

class JwtUserDetailsService(
    private val accountRepository: AccountRepository,
) : UserDetailsService {
    override fun loadUserByUsername(email: String): UserDetails {
        val user =
            accountRepository.findByEmail(email)
                ?: throw UsernameNotFoundException("User $email not found!")

        return User.builder()
            .username(user.email)
            .password(user.password)
//            .roles(user.role.name)
            .build()
    }
}

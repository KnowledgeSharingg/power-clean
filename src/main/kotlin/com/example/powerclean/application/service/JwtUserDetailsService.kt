package com.example.powerclean.application.service

import com.example.powerclean.application.outbound.AccountRepository
import org.springframework.security.core.userdetails.User
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException

class JwtUserDetailsService(
    private val accountRepository: AccountRepository,
) : UserDetailsService {
    override fun loadUserByUsername(username: String): UserDetails {
        // TODO: name을 받고 account의 personalInfo VO 안에 name을 비교해서 찾도록.
        val user =
            accountRepository.findByNickname(username)
                ?: throw UsernameNotFoundException("User $username not found!")

        return User.builder()
            .username(user.nickname)
            .password(user.password)
//            .roles(user.role.name)
            .build()
    }
}

package com.example.powerclean.config

import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.userdetails.UserDetails
import java.util.UUID

data class CustomUser(
    val id: UUID,
    private val email: String,
    private val password: String,
    private val username: String,
) : UserDetails {
    override fun getAuthorities(): Collection<GrantedAuthority> = this.authorities

    override fun getPassword(): String = this.password

    override fun getUsername(): String = this.username

    fun getEmail(): String = this.email
}

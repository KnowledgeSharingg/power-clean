package com.example.powerclean.presentation.inbound.filter

import com.example.powerclean.application.service.JwtUserDetailsService
import com.example.powerclean.application.service.TokenService
import com.example.powerclean.config.CustomUser
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter

@Component
class JwtAuthorizationFilter(
    // TODO: JwtUserDetailService의 커스텀한 CustomerUser를 반환하기위해 UserDetailsService를 의존하던것을 구현체 의존하도록 변경했다. UserDetailsService를 의존하는게 좋을 것 같다.
    private val userDetailsService: JwtUserDetailsService,
    private val tokenService: TokenService,
) : OncePerRequestFilter() {
    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain,
    ) {
        val authorizationHeader: String? = request.getHeader("Authorization")

        if (null != authorizationHeader && authorizationHeader.startsWith("Bearer ")) {
            try {
                val token: String = authorizationHeader.substringAfter("Bearer ")
                val username: String = tokenService.extractUsername(token)

                // TODO: 해당 조건문 뭔지 확인해보기.
                if (SecurityContextHolder.getContext().authentication == null) {
                    val userDetails: CustomUser = userDetailsService.loadUserByUsername(username)

                    if (username == userDetails.username) {
                        UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.authorities,
                        ).apply {
                            details = WebAuthenticationDetailsSource().buildDetails(request)
                        }.also {
                            // TODO: 해당 security context가 세팅되면 서비스로직에서는 해당 context만 사용하면된다 ?
                            SecurityContextHolder.getContext().authentication = it
                        }
                    }
                }
            } catch (ex: Exception) {
                response.contentType = "application/json"
                response.writer.write(
                    "{\"error\": \"Filter Authorization error: ${ex.message?.replace("\"", "\\\"")
                        ?: "unknown error"}\"}",
                )
            }
        }

        filterChain.doFilter(request, response)
    }
}

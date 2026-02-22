package com.example.powerclean.presentation.outbound

import com.example.powerclean.application.port.outbound.TokenProvider
import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import java.util.Base64
import java.util.Date
import javax.crypto.spec.SecretKeySpec

@Component
class JwtTokenProvider(
    @Value("\${jwt.secret-key}") private val secret: String = "",
) : TokenProvider {
    private val signingKey: SecretKeySpec
        get() {
            val keyBytes: ByteArray = Base64.getDecoder().decode(secret)
            return SecretKeySpec(keyBytes, 0, keyBytes.size, "HmacSHA256")
        }

    override fun generateToken(
        subject: String,
        expiration: Date,
        additionalClaims: Map<String, Any>,
    ): String {
        return Jwts.builder()
            .claims(additionalClaims)
            .subject(subject)
            .issuedAt(Date(System.currentTimeMillis()))
            .expiration(expiration)
            .signWith(signingKey)
            .compact()
    }

    override fun extractUsername(token: String): String {
        return extractAllClaims(token).subject
    }

    private fun extractAllClaims(token: String): Claims {
        return Jwts.parser()
            .verifyWith(signingKey)
            .build()
            .parseSignedClaims(token)
            .payload
    }
}

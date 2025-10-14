package com.example.powerclean.application.port.outbound

import java.util.Date

interface TokenProvider {
    fun generateToken(
        subject: String,
        expiration: Date,
        additionalClaims: Map<String, Any> = emptyMap(),
    ): String

    fun extractUsername(token: String): String
}

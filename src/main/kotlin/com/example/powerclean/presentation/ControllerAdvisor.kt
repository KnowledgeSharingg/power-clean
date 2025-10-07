package com.example.powerclean.presentation

import com.example.powerclean.common.exception.CommonException
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import java.time.LocalDateTime

@RestControllerAdvice
class ControllerAdvisor {
    @ExceptionHandler(CommonException::class)
    fun handleCommonException(e: CommonException): ResponseEntity<CommonExceptionResponse> {
        val body =
            CommonExceptionResponse(
                e.code.status,
                e.message,
                e.code.code,
                LocalDateTime.now().toString(),
                "",
            )

        return ResponseEntity.status(e.code.status).body(body)
    }

    @ExceptionHandler(Exception::class)
    fun handleException(e: Exception): ResponseEntity<CommonExceptionResponse> {
        if (e is CommonException) return handleCommonException(e)
        val body =
            CommonExceptionResponse(
                500,
                e.message ?: "Internal Server Error",
                "E500",
                LocalDateTime.now().toString(),
                "",
            )

        println("ControllerAdvisor:handleException: e.message - ${e.message}")
        return ResponseEntity.status(500).body(body)
    }
}

data class CommonExceptionResponse(
    val statusCode: Number,
    val message: String,
    val errorCode: String,
    val timestamp: String,
    val result: String,
)

package com.example.powerclean.presentation

import com.example.powerclean.common.exception.CommonException
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import java.time.LocalDateTime

@RestControllerAdvice
class ControllerAdvisor {
    @ExceptionHandler(CommonException::class)
    fun handleException(e: CommonException): ResponseEntity<CommonExceptionResponse> {
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
}

data class CommonExceptionResponse(
    val statusCode: Number,
    val message: String,
    val errorCode: String,
    val timestamp: String,
    val result: String,
)

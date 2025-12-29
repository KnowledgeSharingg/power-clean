package com.example.powerclean.presentation.inbound.rest.advisor

import com.example.powerclean.common.exception.CommonException
import org.slf4j.LoggerFactory
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import java.time.LocalDateTime

@RestControllerAdvice
class ControllerAdvisor {
    private val logger = LoggerFactory.getLogger(ControllerAdvisor::class.java)

    @ExceptionHandler(CommonException::class)
    fun handleCommonException(e: CommonException): ResponseEntity<CommonExceptionResponse> {
        val body =
            CommonExceptionResponse(
                e.code.status,
                e.message ?: "Unknown error",
                e.code.code,
                LocalDateTime.now().toString(),
                "",
            )

        logger.error("ControllerAdvisor:handleCommonException: e.message - ${e.message}", e)
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

        logger.error("ControllerAdvisor:handleException: e.message - ${e.message}", e)
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

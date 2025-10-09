package com.example.powerclean

import com.example.powerclean.common.exception.CommonException
import com.example.powerclean.common.exception.ExceptionCode
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class PowerCleanController {
    private val logger = org.slf4j.LoggerFactory.getLogger(PowerCleanController::class.java)
    @GetMapping("/health-check")
    fun healthCheck(): String {
        return "I'm healthy!"
    }

    @GetMapping("/exception-test")
    fun exceptionTest(): String {
        throw CommonException("This is an exception!", ExceptionCode.INTERNAL_ERROR)
    }
}

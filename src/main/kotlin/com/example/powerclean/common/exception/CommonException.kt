package com.example.powerclean.common.exception

class CommonException(override val message: String, val code: ExceptionCode) : Exception()

class CustomNotFoundException(override val message: String, val code: ExceptionCode = ExceptionCode.NOT_FOUND) :
    Exception()

class CustomIllegalArgumentException(
    override val message: String,
    val code: ExceptionCode = ExceptionCode.ILLEGAL_ARGUMENT,
) : Exception()

class CustomConflictException(
    override val message: String,
    val code: ExceptionCode = ExceptionCode.CONFLICT,
) : Exception()

class CustomInternalServerErrorException(
    override val message: String,
    val code: ExceptionCode = ExceptionCode.INTERNAL_ERROR,
) : Exception()

package com.example.powerclean.common.exception

open class CommonException(message: String, val code: ExceptionCode) : RuntimeException(message)

class CustomNotFoundException(message: String) : CommonException(message, ExceptionCode.NOT_FOUND)

class CustomIllegalArgumentException(message: String) : CommonException(message, ExceptionCode.ILLEGAL_ARGUMENT)

class CustomConflictException(message: String) : CommonException(message, ExceptionCode.CONFLICT)

class CustomInternalServerErrorException(message: String) : CommonException(message, ExceptionCode.INTERNAL_ERROR)

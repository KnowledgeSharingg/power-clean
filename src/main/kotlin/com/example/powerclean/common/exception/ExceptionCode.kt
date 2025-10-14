package com.example.powerclean.common.exception

enum class ExceptionCode(
    val status: Int,
    val code: String,
    val message: String,
) {
    INVALID_REQUEST(400, "E001", "잘못된 요청입니다."),
    UNAUTHORIZED(401, "E002", "인증이 필요합니다."),
    FORBIDDEN(403, "E003", "권한이 없습니다."),
    NOT_FOUND(404, "E004", "리소스를 찾을 수 없습니다."),
    INTERNAL_ERROR(500, "E999", "서버 내부 오류가 발생했습니다."),
    ILLEGAL_ARGUMENT(400, "E005", "유효하지 않은 인자가 전달되었습니다."),
    CONFLICT(409, "E006", "이미 존제하는 데이터입니다."),
    ;

    fun toErrorResponse(): Map<String, Any> {
        return mapOf(
            "status" to status,
            "code" to code,
            "message" to message,
        )
    }
}

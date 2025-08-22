package com.example.powerclean.application.outbound

import com.example.powerclean.domain.model.Account
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

public interface AccountRepository {
    fun save(account: Account): Account

    fun findByNickname(nickname: String): Account?

    fun findByEmail(email: String): Account?

    fun findByName(name: String): Account?

    @Modifying
    @Query("UPDATE Account a SET a.nickname = :nickname WHERE a.id = :accountId")
    fun updateNicknameById(
        @Param("accountId") accountId: String,
        @Param("nickname") nickname: String,
    ): String

    // TODO: personalInfo value object 안의 name을 매핑해야한다.
    // fun findByName(name: String): Account?
}

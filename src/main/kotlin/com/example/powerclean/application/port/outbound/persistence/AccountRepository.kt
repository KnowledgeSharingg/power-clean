package com.example.powerclean.application.port.outbound.persistence

import com.example.powerclean.domain.model.Account
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import java.util.*

public interface AccountRepository {
    fun save(account: Account): Account

    fun findByNickname(nickname: String): Account?

    fun findByEmail(email: String): Account?

    fun findByPersonalInfo_Name(name: String): Account?

    fun findById(id: UUID): Optional<Account>

    @Modifying
    @Query("UPDATE Account a SET a.nickname = :nickname WHERE a.id = :accountId")
    fun updateNicknameById(
        @Param("accountId") accountId: UUID,
        @Param("nickname") nickname: String,
    ): String
}

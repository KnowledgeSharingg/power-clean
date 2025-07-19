package com.example.powerclean.domain.repository

import com.example.powerclean.domain.model.Account

public interface AccountRepository {
    fun save(account: Account): Account

    // TODO: personalInfo value object 안의 name을 매핑해야한다.
    // fun findByName(name: String): Account?
}

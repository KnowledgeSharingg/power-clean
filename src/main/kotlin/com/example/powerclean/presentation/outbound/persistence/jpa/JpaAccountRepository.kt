package com.example.powerclean.presentation.outbound.persistence.jpa

import com.example.powerclean.domain.model.Account
import com.example.powerclean.presentation.outbound.persistence.port.AccountRepository
import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

public interface JpaAccountRepository : JpaRepository<Account, UUID>, AccountRepository

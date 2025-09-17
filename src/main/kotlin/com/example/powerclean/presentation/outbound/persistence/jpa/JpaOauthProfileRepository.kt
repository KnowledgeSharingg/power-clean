package com.example.powerclean.presentation.outbound.persistence.jpa

import com.example.powerclean.application.port.outbound.persistence.OauthProfileRepository
import com.example.powerclean.domain.model.OauthProfile
import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

public interface JpaOauthProfileRepository : OauthProfileRepository, JpaRepository<OauthProfile, UUID>

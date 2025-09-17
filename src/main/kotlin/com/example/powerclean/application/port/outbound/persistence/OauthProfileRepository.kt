package com.example.powerclean.application.port.outbound.persistence

import com.example.powerclean.domain.model.OauthProfile

public interface OauthProfileRepository {
    fun save(oauthProfile: OauthProfile): OauthProfile
}

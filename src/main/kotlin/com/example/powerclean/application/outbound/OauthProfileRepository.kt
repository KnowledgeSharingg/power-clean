package com.example.powerclean.application.outbound

import com.example.powerclean.domain.model.OauthProfile

public interface OauthProfileRepository {
    fun save(oauthProfile: OauthProfile): OauthProfile
}

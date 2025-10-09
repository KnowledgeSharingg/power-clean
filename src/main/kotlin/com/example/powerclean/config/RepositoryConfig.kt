package com.example.powerclean.config

import com.example.powerclean.application.port.outbound.persistence.AccountRepository
import com.example.powerclean.application.port.outbound.persistence.BookRepository
import com.example.powerclean.application.port.outbound.persistence.OauthProfileRepository
import com.example.powerclean.application.port.outbound.persistence.PostRepository
import com.example.powerclean.application.port.outbound.persistence.ReviewRepository
import com.example.powerclean.presentation.outbound.persistence.jpa.JpaAccountRepository
import com.example.powerclean.presentation.outbound.persistence.jpa.JpaBookRepository
import com.example.powerclean.presentation.outbound.persistence.jpa.JpaOauthProfileRepository
import com.example.powerclean.presentation.outbound.persistence.jpa.JpaPostRepository
import com.example.powerclean.presentation.outbound.persistence.jpa.JpaReviewRepository
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class RepositoryConfig {
    private val logger = org.slf4j.LoggerFactory.getLogger(RepositoryConfig::class.java)
    /*
        @Bean을 메소드에 붙일 경우.
        해당 메소드의 리턴값이 타입, 메소드 명이 이름인 빈을 등록해준다.
     */
    @Bean
    fun accountRepository(jpaAccountRepository: JpaAccountRepository): AccountRepository = jpaAccountRepository

    @Bean
    fun bookRepository(jpaBookRepository: JpaBookRepository): BookRepository = jpaBookRepository

    @Bean
    fun oauthProfileRepository(jpaOauthProfileRepository: JpaOauthProfileRepository): OauthProfileRepository =
        jpaOauthProfileRepository

    @Bean
    fun postRepository(jpaPostRepository: JpaPostRepository): PostRepository = jpaPostRepository

    @Bean
    fun reviewRepository(jpaReviewRepository: JpaReviewRepository): ReviewRepository = jpaReviewRepository
}

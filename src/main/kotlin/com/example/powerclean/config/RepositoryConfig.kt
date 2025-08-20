package com.example.powerclean.config

import com.example.powerclean.domain.repository.BookRepository
import com.example.powerclean.domain.repository.OauthProfileRepository
import com.example.powerclean.domain.repository.PostRepository
import com.example.powerclean.domain.repository.ReviewRepository
import com.example.powerclean.domain.repository.orm.jpa.JpaBookRepository
import com.example.powerclean.domain.repository.orm.jpa.JpaOauthProfileRepository
import com.example.powerclean.domain.repository.orm.jpa.JpaPostRepository
import com.example.powerclean.domain.repository.orm.jpa.JpaReviewRepository
import com.example.powerclean.presentation.outbound.persistence.jpa.JpaAccountRepository
import com.example.powerclean.presentation.outbound.persistence.port.AccountRepository
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class RepositoryConfig {
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

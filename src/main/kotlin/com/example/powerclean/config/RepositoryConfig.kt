package com.example.powerclean.config

import com.example.powerclean.domain.repository.AccountRepository
import com.example.powerclean.domain.repository.BookRepository
import com.example.powerclean.domain.repository.OauthProfileRepository
import com.example.powerclean.domain.repository.PostRepository
import com.example.powerclean.domain.repository.ReviewRepository
import com.example.powerclean.domain.repository.orm.jpa.JpaAccountRepository
import com.example.powerclean.domain.repository.orm.jpa.JpaBookRepository
import com.example.powerclean.domain.repository.orm.jpa.JpaOauthProfileRepository
import com.example.powerclean.domain.repository.orm.jpa.JpaPostRepository
import com.example.powerclean.domain.repository.orm.jpa.JpaReviewRepository
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class RepositoryConfig {
    @Bean
    fun accountRepository(jpaAccountRepository: JpaAccountRepository): AccountRepository {
        return jpaAccountRepository
    }

    @Bean
    fun bookRepository(jpaBookRepository: JpaBookRepository): BookRepository {
        return jpaBookRepository
    }

    @Bean
    fun oauthProfileRepository(jpaOauthProfileRepository: JpaOauthProfileRepository): OauthProfileRepository {
        return jpaOauthProfileRepository
    }

    @Bean
    fun postRepository(jpaPostRepository: JpaPostRepository): PostRepository {
        return jpaPostRepository
    }

    @Bean
    fun reviewRepository(jpaReviewRepository: JpaReviewRepository): ReviewRepository {
        return jpaReviewRepository
    }
}

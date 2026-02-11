package com.example.powerclean.application.port.outbound.persistence

import com.example.powerclean.domain.model.PostTag
import java.util.UUID

public interface PostTagRepository {
    fun save(postTag: PostTag): PostTag

    fun findAllByPostId(postId: UUID): List<PostTag>

    fun findAllByTagId(tagId: UUID): List<PostTag>

    fun deleteAllByPostId(postId: UUID)
}

package com.example.powerclean.application.port.outbound.persistence

import com.example.powerclean.domain.model.Tag
import java.util.Optional
import java.util.UUID

public interface TagRepository {
    fun save(tag: Tag): Tag

    fun findById(id: UUID): Optional<Tag>

    fun findByName(name: String): Tag?

    fun findAll(): List<Tag>

    fun findAllByNameIn(names: List<String>): List<Tag>

    fun deleteById(id: UUID)
}

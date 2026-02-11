package com.example.powerclean.presentation.outbound.persistence.jpa

import com.example.powerclean.application.port.outbound.persistence.TagRepository
import com.example.powerclean.domain.model.Tag
import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

public interface JpaTagRepository : JpaRepository<Tag, UUID>, TagRepository {
    override fun findByName(name: String): Tag?

    override fun findAllByNameIn(names: List<String>): List<Tag>
}

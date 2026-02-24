package com.example.powerclean.domain.model

import com.fasterxml.uuid.Generators
import jakarta.persistence.Id
import jakarta.persistence.MappedSuperclass
import java.time.LocalDateTime
import java.util.UUID

@MappedSuperclass
open class BaseEntity {
    // TODO: UUID v7 적용 , https://0soo.tistory.com/177
    @Id
    var id: UUID = Generators.timeBasedEpochGenerator().generate()
    var createdAt: LocalDateTime = LocalDateTime.now()
    var updatedAt: LocalDateTime = LocalDateTime.now()
    var deletedAt: LocalDateTime? = null
}

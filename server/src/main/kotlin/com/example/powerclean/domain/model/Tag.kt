package com.example.powerclean.domain.model

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Table

@Entity
@Table(name = "tag")
class Tag(
    @Column(name = "name", nullable = false, unique = true)
    var name: String,
) : BaseEntity()

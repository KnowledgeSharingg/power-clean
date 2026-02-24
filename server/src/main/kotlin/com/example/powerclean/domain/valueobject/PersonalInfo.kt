package com.example.powerclean.domain.valueobject

import jakarta.persistence.Column
import jakarta.persistence.Embeddable

@Embeddable
class PersonalInfo(
    @Column(name = "name", nullable = true)
    var name: String? = null,
    @Column(name = "date_of_birth", nullable = true)
    var dateOfBirth: String? = null,
    @Column(name = "phone_number", nullable = true)
    var phoneNumber: String? = null,
    @Column(name = "gender", nullable = true)
    var gender: String? = null,
)

package com.example.powerclean.domain.model

import com.example.powerclean.domain.valueobject.PersonalInfo
import io.kotest.core.spec.style.BehaviorSpec
import io.kotest.matchers.shouldBe
import io.mockk.every
import io.mockk.mockk

class AccountTest : BehaviorSpec({
    Given("Account") {
        val mockedPersonalInfo = mockk<PersonalInfo>()
        val account = Account("nickname", "email", "password", mockedPersonalInfo)

        When("getting the personal info") {
            every { mockedPersonalInfo.name } returns "Mocked Name"
            every { mockedPersonalInfo.dateOfBirth } returns "960707"
            every { mockedPersonalInfo.phoneNumber } returns "01012341234"
            every { mockedPersonalInfo.gender } returns "other"
            val personalInfoResult = account.personalInfo

            Then("it should return the mocked personal info") {
                personalInfoResult shouldBe mockedPersonalInfo
            }
        }
    }
})

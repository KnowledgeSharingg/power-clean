package com.example.powerclean.domain.model

import com.example.powerclean.domain.valueobject.AuthorInfo
import com.example.powerclean.utils.DEFAULT_BOOK_COVER_IMAGE_URL
import io.kotest.core.spec.style.BehaviorSpec
import io.kotest.matchers.shouldBe
import io.mockk.mockk

class BookTest : BehaviorSpec({
    Given("a Book object") {
        val authorInfo =
            AuthorInfo("John Doe", "960707", "01012341234", "male", "Borned in Ulsaan.")
        val post = mockk<Post>()
        val book = Book("Sample Book", "Sample Content", "samplelink.com",  DEFAULT_BOOK_COVER_IMAGE_URL, authorInfo, post)

        When("getting the book properties") {
            Then("the properties should match the values set during creation") {
                book.title shouldBe "Sample Book"
                book.content shouldBe "Sample Content"
                book.link shouldBe "samplelink.com"
                book.authorInfo shouldBe authorInfo
                book.post shouldBe post
            }
        }

        When("setting a new title") {
            val newTitle = "New Book Title"
            book.title = newTitle

            Then("the title should be updated") {
                book.title shouldBe newTitle
            }
        }

        When("setting a new content") {
            val newContent = "New Book Content"
            book.content = newContent

            Then("the content should be updated") {
                book.content shouldBe newContent
            }
        }

        When("setting a new link") {
            val newLink = "newlink.com"
            book.link = newLink

            Then("the link should be updated") {
                book.link shouldBe newLink
            }
        }

        When("setting a new author info") {
            val newAuthorInfo =
                AuthorInfo("Jane Smith", "950101", "01098765432", "female", "Borned in Seoul.")
            book.authorInfo = newAuthorInfo

            Then("the author info should be updated") {
                book.authorInfo shouldBe newAuthorInfo
            }
        }

        When("setting a new post") {
            val newPost = mockk<Post>()
            book.post = newPost

            Then("the post should be updated") {
                book.post shouldBe newPost
            }
        }
    }
})

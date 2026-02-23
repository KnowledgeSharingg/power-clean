package com.example.powerclean.presentation.inbound.rest

import com.example.powerclean.application.port.outbound.persistence.BookRepository
import com.example.powerclean.application.service.BookCollectorService
import com.example.powerclean.domain.model.Book
import com.example.powerclean.presentation.outbound.persistence.jpa.JpaBookRepository
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@Tag(name = "BookData", description = "도서 데이터 수집/조회 API")
@RestController
@RequestMapping("/api/v1/book-data")
class BookDataController(
    private val bookCollectorService: BookCollectorService,
    private val bookRepository: BookRepository,
    private val jpaBookRepository: JpaBookRepository,
) {
    @Operation(summary = "수동 수집 트리거", description = "베스트셀러/신간 데이터를 즉시 수집하고 INSERT SQL 파일을 생성합니다.")
    @PostMapping("/collect")
    fun triggerCollect(): ResponseEntity<Map<String, Any>> {
        val result = bookCollectorService.collectDaily()
        val count = bookRepository.count()
        return ResponseEntity.ok(
            mapOf(
                "message" to "수집 완료",
                "newBooksSaved" to result.savedCount,
                "totalBooks" to count,
                "sqlFiles" to result.sqlFiles,
            ),
        )
    }

    @Operation(summary = "키워드 검색 & 수집", description = "알라딘에서 키워드로 검색하고 DB에 저장 + INSERT SQL 파일 생성합니다.")
    @PostMapping("/search")
    fun searchAndCollect(
        @RequestParam query: String,
        @RequestParam(defaultValue = "20") maxResults: Int,
    ): ResponseEntity<Map<String, Any>> {
        val result = bookCollectorService.searchAndCollect(query, maxResults)
        return ResponseEntity.ok(
            mapOf(
                "query" to query,
                "newBooksSaved" to result.savedCount,
                "sqlFiles" to result.sqlFiles,
            ),
        )
    }

    @Operation(summary = "수집된 도서 목록 조회")
    @GetMapping
    fun getAllBooks(): ResponseEntity<List<Book>> {
        return ResponseEntity.ok(bookRepository.findAll())
    }

    @Operation(summary = "도서 상세 조회")
    @GetMapping("/{id}")
    fun getBookById(
        @org.springframework.web.bind.annotation.PathVariable id: java.util.UUID,
    ): ResponseEntity<Book> {
        val bookOptional = jpaBookRepository.findById(id)
        return if (bookOptional.isPresent) {
            ResponseEntity.ok(bookOptional.get())
        } else {
            ResponseEntity.notFound().build()
        }
    }

    @Operation(summary = "카테고리별 도서 조회")
    @GetMapping("/category")
    fun getByCategory(
        @RequestParam categoryId: Int,
    ): ResponseEntity<List<Book>> {
        return ResponseEntity.ok(bookRepository.findByCategoryId(categoryId))
    }

    @Operation(summary = "제목 키워드로 조회")
    @GetMapping("/search")
    fun searchByTitle(
        @RequestParam keyword: String,
    ): ResponseEntity<List<Book>> {
        return ResponseEntity.ok(bookRepository.findByTitleContaining(keyword))
    }

    @Operation(summary = "수집 통계")
    @GetMapping("/stats")
    fun getStats(): ResponseEntity<Map<String, Any>> {
        val total = bookRepository.count()
        return ResponseEntity.ok(
            mapOf(
                "totalBooks" to total,
                "categories" to BookCollectorService.TARGET_CATEGORIES,
            ),
        )
    }
}

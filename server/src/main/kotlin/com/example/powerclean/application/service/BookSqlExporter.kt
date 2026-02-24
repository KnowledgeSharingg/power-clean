package com.example.powerclean.application.service

import com.example.powerclean.domain.model.Book
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import java.io.File
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

/**
 * Book INSERT SQL 파일 생성기.
 * 수집 API 호출 시 INSERT 쿼리문을 .sql 파일로 출력한다.
 */
@Component
class BookSqlExporter(
    @Value("\${book-data.sql-export.dir:./sql-exports}") private val exportDir: String,
) {
    private val logger = LoggerFactory.getLogger(BookSqlExporter::class.java)

    /**
     * Book 리스트를 INSERT SQL 파일로 생성.
     * @return 생성된 파일 경로 (생성된 항목이 없으면 null)
     */
    fun export(
        books: List<Book>,
        source: String,
    ): String? {
        if (books.isEmpty()) return null

        val dir = File(exportDir)
        if (!dir.exists()) dir.mkdirs()

        val timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"))
        val fileName = "book_${source.lowercase()}_$timestamp.sql"
        val file = File(dir, fileName)

        val sb = StringBuilder()
        sb.appendLine("-- Book INSERT SQL")
        sb.appendLine("-- Source: $source")
        sb.appendLine("-- Generated: ${LocalDateTime.now()}")
        sb.appendLine("-- Count: ${books.size}")
        sb.appendLine()

        books.forEach { book ->
            sb.appendLine(toInsertSql(book))
        }

        file.writeText(sb.toString(), Charsets.UTF_8)
        logger.info("SQL export: ${file.absolutePath} (${books.size}건)")
        return file.absolutePath
    }

    private fun toInsertSql(book: Book): String {
        val now = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))
        return """INSERT INTO book (id, title, author, content, description, isbn13, isbn10, publisher, pub_date, price_sales, price_standard, cover_image_url, link, category_id, category_name, customer_review_rank, best_rank, source, created_at, updated_at, deleted_at) VALUES ('${book.id}', ${esc(
            book.title,
        )}, ${esc(
            book.author,
        )}, ${esc(
            book.content,
        )}, ${esc(
            book.description,
        )}, ${esc(
            book.isbn13,
        )}, ${esc(
            book.isbn10,
        )}, ${esc(
            book.publisher,
        )}, ${esc(
            book.pubDate,
        )}, ${book.priceSales}, ${book.priceStandard}, ${esc(
            book.coverImageUrl,
        )}, ${esc(
            book.link,
        )}, ${book.categoryId}, ${esc(
            book.categoryName,
        )}, ${book.customerReviewRank}, ${book.bestRank ?: "NULL"}, ${esc(book.source)}, '$now', '$now', NULL);"""
    }

    private fun esc(value: String): String {
        val escaped = value.replace("'", "''").replace("\\", "\\\\")
        return "'$escaped'"
    }
}

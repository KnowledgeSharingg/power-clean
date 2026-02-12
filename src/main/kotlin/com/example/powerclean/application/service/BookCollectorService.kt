package com.example.powerclean.application.service

import com.example.powerclean.application.port.outbound.api.AladinApiClient
import com.example.powerclean.application.port.outbound.api.dto.AladinBookItem
import com.example.powerclean.application.port.outbound.persistence.BookDataRepository
import com.example.powerclean.domain.model.BookData
import org.slf4j.LoggerFactory
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service

/**
 * 알라딘 API로부터 도서 데이터를 수집하는 서비스.
 * - 베스트셀러, 신간, 주목할만한 신간을 주기적으로 수집
 * - ISBN13 기준으로 중복 방지
 */
@Service
class BookCollectorService(
    private val aladinApiClient: AladinApiClient,
    private val bookDataRepository: BookDataRepository,
) {
    private val logger = LoggerFactory.getLogger(BookCollectorService::class.java)

    /**
     * 주요 카테고리별 베스트셀러 수집.
     * 카테고리 ID: 0(종합), 1(소설), 55890(경제/경영), 656(자기계발),
     *              798(IT/컴퓨터), 51071(인문), 170(과학)
     */
    companion object {
        val TARGET_CATEGORIES = mapOf(
            0 to "종합",
            1 to "소설/시/희곡",
            55890 to "경제경영",
            656 to "자기계발",
            798 to "컴퓨터/모바일",
            51071 to "인문학",
            170 to "과학",
            987 to "에세이",
        )
    }

    /**
     * 매일 새벽 3시(KST)에 자동 수집. cron = 초 분 시 일 월 요일
     */
    @Scheduled(cron = "0 0 18 * * *") // UTC 18:00 = KST 03:00
    fun collectDaily() {
        logger.info("=== 일일 도서 데이터 수집 시작 ===")
        var totalCollected = 0

        TARGET_CATEGORIES.forEach { (categoryId, categoryName) ->
            try {
                // 베스트셀러
                val bestSellers = aladinApiClient.getBestSellers(categoryId, 50)
                val savedBest = saveNewBooks(bestSellers.items, "BESTSELLER")
                logger.info("[$categoryName] 베스트셀러: ${bestSellers.items.size}건 조회, ${savedBest}건 신규 저장")
                totalCollected += savedBest

                // 신간
                val newBooks = aladinApiClient.getNewBooks(categoryId, 50)
                val savedNew = saveNewBooks(newBooks.items, "NEW")
                logger.info("[$categoryName] 신간: ${newBooks.items.size}건 조회, ${savedNew}건 신규 저장")
                totalCollected += savedNew

                // API rate limit 방지
                Thread.sleep(300)
            } catch (e: Exception) {
                logger.error("[$categoryName] 수집 실패", e)
            }
        }

        // 주목할만한 신간 (종합)
        try {
            val special = aladinApiClient.getNewSpecialBooks(0, 50)
            val savedSpecial = saveNewBooks(special.items, "NEW_SPECIAL")
            logger.info("[주목할만한 신간] ${special.items.size}건 조회, ${savedSpecial}건 신규 저장")
            totalCollected += savedSpecial
        } catch (e: Exception) {
            logger.error("[주목할만한 신간] 수집 실패", e)
        }

        logger.info("=== 일일 도서 데이터 수집 완료: 총 ${totalCollected}건 신규 저장 ===")
    }

    /**
     * 키워드로 수동 검색 & 저장
     */
    fun searchAndCollect(query: String, maxResults: Int = 20): Int {
        val result = aladinApiClient.searchBooks(query, maxResults)
        return saveNewBooks(result.items, "SEARCH")
    }

    /**
     * ISBN 중복 체크 후 저장. 신규 저장 건수 반환.
     */
    private fun saveNewBooks(items: List<AladinBookItem>, source: String): Int {
        var count = 0
        items.forEach { item ->
            if (item.isbn13.isNotBlank() && !bookDataRepository.existsByIsbn13(item.isbn13)) {
                val bookData = BookData.fromAladin(item, source)
                bookDataRepository.save(bookData)
                count++
            }
        }
        return count
    }
}

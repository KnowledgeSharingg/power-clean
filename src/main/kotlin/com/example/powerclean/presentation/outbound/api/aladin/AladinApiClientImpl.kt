package com.example.powerclean.presentation.outbound.api.aladin

import com.example.powerclean.application.port.outbound.api.AladinApiClient
import com.example.powerclean.application.port.outbound.api.dto.AladinBookItem
import com.example.powerclean.application.port.outbound.api.dto.AladinSearchResult
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import org.springframework.web.util.UriComponentsBuilder
import java.net.HttpURLConnection
import java.net.URI

/**
 * 알라딘 Open API 클라이언트 구현체.
 * https://docs.aladin.co.kr/docs
 */
@Component
class AladinApiClientImpl(
    @Value("\${aladin.api.ttb-key:}") private val ttbKey: String,
) : AladinApiClient {

    private val logger = LoggerFactory.getLogger(AladinApiClientImpl::class.java)
    private val mapper = jacksonObjectMapper()
    private val baseUrl = "http://www.aladin.co.kr/ttb/api"

    override fun searchBooks(query: String, maxResults: Int, start: Int): AladinSearchResult {
        val url = UriComponentsBuilder.fromHttpUrl("$baseUrl/ItemSearch.aspx")
            .queryParam("ttbkey", ttbKey)
            .queryParam("Query", query)
            .queryParam("QueryType", "Keyword")
            .queryParam("MaxResults", maxResults.coerceIn(1, 50))
            .queryParam("start", start)
            .queryParam("SearchTarget", "Book")
            .queryParam("output", "js")
            .queryParam("Version", "20131101")
            .queryParam("Cover", "Big")
            .build()
            .toUriString()

        return fetchAndParse(url)
    }

    override fun getBestSellers(categoryId: Int, maxResults: Int): AladinSearchResult {
        return fetchList("Bestseller", categoryId, maxResults)
    }

    override fun getNewBooks(categoryId: Int, maxResults: Int): AladinSearchResult {
        return fetchList("ItemNewAll", categoryId, maxResults)
    }

    override fun getNewSpecialBooks(categoryId: Int, maxResults: Int): AladinSearchResult {
        return fetchList("ItemNewSpecial", categoryId, maxResults)
    }

    override fun getBookDetail(isbn13: String): AladinBookItem? {
        val url = UriComponentsBuilder.fromHttpUrl("$baseUrl/ItemLookUp.aspx")
            .queryParam("ttbkey", ttbKey)
            .queryParam("itemIdType", "ISBN13")
            .queryParam("ItemId", isbn13)
            .queryParam("output", "js")
            .queryParam("Version", "20131101")
            .queryParam("Cover", "Big")
            .build()
            .toUriString()

        return fetchAndParse(url).items.firstOrNull()
    }

    /**
     * 리스트 API (베스트셀러, 신간 등) 공통 호출
     */
    private fun fetchList(queryType: String, categoryId: Int, maxResults: Int): AladinSearchResult {
        val url = UriComponentsBuilder.fromHttpUrl("$baseUrl/ItemList.aspx")
            .queryParam("ttbkey", ttbKey)
            .queryParam("QueryType", queryType)
            .queryParam("MaxResults", maxResults.coerceIn(1, 50))
            .queryParam("start", 1)
            .queryParam("SearchTarget", "Book")
            .queryParam("output", "js")
            .queryParam("Version", "20131101")
            .queryParam("CategoryId", categoryId)
            .queryParam("Cover", "Big")
            .build()
            .toUriString()

        return fetchAndParse(url)
    }

    private fun fetchAndParse(url: String): AladinSearchResult {
        logger.debug("Aladin API request: $url")

        if (ttbKey.isBlank()) {
            logger.warn("Aladin TTB key is not set. Returning empty result.")
            return AladinSearchResult()
        }

        val conn = URI(url).toURL().openConnection() as HttpURLConnection
        conn.requestMethod = "GET"
        conn.connectTimeout = 10_000
        conn.readTimeout = 10_000

        return try {
            val code = conn.responseCode
            if (code !in 200..299) {
                val error = conn.errorStream?.bufferedReader()?.readText() ?: "Unknown error"
                logger.error("Aladin API error ($code): $error")
                AladinSearchResult()
            } else {
                val body = conn.inputStream.bufferedReader(Charsets.UTF_8).readText()
                logger.debug("Aladin API response (${body.length} chars)")
                mapper.readValue<AladinSearchResult>(body)
            }
        } catch (e: Exception) {
            logger.error("Aladin API call failed", e)
            AladinSearchResult()
        } finally {
            conn.disconnect()
        }
    }
}

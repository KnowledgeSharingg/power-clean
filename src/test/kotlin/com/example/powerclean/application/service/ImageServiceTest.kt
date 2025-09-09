import com.example.powerclean.application.service.ImageService
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.mock.web.MockMultipartFile
import java.nio.file.Files
import java.nio.file.Paths

class ImageServiceTest {
    private val testUploadDir = "BookCoverImagesTest"
    private val uploadDirPath = Paths.get(testUploadDir)
    private lateinit var imageService: ImageService

    @BeforeEach
    fun setUp() {
        imageService = ImageService(Paths.get(testUploadDir))
        // 테스트 전 폴더를 삭제하여 없는 상태로 만듦
        if (Files.exists(uploadDirPath)) {
            uploadDirPath.toFile().deleteRecursively()
        }
    }

    @AfterEach
    fun tearDown() {
        // 테스트 후 생성된 파일/디렉토리 정리
        if (Files.exists(uploadDirPath)) {
            uploadDirPath.toFile().deleteRecursively()
        }
    }

    @Test
    fun `업로드하고자하는_이미지를_저장할_폴더가_없으면_폴더를_생성한다`() {
        // Given
        val mockFile =
            MockMultipartFile(
                "file",
                "test-image.jpg",
                "image/jpeg",
                "dummy content".toByteArray(),
            )

        // When
        imageService.uploadImage(mockFile)

        // Then
        Assertions.assertTrue(Files.exists(uploadDirPath))
    }

    @Test
    fun `저장된_이미지의_정적_경로는_도메인+저장되는폴더명+파일이름이다`() {
        // Given
        val originalFilename = "test-image.jpg"
        val mockFile =
            MockMultipartFile(
                "file",
                originalFilename,
                "image/jpeg",
                "dummy content".toByteArray(),
            )

        // When
        val imageUrl = imageService.uploadImage(mockFile)

        // Then
        val expectedUrl = "http://localhost:8080/BookCoverImages/$originalFilename"
        Assertions.assertEquals(expectedUrl, imageUrl)
    }

    @Test
    fun `이미지 업로드시 이미 업로드된 이미지이면 덮어쓴다`() {
        // Given
        val filename = "overwrite-test.jpg"
        val firstContent = "first content".toByteArray()
        val secondContent = "second content".toByteArray()

        val firstFile = MockMultipartFile("file", filename, "image/jpeg", firstContent)
        val secondFile = MockMultipartFile("file", filename, "image/jpeg", secondContent)

        // When
        imageService.uploadImage(firstFile)
        imageService.uploadImage(secondFile) // 같은 이름으로 다시 업로드 -> 덮어쓰기 기대

        // Then
        val savedPath = uploadDirPath.resolve(filename)
        Assertions.assertTrue(Files.exists(savedPath), "업로드 후 파일이 존재해야 합니다.")
        val savedBytes = Files.readAllBytes(savedPath)
        Assertions.assertArrayEquals(secondContent, savedBytes, "같은 이름의 파일 업로드 시 마지막 업로드한 내용으로 덮어써야 합니다.")
    }
}

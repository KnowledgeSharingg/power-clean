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
}

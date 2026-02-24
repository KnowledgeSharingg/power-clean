# Power Clean 📚

도서 추천/리뷰 서비스 - 모노레포

## 프로젝트 구조

```
power-clean/
├── server/    # 백엔드 서버 (Spring Boot / Kotlin)
├── client/    # 프론트엔드 클라이언트 (React)
├── admin/     # 관리자 페이지
└── README.md
```

## Docker Compose로 전체 실행

모든 서비스를 한 번에 실행할 수 있습니다.

```bash
# 환경 변수 설정
cp .env.example .env
# .env 파일을 열어 필요한 값 수정 (API 키 등)

# 전체 서비스 빌드 및 실행
docker compose up --build

# 백그라운드 실행
docker compose up --build -d

# 로그 확인
docker compose logs -f

# 종료
docker compose down

# 볼륨 포함 종료 (DB 데이터 삭제)
docker compose down -v
```

실행 후 접속:
- **Client**: http://localhost:3000
- **Admin**: http://localhost:3001
- **Server API**: http://localhost:8080

## 컴포넌트별 실행 방법

### Server
```bash
cd server
# 각 서브디렉토리의 README 참고
```

### Client
```bash
cd client
# 각 서브디렉토리의 README 참고
```

### Admin
```bash
cd admin
# 각 서브디렉토리의 README 참고
```

## 기존 레포지토리 (archived)
- [power-clean-server](https://github.com/KnowledgeSharingg/power-clean-server)
- [power-clean-client](https://github.com/KnowledgeSharingg/power-clean-client)
- [power-clean-admin](https://github.com/KnowledgeSharingg/power-clean-admin)

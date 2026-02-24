# AGENTS.md

This is a monorepo for "서책의 파도" (Waves of Books), a book recommendation/review platform with three sub-projects:

- **server/** — Kotlin + Spring Boot 3.4 API (Gradle, JDK 21)
- **client/** — Next.js 15 + React 19 + TypeScript frontend (pnpm)
- **admin/** — Next.js 14 + React 18 + TypeScript admin dashboard (npm)

---

## Build / Lint / Test Commands

### Server (Kotlin/Spring Boot)

```bash
# All commands run from the server/ directory
./gradlew build              # Full build (compile + test + lint)
./gradlew test               # Run all tests
./gradlew test --tests "com.example.powerclean.application.service.PostServiceTest"  # Single test class
./gradlew test --tests "*PostServiceTest.포스트_생성*"  # Single test method (Korean names)
./gradlew ktlintCheck        # Lint check (ktlint)
./gradlew ktlintFormat       # Auto-format
./gradlew jacocoTestReport   # Generate coverage report
./gradlew bootRun            # Run the application (port 8080)
```

### Client (Next.js 15)

```bash
# All commands run from the client/ directory using pnpm
pnpm install                 # Install dependencies
pnpm dev                     # Dev server with Turbopack (port 3000)
pnpm build                   # Production build
pnpm lint                    # ESLint (flat config, ESLint 9)
```

### Admin (Next.js 14)

```bash
# All commands run from the admin/ directory using npm
npm install                  # Install dependencies
npm run dev                  # Dev server (port 3001)
npm run build                # Production build
npm run lint                 # ESLint (classic config, ESLint 8)
```

### Docker (full stack)

```bash
# From the root directory
docker-compose up            # Start MySQL + server + client + admin
```

---

## Architecture

### Server — Hexagonal / Ports-and-Adapters

```
server/src/main/kotlin/com/example/powerclean/
├── domain/model/              # JPA entities (Post, Book, Account, Review, Tag)
├── application/
│   ├── port/inbound/          # Use case interfaces
│   ├── port/outbound/         # Repository & provider port interfaces
│   └── service/               # Business logic (implements inbound ports)
├── presentation/
│   ├── dto/                   # Request/Response DTOs (data classes)
│   ├── inbound/rest/          # REST controllers (driving adapters)
│   └── outbound/              # JPA repos, JWT, AI providers (driven adapters)
├── config/                    # Spring config (Security, Swagger, Web, CORS)
└── common/exception/          # Custom exception hierarchy
```

Port-adapter binding is done via explicit `@Bean` wiring in `RepositoryConfig.kt`.

### Client & Admin — Next.js App Router

```
src/
├── app/                       # Pages (App Router with page.tsx files)
│   └── components/            # Shared UI components
├── lib/
│   └── api.ts                 # Fetch-based API client with JWT auth
└── styles/                    # Global CSS (Tailwind)
```

---

## Code Style Guidelines

### TypeScript (client & admin)

**Imports:**
- Named imports for libraries and utility modules
- Default imports only for React components and Next.js built-ins (`Link`, `Image`)
- Use `@/*` path alias (maps to `./src/*`) for cross-directory imports
- Use relative imports for sibling-level files
- Order: React/framework hooks -> Next.js -> local libraries (`@/lib/...`) -> local components

**Types:**
- Prefer `interface` over `type` for object shapes
- No TypeScript enums; use union types for constrained strings (e.g., `"sm" | "md" | "lg"`)
- Use generics sparingly (mainly with `useState<T>`)
- `strict: true` is enabled; `@typescript-eslint/no-explicit-any` is disabled in client

**Components:**
- Function declarations with `export default` (e.g., `export default function PostCard({...})`)
- `"use client"` directive required for all interactive components
- Props defined via named `interface` with `Props` suffix (e.g., `PostCardProps`)
- Destructure props with default values in the function signature
- Inline type for simple `children`-only props: `{ children }: { children: React.ReactNode }`

**Functions:**
- `function` declarations for top-level and exported functions
- Arrow functions for event handlers, callbacks, and inline lambdas
- `async/await` everywhere; no `.then()` chains for multi-step operations
- Use IIFE pattern for async code inside `useEffect`
- Use `mounted` flag to prevent state updates after unmount

**State:**
- `useState` + `useEffect` only; no external state library
- `localStorage` for token persistence (check `typeof window !== "undefined"`)
- URL search params for filterable state
- Optimistic updates with rollback for like/bookmark interactions

**Error handling:**
- API functions: try/catch returning `boolean` or `null` on failure
- Server-fetch functions: throw on non-ok response
- Centralized 401 handler redirects to login page
- `console.error` with Korean descriptions for logging

**Naming:**
- Files: PascalCase for components (`PostCard.tsx`), camelCase for utilities (`api.ts`, `useAuth.ts`)
- Variables/functions: camelCase
- Boolean vars: `is`/`has` prefix or descriptive adjective (`isLoggedIn`, `liked`, `loading`)
- Constants: camelCase (`serverUrl`); UPPER_SNAKE_CASE acceptable for env-derived values (`API_URL`)
- No barrel files (no `index.ts` re-exports)

**Exports:**
- `export default` for React components
- Named exports for API functions, interfaces, and utility values

**Styling:**
- Tailwind CSS exclusively (no CSS modules, no styled-components)
- Custom theme colors defined in `tailwind.config.js` (client uses v4, admin uses v3)
- Custom utility classes: `site-container`, `card-padded`, `btn-primary`, `btn`

**Comments:**
- Section dividers with `// =========================` in long utility modules
- `{/* Section Name */}` JSX comments for layout sections
- Bilingual (Korean + English) comments accepted

### Kotlin (server)

**Formatting:**
- ktlint enforced; 4-space indent; 120 char max line length; LF line endings
- Wildcard imports allowed (`ktlint_standard_no-wildcard-imports = disabled`)
- Backtick function names allowed (`ktlint_standard_function-naming = disabled`)

**DTOs:**
- Kotlin `data class` for all request/response DTOs
- Naming: `Create|Get|Update` + `Entity` + `Req|Res` + `Dto` (e.g., `CreatePostReqDto`)

**Domain entities:**
- Use `companion object { fun from(dto): Entity }` factory methods for construction from DTOs
- Extend `BaseEntity` for shared `id`/`createdAt`/`updatedAt` fields

**Dependency injection:**
- Constructor injection via primary constructor parameters
- `@Service` on service classes, `@RestController` on controllers
- Port-adapter binding via `@Bean` methods in config classes

**Error handling:**
- Custom exception hierarchy: `CommonException` -> `CustomNotFoundException`, `CustomConflictException`
- Enum-based error codes in `ExceptionCode` (status, code, message)
- Global handler in `@RestControllerAdvice` (`ControllerAdvisor`)

**API documentation:**
- `@Operation(summary, description)` Swagger annotations on all controller endpoints
- KDoc comments on port interfaces

**Testing:**
- JUnit 5 + Mockito-Kotlin; no Spring context loading for unit tests
- Korean backtick test names: `` `포스트_생성_시_...` ``
- Given/When/Then structure with explicit comments
- `@BeforeEach` manual mock setup with constructor-injected service under test
- Tests located in `server/src/test/kotlin/` mirroring main source structure

---

## CI/CD

GitHub Actions workflow at `server/.github/workflows/main.yml`:
- Triggers on push to `main` and all PRs
- Runs `./gradlew test jacocoTestReport` on JDK 21 Temurin
- Uploads coverage to Codecov
- Posts test results as PR comments
- **CI covers server only** — no CI for client or admin

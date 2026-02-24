# https://spring.io/guides/gs/spring-boot-docker

FROM eclipse-temurin:21-jdk-jammy

WORKDIR /app

COPY build.gradle settings.gradle gradlew ./
COPY gradle ./gradle
COPY src ./src

RUN ./gradlew clean build -x test

ENTRYPOINT ["./gradlew","bootRun"]

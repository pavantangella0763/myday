# ---- Build stage: compile and package the Spring Boot jar ----
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Copy the POM first and pre-fetch dependencies (better layer caching).
COPY pom.xml .
RUN mvn -B dependency:go-offline

# Copy sources and build the executable jar (tests need a DB, so skip them here).
COPY src ./src
RUN mvn -B -DskipTests clean package

# ---- Run stage: small JRE image that just runs the jar ----
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# The host injects PORT; Spring Boot reads it via server.port in application.properties.
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]

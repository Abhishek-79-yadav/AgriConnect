un dev# ---------- Stage 1: Build the Spring Boot JAR with Maven ----------
FROM eclipse-temurin:21-jdk-jammy AS build
WORKDIR /app

# Copy wrapper + pom first so Docker can cache the dependency download
# layer separately from source code changes.
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
RUN chmod +x mvnw && ./mvnw dependency:go-offline -B

# Now copy the actual source and build the jar (skip tests for faster,
# more reliable container builds — run tests in CI separately).
COPY src src
RUN ./mvnw clean package -DskipTests -B

# ---------- Stage 2: Slim runtime image ----------
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Run as a non-root user
RUN useradd -ms /bin/bash spring
USER spring

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/app.jar"]

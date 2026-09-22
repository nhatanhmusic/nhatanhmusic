# Backend Nhat Anh — build bang Maven, chay bang JRE 21.
# Railway / Render / Fly tu nhan Dockerfile nay.

FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn -q -B dependency:go-offline
COPY src ./src
RUN mvn -q -B -DskipTests package

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/nhatanh-backend-0.1.0.jar app.jar

# Profile `server`: doc DB_URL, JWT_SECRET, ADMIN_PASSWORD... tu bien moi truong.
ENV SPRING_PROFILES_ACTIVE=server
ENV JAVA_OPTS="-Xmx384m"

EXPOSE 8080
CMD ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]

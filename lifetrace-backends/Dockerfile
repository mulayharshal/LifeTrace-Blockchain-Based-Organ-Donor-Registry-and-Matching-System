# Use lightweight Java image
FROM eclipse-temurin:17-jdk-alpine

# Set working directory
WORKDIR /app

# Copy jar file (make sure jar name matches)
COPY target/*.jar app.jar

# Expose port (Render uses 8080 by default)
EXPOSE 8080

# Run application
ENTRYPOINT ["java", "-jar", "app.jar"]
package com.example.demo.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;

@Configuration
public class FirebaseConfig {

    @Value("${firebase.database-url}")
    private String databaseUrl;

    @Bean
    public FirebaseApp firebaseApp() throws IOException {
        FirebaseOptions options;
        
        // Use the value from properties file, or override with environment variable if present
        String effectiveDatabaseUrl = System.getenv("FIREBASE_DATABASE_URL");
        if (effectiveDatabaseUrl == null || effectiveDatabaseUrl.isEmpty()) {
            effectiveDatabaseUrl = databaseUrl;
        }

        InputStream serviceAccount = null;
        try {
            // 1. Try classpath (local development)
            ClassPathResource resource = new ClassPathResource("serviceAccountKey.json");
            serviceAccount = resource.getInputStream();
        } catch (Exception e) {
            // 2. Try filesystem (Render Secret File mounted at root or /etc/secrets/)
            try {
                if (Files.exists(Paths.get("serviceAccountKey.json"))) {
                    serviceAccount = new FileInputStream("serviceAccountKey.json");
                } else if (Files.exists(Paths.get("/etc/secrets/serviceAccountKey.json"))) {
                    serviceAccount = new FileInputStream("/etc/secrets/serviceAccountKey.json");
                }
            } catch (Exception e2) {
                // Ignore and proceed to env var check
            }
        }

        if (serviceAccount != null) {
            options = new FirebaseOptions.Builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .setDatabaseUrl(effectiveDatabaseUrl)
                    .build();
        } else {
            // 3. Fallback for FIREBASE_CONFIG env var (JSON string)
            String jsonData = System.getenv("FIREBASE_CONFIG");
            if (jsonData != null && !jsonData.isEmpty()) {
                options = new FirebaseOptions.Builder()
                        .setCredentials(GoogleCredentials.fromStream(new java.io.ByteArrayInputStream(jsonData.getBytes())))
                        .setDatabaseUrl(effectiveDatabaseUrl)
                        .build();
            } else {
                throw new IOException("Firebase configuration not found. Please provide serviceAccountKey.json file or FIREBASE_CONFIG env var.");
            }
        }

        if (FirebaseApp.getApps().isEmpty()) {
            return FirebaseApp.initializeApp(options);
        }
        return FirebaseApp.getInstance();
    }
}
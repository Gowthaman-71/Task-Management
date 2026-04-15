package com.example.demo.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import java.io.IOException;
import java.io.InputStream;

@Configuration
public class FirebaseConfig {

    @Bean
    public FirebaseApp firebaseApp() throws IOException {
        FirebaseOptions options;
        try {
            ClassPathResource resource = new ClassPathResource("serviceAccountKey.json");
            InputStream serviceAccount = resource.getInputStream();
            options = new FirebaseOptions.Builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .setDatabaseUrl("https://task-with-spring-default-rtdb.firebaseio.com/")
                    .build();
        } catch (Exception e) {
            // Fallback for Render Secret Files or Environment Variables
            String jsonData = System.getenv("FIREBASE_CONFIG");
            if (jsonData != null && !jsonData.isEmpty()) {
                options = new FirebaseOptions.Builder()
                        .setCredentials(GoogleCredentials.fromStream(new java.io.ByteArrayInputStream(jsonData.getBytes())))
                        .setDatabaseUrl("https://task-with-spring-default-rtdb.firebaseio.com/")
                        .build();
            } else {
                throw new IOException("Firebase configuration not found. Please provide serviceAccountKey.json or FIREBASE_CONFIG env var.");
            }
        }

        if (FirebaseApp.getApps().isEmpty()) {
            return FirebaseApp.initializeApp(options);
        }
        return FirebaseApp.getInstance();
    }
}
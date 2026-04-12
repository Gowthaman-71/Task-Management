package com.example.demo.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;

@Configuration
public class FirebaseConfig {

    @Bean
    public FirebaseApp firebaseApp() throws IOException {
        InputStream serviceAccount;
        
        // Try to load from environment variable first (for production)
        String firebaseConfigJson = System.getenv("FIREBASE_ADMIN_SDK_CONFIG");
        if (firebaseConfigJson != null && !firebaseConfigJson.isEmpty()) {
            serviceAccount = new ByteArrayInputStream(firebaseConfigJson.getBytes());
        } else {
            // Fall back to classpath resource (for development)
            ClassPathResource resource = new ClassPathResource("serviceAccountKey.json");
            serviceAccount = resource.getInputStream();
        }

        FirebaseOptions options = new FirebaseOptions.Builder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                .setDatabaseUrl("https://task-manager-app-ace32-default-rtdb.firebaseio.com/")
                .build();

        return FirebaseApp.initializeApp(options);
    }
}
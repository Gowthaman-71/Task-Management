package com.example.demo.service;

import com.example.demo.model.Task;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class FirebaseService {

    @Value("${firebase.database-url}")
    private String databaseUrl;

    private RestTemplate restTemplate;

    @PostConstruct
    public void init() {
        this.restTemplate = new RestTemplate();
        if (!databaseUrl.endsWith("/")) {
            databaseUrl += "/";
        }
    }

    private String getBaseUrl() {
        return databaseUrl + "tasks.json";
    }

    private String getTaskUrl(String id) {
        return databaseUrl + "tasks/" + id + ".json";
    }

    public List<Task> getAllTasks() {
        try {
            ResponseEntity<Map<String, Task>> response = restTemplate.exchange(
                    getBaseUrl(),
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<Map<String, Task>>() {}
            );

            Map<String, Task> data = response.getBody();
            List<Task> tasks = new ArrayList<>();
            if (data != null) {
                for (Map.Entry<String, Task> entry : data.entrySet()) {
                    Task task = entry.getValue();
                    if (task != null) {
                        task.setId(entry.getKey());
                        tasks.add(task);
                    }
                }
            }
            return tasks;
        } catch (Exception e) {
            System.err.println("Error fetching tasks: " + e.getMessage());
            return new ArrayList<>();
        }
    }

    public Task addTask(Task task) {
        try {
            // Check for existing clientId first (optional, but consistent with previous logic)
            String clientId = task.getClientId();
            if (clientId != null && !clientId.isEmpty()) {
                List<Task> allTasks = getAllTasks();
                for (Task existing : allTasks) {
                    if (clientId.equals(existing.getClientId())) {
                        return existing;
                    }
                }
            }

            // Add the task
            Map<String, String> response = restTemplate.postForObject(getBaseUrl(), task, Map.class);
            if (response != null && response.containsKey("name")) {
                String id = response.get("name");
                task.setId(id);
                // Firebase REST API POST doesn't include the ID in the body, so we should set it
                restTemplate.put(getTaskUrl(id), task);
                return task;
            }
        } catch (Exception e) {
            System.err.println("Error adding task: " + e.getMessage());
        }
        return null;
    }

    public Task updateTask(String id, Task task) {
        try {
            task.setId(id);
            restTemplate.put(getTaskUrl(id), task);
            return task;
        } catch (Exception e) {
            System.err.println("Error updating task: " + e.getMessage());
            return null;
        }
    }

    public void deleteTask(String id) {
        try {
            restTemplate.delete(getTaskUrl(id));
        } catch (Exception e) {
            System.err.println("Error deleting task: " + e.getMessage());
        }
    }
}
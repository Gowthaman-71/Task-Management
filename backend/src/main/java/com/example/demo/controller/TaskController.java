package com.example.demo.controller;

import com.example.demo.model.Task;
import com.example.demo.service.FirebaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "https://task-manager-frontend.onrender.com"})
public class TaskController {

    @Autowired
    private FirebaseService firebaseService;

    @PostMapping
    public Task addTask(@RequestBody Task task) {
        return firebaseService.addTask(task);
    }

    @GetMapping
    public List<Task> getTasks() {
        return firebaseService.getAllTasks();
    }

    @PutMapping("/{id}")
    public Task updateTask(@PathVariable String id, @RequestBody Task task) {
        return firebaseService.updateTask(id, task);
    }

    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable String id) {
        firebaseService.deleteTask(id);
    }
}
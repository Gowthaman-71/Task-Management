package com.example.demo.controller;

import com.example.demo.model.Task;
import com.example.demo.service.FirebaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/tasks")
@CrossOrigin(origins = "*")
public class TaskController {

    @Autowired
    private FirebaseService firebaseService;

    @PostMapping
    public Task addTask(@RequestBody Task task) {
        Task createdTask = firebaseService.addTask(task);
        if (createdTask == null) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to add task to Firebase.");
        }
        return createdTask;
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
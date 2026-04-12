package com.example.demo.service;

import com.example.demo.model.Task;
import com.google.firebase.FirebaseApp;
import com.google.firebase.database.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CountDownLatch;

@Service
public class FirebaseService {

    @Autowired
    private FirebaseApp firebaseApp;

    private DatabaseReference database;

    @PostConstruct
    public void init() {
        database = FirebaseDatabase.getInstance(firebaseApp).getReference("tasks");
    }

    public List<Task> getAllTasks() {
        List<Task> tasks = new ArrayList<>();
        CountDownLatch latch = new CountDownLatch(1);

        database.addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                for (DataSnapshot snapshot : dataSnapshot.getChildren()) {
                    Task task = snapshot.getValue(Task.class);
                    if (task != null) {
                        task.setId(snapshot.getKey());
                        tasks.add(task);
                    }
                }
                latch.countDown();
            }

            @Override
            public void onCancelled(DatabaseError databaseError) {
                System.err.println("Error fetching tasks: " + databaseError.getMessage());
                latch.countDown();
            }
        });

        try {
            latch.await();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        return tasks;
    }

    public Task addTask(Task task) {
        DatabaseReference ref = database.push();
        task.setId(ref.getKey());
        ref.setValue(task, (databaseError, databaseReference) -> {
            if (databaseError != null) {
                System.err.println("Error adding task: " + databaseError.getMessage());
            }
        });
        return task;
    }

    public Task updateTask(String id, Task task) {
        database.child(id).setValue(task, (databaseError, databaseReference) -> {
            if (databaseError != null) {
                System.err.println("Error updating task: " + databaseError.getMessage());
            }
        });
        return task;
    }

    public void deleteTask(String id) {
        database.child(id).removeValue((databaseError, databaseReference) -> {
            if (databaseError != null) {
                System.err.println("Error deleting task: " + databaseError.getMessage());
            }
        });
    }
}
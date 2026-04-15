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
        if (firebaseApp != null) {
            database = FirebaseDatabase.getInstance(firebaseApp).getReference("tasks");
        } else {
            System.err.println("Firebase Service not initialized: missing credentials.");
        }
    }

    public List<Task> getAllTasks() {
        List<Task> tasks = new ArrayList<>();
        if (database == null) return tasks;
        
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
            if (!latch.await(10, java.util.concurrent.TimeUnit.SECONDS)) {
                System.err.println("Timeout waiting for Firebase response");
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        return tasks;
    }

    public Task addTask(Task task) {
        if (database == null) {
            System.err.println("Cannot add task: Firebase not initialized.");
            return null;
        }
        String clientId = task.getClientId();

        if (clientId != null && !clientId.isEmpty()) {
            CountDownLatch queryLatch = new CountDownLatch(1);
            final Task[] existingTask = new Task[1];

            Query query = database.orderByChild("clientId").equalTo(clientId);
            query.addListenerForSingleValueEvent(new ValueEventListener() {
                @Override
                public void onDataChange(DataSnapshot snapshot) {
                    for (DataSnapshot child : snapshot.getChildren()) {
                        Task found = child.getValue(Task.class);
                        if (found != null) {
                            found.setId(child.getKey());
                            existingTask[0] = found;
                            break;
                        }
                    }
                    queryLatch.countDown();
                }

                @Override
                public void onCancelled(DatabaseError databaseError) {
                    System.err.println("Error checking duplicate task: " + databaseError.getMessage());
                    queryLatch.countDown();
                }
            });

            try {
                if (!queryLatch.await(5, java.util.concurrent.TimeUnit.SECONDS)) {
                    System.err.println("Timeout checking for duplicate task");
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }

            if (existingTask[0] != null) {
                return existingTask[0];
            }
        }

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
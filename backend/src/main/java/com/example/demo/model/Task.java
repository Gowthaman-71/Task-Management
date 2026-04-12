package com.example.demo.model;

public class Task {
    private String id;
    private String title;
    private String assignee;
    private String priority;
    private String status;

    public Task() {}

    public Task(String id, String title, String assignee, String priority, String status) {
        this.id = id;
        this.title = title;
        this.assignee = assignee;
        this.priority = priority;
        this.status = status;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAssignee() {
        return assignee;
    }

    public void setAssignee(String assignee) {
        this.assignee = assignee;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
package com.example.GradingSystem.model;

import jakarta.persistence.*;

@Entity
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private int subject1;
    private int subject2;
    private int subject3;
    private int subject4;
    private int subject5;

    private double average;
    private String grade;

    // Constructors
    public Student() {
    }

    public Student(String name, int subject1, int subject2, int subject3, int subject4, int subject5) {
        this.name = name;
        this.subject1 = subject1;
        this.subject2 = subject2;
        this.subject3 = subject3;
        this.subject4 = subject4;
        this.subject5 = subject5;
        calculateGrade();
    }

    // Calculate Average and Grade
    public void calculateGrade() {
        this.average = (subject1 + subject2 + subject3 + subject4 + subject5) / 5.0;
        if (average >= 90)
            grade = "A";
        else if (average >= 80)
            grade = "B";
        else if (average >= 70)
            grade = "C";
        else if (average >= 60)
            grade = "D";
        else
            grade = "F";
    }

    // Getters & Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getSubject1() {
        return subject1;
    }

    public void setSubject1(int subject1) {
        this.subject1 = subject1;
    }

    public int getSubject2() {
        return subject2;
    }

    public void setSubject2(int subject2) {
        this.subject2 = subject2;
    }

    public int getSubject3() {
        return subject3;
    }

    public void setSubject3(int subject3) {
        this.subject3 = subject3;
    }

    public int getSubject4() {
        return subject4;
    }

    public void setSubject4(int subject4) {
        this.subject4 = subject4;
    }

    public int getSubject5() {
        return subject5;
    }

    public void setSubject5(int subject5) {
        this.subject5 = subject5;
    }

    public double getAverage() {
        return average;
    }

    public void setAverage(double average) {
        this.average = average;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }
}

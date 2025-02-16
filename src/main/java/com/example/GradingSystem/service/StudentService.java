package com.example.GradingSystem.service;

import com.example.GradingSystem.model.Student;
import com.example.GradingSystem.Repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {

    @Autowired
    private StudentRepository repository;

    public List<Student> getAllStudents() {
        return repository.findAll();
    }

    public Student getStudentById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public Student addStudent(Student student) {
        student.calculateGrade();
        return repository.save(student);
    }

    public Student updateStudent(Long id, Student studentDetails) {
        Student student = repository.findById(id).orElse(null);
        if (student != null) {
            student.setName(studentDetails.getName());
            student.setSubject1(studentDetails.getSubject1());
            student.setSubject2(studentDetails.getSubject2());
            student.setSubject3(studentDetails.getSubject3());
            student.setSubject4(studentDetails.getSubject4());
            student.setSubject5(studentDetails.getSubject5());
            student.calculateGrade();
            return repository.save(student);
        }
        return null;
    }

    public void deleteStudent(Long id) {
        repository.deleteById(id);
    }
}

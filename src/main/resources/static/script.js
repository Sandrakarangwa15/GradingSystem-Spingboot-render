<<<<<<< HEAD
const form = document.getElementById("studentForm");
const tableBody = document.querySelector("#studentTable tbody");

// Track if we're editing an existing student
let editMode = false;
let editStudentId = null;

// Handle Form Submission (Create or Update)
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const student = {
        name: document.getElementById("name").value,
        subject1: Number(document.getElementById("subject1").value),
        subject2: Number(document.getElementById("subject2").value),
        subject3: Number(document.getElementById("subject3").value),
        subject4: Number(document.getElementById("subject4").value),
        subject5: Number(document.getElementById("subject5").value),
    };

    if (editMode) {
        // Update Existing Student
        await fetch(`https://gradingsystem-spingboot-render.onrender.com/students/${editStudentId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(student),
        });
        
        editMode = false;
        editStudentId = null;
        form.querySelector("button").textContent = "Submit"; // Reset button text
    } else {
        // Create New Student
        await fetch("https://gradingsystem-spingboot-render.onrender.com/students", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(student),
        });
=======
// Initialize form elements
const form = document.getElementById("studentForm");
const tableBody = document.querySelector("#studentTable tbody");
let editMode = false;
let editStudentId = null;

// Form submission handler
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const studentData = {
        name: document.getElementById("name").value,
        subject1: parseFloat(document.getElementById("subject1").value),
        subject2: parseFloat(document.getElementById("subject2").value),
        subject3: parseFloat(document.getElementById("subject3").value),
        subject4: parseFloat(document.getElementById("subject4").value),
        subject5: parseFloat(document.getElementById("subject5").value)
    };

    try {
        if (editMode) {
            // Update existing student
            await fetch(`https://gradingsystem-spingboot-render.onrender.com/students/${editStudentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(studentData)
            });
            alert('Student updated successfully!');
        } else {
            // Create new student
            await fetch('https://gradingsystem-spingboot-render.onrender.com/students', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(studentData)
            });
            alert('Student added successfully!');
        }

        // Reset form and refresh table
        form.reset();
        editMode = false;
        editStudentId = null;
        form.querySelector("button[type='submit']").textContent = "Submit";
        fetchStudents();

    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while saving the student data.');
>>>>>>> f8cb31d320e0829178ee4d698d309dbe7e1df640
    }

    form.reset(); // Clear form after submission
    fetchStudents(); // Refresh table
});

<<<<<<< HEAD
// Fetch & Display Students
async function fetchStudents() {
    const res = await fetch("https://gradingsystem-spingboot-render.onrender.com/students");
    const students = await res.json();

    tableBody.innerHTML = ""; // Clear existing rows
    students.forEach((student) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${student.name}</td>
            <td>${((student.subject1 + student.subject2 + student.subject3 + student.subject4 + student.subject5) / 5).toFixed(2)}</td>
            <td>${getGrade((student.subject1 + student.subject2 + student.subject3 + student.subject4 + student.subject5) / 5)}</td>
            <td class="action-buttons">
                <button class="edit-btn" onclick="editStudent(${student.id}, '${student.name}', ${student.subject1}, ${student.subject2}, ${student.subject3}, ${student.subject4}, ${student.subject5})">Edit</button>
                <button class="delete-btn" onclick="deleteStudent(${student.id})">Delete</button>
=======
// Fetch and display students
async function fetchStudents() {
    try {
        const response = await fetch('https://gradingsystem-spingboot-render.onrender.com/students');
        const students = await response.json();
        displayStudents(students);
    } catch (error) {
        console.error('Error:', error);
        alert('Error fetching student data');
    }
}

// Display students in table
function displayStudents(students) {
    tableBody.innerHTML = '';
    
    students.forEach(student => {
        const average = calculateAverage(student);
        const grade = getGrade(average);
        
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${student.name}</td>
            <td>${student.subject1.toFixed(1)}</td>
            <td>${student.subject2.toFixed(1)}</td>
            <td>${student.subject3.toFixed(1)}</td>
            <td>${student.subject4.toFixed(1)}</td>
            <td>${student.subject5.toFixed(1)}</td>
            <td>${average.toFixed(1)}</td>
            <td><span class="grade-badge grade-${grade}">${grade}</span></td>
            <td>
                <button onclick="editStudent(${student.id})" class="btn btn-success btn-sm">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button onclick="deleteStudent(${student.id})" class="btn btn-danger btn-sm">
                    <i class="fas fa-trash"></i> Delete
                </button>
>>>>>>> f8cb31d320e0829178ee4d698d309dbe7e1df640
            </td>
        `;
        tableBody.appendChild(row);
    });

    updateStatistics(students);
}

<<<<<<< HEAD
// Populate Form with Existing Data for Editing
function editStudent(id, name, subject1, subject2, subject3, subject4, subject5) {
    document.getElementById("name").value = name;
    document.getElementById("subject1").value = subject1;
    document.getElementById("subject2").value = subject2;
    document.getElementById("subject3").value = subject3;
    document.getElementById("subject4").value = subject4;
    document.getElementById("subject5").value = subject5;

    editMode = true;
    editStudentId = id;
    form.querySelector("button").textContent = "Update";
}

// Delete Student
async function deleteStudent(id) {
    if (confirm("Are you sure you want to delete this record?")) {
        await fetch(`https://gradingsystem-spingboot-render.onrender.com/students/${id}`, { method: "DELETE" });
        fetchStudents();
    }
}

// Get Grade Based on Average
=======
// Calculate average
function calculateAverage(student) {
    return (student.subject1 + student.subject2 + student.subject3 + 
            student.subject4 + student.subject5) / 5;
}

// Get grade
>>>>>>> f8cb31d320e0829178ee4d698d309dbe7e1df640
function getGrade(average) {
    if (average >= 90) return "A";
    if (average >= 80) return "B";
    if (average >= 70) return "C";
    if (average >= 60) return "D";
    return "F";
}

<<<<<<< HEAD
// Load Students on Page Load
fetchStudents();
=======
// Edit student
async function editStudent(id) {
    try {
        const response = await fetch(`https://gradingsystem-spingboot-render.onrender.com/students/${id}`);
        const student = await response.json();

        document.getElementById("name").value = student.name;
        document.getElementById("subject1").value = student.subject1;
        document.getElementById("subject2").value = student.subject2;
        document.getElementById("subject3").value = student.subject3;
        document.getElementById("subject4").value = student.subject4;
        document.getElementById("subject5").value = student.subject5;

        editMode = true;
        editStudentId = id;
        form.querySelector("button[type='submit']").textContent = "Update";
    } catch (error) {
        console.error('Error:', error);
        alert('Error fetching student data for editing');
    }
}

// Delete student
async function deleteStudent(id) {
    if (confirm("Are you sure you want to delete this record?")) {
        try {
            await fetch(`https://gradingsystem-spingboot-render.onrender.com/students/${id}`, {
                method: 'DELETE'
            });
            alert('Student deleted successfully!');
            fetchStudents();
        } catch (error) {
            console.error('Error:', error);
            alert('Error deleting student');
        }
    }
}

// Update statistics
function updateStatistics(students) {
    const totalStudents = students.length;
    let totalAverage = 0;
    let highestGrade = "F";
    
    students.forEach(student => {
        const avg = calculateAverage(student);
        totalAverage += avg;
        const grade = getGrade(avg);
        if (grade < highestGrade) highestGrade = grade;
    });

    const overallAverage = totalStudents > 0 ? totalAverage / totalStudents : 0;

    document.getElementById('totalStudents').textContent = totalStudents;
    document.getElementById('averageGrade').textContent = overallAverage.toFixed(1) + '%';
    document.getElementById('topGrade').textContent = highestGrade;
}

// Input validation
document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener('input', (e) => {
        let value = parseFloat(e.target.value);
        if (value < 0) e.target.value = 0;
        if (value > 100) e.target.value = 100;
    });
});

// Load data when page loads
document.addEventListener('DOMContentLoaded', fetchStudents);
>>>>>>> f8cb31d320e0829178ee4d698d309dbe7e1df640

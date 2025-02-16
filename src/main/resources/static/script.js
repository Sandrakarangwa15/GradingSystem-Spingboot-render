// Configuration
const API_BASE_URL = 'https://gradingsystem-spingboot-render.onrender.com';
const TOAST_CONFIG = {
    closeButton: true,
    progressBar: true,
    positionClass: "toast-top-right",
    timeOut: 3000
};

// Initialize toastr
toastr.options = TOAST_CONFIG;

// Form handling
const form = document.getElementById("studentForm");
const loadingSpinner = document.getElementById("loadingSpinner");
let editMode = false;
let editStudentId = null;

// Input validation
document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener('input', (e) => {
        let value = parseFloat(e.target.value);
        if (value < 0) e.target.value = 0;
        if (value > 100) e.target.value = 100;
    });
});

// Form submission
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    try {
        showLoading();
        
        const formData = {
            name: document.getElementById("name").value.trim(),
            subject1: parseFloat(document.getElementById("subject1").value),
            subject2: parseFloat(document.getElementById("subject2").value),
            subject3: parseFloat(document.getElementById("subject3").value),
            subject4: parseFloat(document.getElementById("subject4").value),
            subject5: parseFloat(document.getElementById("subject5").value),
        };

        // Validation
        if (!validateForm(formData)) return;

        const url = editMode 
            ? `${API_BASE_URL}/students/${editStudentId}`
            : `${API_BASE_URL}/students`;
        
        const response = await fetch(url, {
            method: editMode ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });

        if (!response.ok) throw new Error('Network response was not ok');

        toastr.success(`Student successfully ${editMode ? 'updated' : 'added'}!`);
        resetForm();
        await fetchStudents();
        updateStatistics();
        
    } catch (error) {
        toastr.error(`Error: ${error.message}`);
    } finally {
        hideLoading();
    }
});

// Validation function
function validateForm(data) {
    if (data.name.length < 2) {
        toastr.error("Name must be at least 2 characters long");
        return false;
    }

    const marks = [data.subject1, data.subject2, data.subject3, data.subject4, data.subject5];
    
    for (let mark of marks) {
        if (isNaN(mark) || mark < 0 || mark > 100) {
            toastr.error("Marks must be between 0 and 100");
            return false;
        }
    }

    return true;
}

// Fetch and display students
async function fetchStudents() {
    try {
        showLoading();
        
        const response = await fetch(`${API_BASE_URL}/students`);
        if (!response.ok) throw new Error('Failed to fetch students');
        
        const students = await response.json();
        displayStudents(students);
        updateStatistics(students);
        
    } catch (error) {
        toastr.error(`Error fetching students: ${error.message}`);
    } finally {
        hideLoading();
    }
}

// Display students in table
function displayStudents(students) {
    const tableBody = document.querySelector("#studentTable tbody");
    tableBody.innerHTML = "";

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
                <button class="btn btn-success btn-sm" onclick="editStudent(${student.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteStudent(${student.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Calculate average marks
function calculateAverage(student) {
    return (student.subject1 + student.subject2 + student.subject3 + 
            student.subject4 + student.subject5) / 5;
}

// Get grade based on average
function getGrade(average) {
    if (average >= 90) return "A";
    if (average >= 80) return "B";
    if (average >= 70) return "C";
    if (average >= 60) return "D";
    return "F";
}

// Edit student
async function editStudent(id) {
    try {
        showLoading();
        
        const response = await fetch(`${API_BASE_URL}/students/${id}`);
        if (!response.ok) throw new Error('Failed to fetch student');
        
        const student = await response.json();
        
        // Populate form
        document.getElementById("name").value = student.name;
        document.getElementById("subject1").value = student.subject1;
        document.getElementById("subject2").value = student.subject2;
        document.getElementById("subject3").value = student.subject3;
        document.getElementById("subject4").value = student.subject4;
        document.getElementById("subject5").value = student.subject5;

        editMode = true;
        editStudentId = id;
        form.querySelector("button[type='submit']").innerHTML = '<i class="fas fa-save"></i> Update';
        
    } catch (error) {
        toastr.error(`Error editing student: ${error.message}`);
    } finally {
        hideLoading();
    }
}

// Delete student
async function deleteStudent(id) {
    if (!confirm('Are you sure you want to delete this student?')) return;
    
    try {
        showLoading();
        
        const response = await fetch(`${API_BASE_URL}/students/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Failed to delete student');
        
        toastr.success('Student successfully deleted!');
        await fetchStudents();
        updateStatistics();
        
    } catch (error) {
        toastr.error(`Error deleting student: ${error.message}`);
    } finally {
        hideLoading();
    }
}

// Update statistics
function updateStatistics(students) {
    if (!students) return;
    
    const totalStudents = students.length;
    let totalAverage = 0;
    let topGrade = 'F';
    
    students.forEach(student => {
        const average = calculateAverage(student);
        totalAverage += average;
        const grade = getGrade(average);
        if (grade < topGrade) topGrade = grade;
    });
    
    const overallAverage = totalStudents > 0 ? totalAverage / totalStudents : 0;
    
    document.getElementById('totalStudents').textContent = totalStudents;
    document.getElementById('averageGrade').textContent = overallAverage.toFixed(1) + '%';
    document.getElementById('topGrade').textContent = topGrade;
}

// Reset form
function resetForm() {
    form.reset();
    editMode = false;
    editStudentId = null;
    form.querySelector("button[type='submit']").innerHTML = '<i class="fas fa-save"></i> Submit';
}

// Loading spinner handlers
function showLoading() {
    loadingSpinner.style.display = 'block';
}

function hideLoading() {
    loadingSpinner.style.display = 'none';
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    fetchStudents();
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + S to submit form
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        form.dispatchEvent(new Event('submit'));
    }
    
    // Esc to reset form
    if (e.key === 'Escape') {
        e.preventDefault();
        resetForm();
    }
});
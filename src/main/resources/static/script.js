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
        await fetch(`http://localhost:8080/students/${editStudentId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(student),
        });
        
        editMode = false;
        editStudentId = null;
        form.querySelector("button").textContent = "Submit"; // Reset button text
    } else {
        // Create New Student
        await fetch("http://localhost:8080/students", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(student),
        });
    }

    form.reset(); // Clear form after submission
    fetchStudents(); // Refresh table
});

// Fetch & Display Students
async function fetchStudents() {
    const res = await fetch("http://localhost:8080/students");
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
            </td>
        `;
        tableBody.appendChild(row);
    });
}

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
        await fetch(`http://localhost:8080/students/${id}`, { method: "DELETE" });
        fetchStudents();
    }
}

// Get Grade Based on Average
function getGrade(average) {
    if (average >= 90) return "A";
    if (average >= 80) return "B";
    if (average >= 70) return "C";
    if (average >= 60) return "D";
    return "F";
}

// Load Students on Page Load
fetchStudents();

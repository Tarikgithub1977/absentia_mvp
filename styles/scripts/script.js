// Variables globales
let moodleUrl = "http://localhost:8000";
let moodleToken = "";

// Événements
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", handleLogin);
    }

    const menuToggle = document.querySelector(".menu-toggle");
    if (menuToggle) {
        menuToggle.addEventListener("click", toggleSidebar);
    }

    // Fermer les modals en cliquant à l'extérieur
    window.addEventListener("click", (e) => {
        if (e.target.classList.contains("modal")) {
            closeAllModals();
        }
    });
});

// Fonctions
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    if (email && password && role) {
        localStorage.setItem("userRole", role);
        localStorage.setItem("userEmail", email);

        switch (role) {
            case "admin":
                window.location.href = "dashboard.html";
                break;
            case "teacher":
                window.location.href = "teacher.html";
                break;
            case "student":
                window.location.href = "student.html";
                break;
            case "parent":
                window.location.href = "parent.html";
                break;
        }
    } else {
        alert("Veuillez remplir tous les champs");
    }
}

function toggleSidebar() {
    const sidebar = document.querySelector(".sidebar");
    sidebar.classList.toggle("open");
}

function closeAllModals() {
    document.querySelectorAll(".modal").forEach(modal => {
        modal.style.display = "none";
    });
}

function importFromMoodle() {
    document.getElementById("importMoodleModal").style.display = "flex";
}

function closeImportModal() {
    document.getElementById("importMoodleModal").style.display = "none";
}

function saveMoodleConfig() {
    moodleUrl = document.getElementById("moodleUrl").value;
    moodleToken = document.getElementById("moodleToken").value;

    if (!moodleUrl || !moodleToken) {
        alert("Veuillez remplir tous les champs");
        return;
    }

    localStorage.setItem("moodleUrl", moodleUrl);
    localStorage.setItem("moodleToken", moodleToken);

    document.getElementById("moodleStatus").textContent = "Connecté";
    document.getElementById("moodleStatus").style.color = "#10B981";

    closeImportModal();
    alert("Configuration Moodle enregistrée !");
}

function openAttendanceModal() {
    document.getElementById("attendanceModal").style.display = "flex";
}

function closeAttendanceModal() {
    document.getElementById("attendanceModal").style.display = "none";
}

function saveAttendance() {
    alert("Présences enregistrées avec succès !");
    closeAttendanceModal();
}

// ===== Variables globales =====
let currentCourse = "";
let currentClass = "";
let currentChild = "";

// ===== DOM Elements =====
const loginForm = document.getElementById("loginForm");
const attendanceModal = document.getElementById("attendanceModal");
const uploadModal = document.getElementById("uploadModal");
const sidebar = document.querySelector(".sidebar");
const menuToggle = document.querySelector(".menu-toggle");

// ===== Événements =====
if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
}

if (menuToggle) {
    menuToggle.addEventListener("click", toggleSidebar);
}

// ===== Fonctions =====
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    // Simulation de connexion (à remplacer par un vrai backend)
    if (email && password && role) {
        // Rediriger vers la page appropriée en fonction du rôle
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
            default:
                alert("Rôle non reconnu");
        }
    } else {
        alert("Veuillez remplir tous les champs");
    }
}

function toggleSidebar() {
    sidebar.classList.toggle("open");
}

// ===== Fonctions pour l'interface Enseignant =====
function markAttendance(course, className) {
    currentCourse = course;
    currentClass = className;

    // Mettre à jour le titre du modal
    document.getElementById("modalCourseTitle").textContent = `Marquer les présences - ${course}`;
    document.getElementById("modalClass").textContent = className;
    document.getElementById("modalDate").textContent = new Date().toLocaleDateString("fr-FR");

    // Afficher le modal
    attendanceModal.style.display = "flex";
}

function closeModal() {
    attendanceModal.style.display = "none";
}

function saveAttendance() {
    // Récupérer toutes les radios cochées
    const attendanceData = [];
    const radioGroups = document.querySelectorAll('.attendance-options input[type="radio"]:checked');

    radioGroups.forEach(radio => {
        const studentName = radio.closest('.student-attendance').querySelector('.student-name').textContent;
        attendanceData.push({
            student: studentName,
            status: radio.value
        });
    });

    // Simulation d'envoi au serveur
    console.log("Données d'absence enregistrées :", {
        course: currentCourse,
        class: currentClass,
        date: new Date().toISOString(),
        attendance: attendanceData
    });

    // Fermer le modal
    closeModal();

    // Afficher un message de succès
    alert(`Présences enregistrées pour ${currentCourse} (${currentClass}) !`);
}

// ===== Fonctions pour l'interface Étudiant =====
function openUploadModal(course, date) {
    document.getElementById("uploadModalTitle").textContent = `Upload justificatif - ${course} (${date})`;
    uploadModal.style.display = "flex";
}

function closeUploadModal() {
    uploadModal.style.display = "none";
}

function submitJustificatif() {
    const type = document.getElementById("justificatifType").value;
    const file = document.getElementById("justificatifFile").files[0];
    const comment = document.getElementById("justificatifComment").value;

    if (!file) {
        alert("Veuillez sélectionner un fichier");
        return;
    }

    // Simulation d'envoi au serveur
    console.log("Justificatif envoyé :", {
        type,
        file: file.name,
        comment,
        course: document.getElementById("uploadModalTitle").textContent
    });

    // Fermer le modal
    closeUploadModal();

    // Afficher un message de succès
    alert("Justificatif envoyé avec succès ! Il sera validé par l'administration sous 24h.");
}

// ===== Fonctions pour l'interface Parent =====
function selectChild(name, className) {
    currentChild = name;

    // Mettre à jour le tableau de bord
    document.getElementById("childDashboard").style.display = "grid";
    document.getElementById("childAbsencesTitle").textContent = `Absences de ${name}`;

    // Simulation de données (à remplacer par un appel API)
    const absencesList = document.getElementById("childAbsencesList");
    absencesList.innerHTML = `
        <tr>
            <td>Algorithmique Avancée</td>
            <td>20/04/2026</td>
            <td><span class="badge badge-warning">Non justifiée</span></td>
            <td>-</td>
        </tr>
        <tr>
            <td>Bases de Données</td>
            <td>18/04/2026</td>
            <td><span class="badge badge-success">Justifiée</span></td>
            <td><span class="justificatif-status">Certificat médical</span></td>
        </tr>
    `;

    // Mettre à jour les stats
    document.getElementById("childPresenceRate").textContent = "98%";
    document.getElementById("childAbsences").textContent = "2";
    document.getElementById("childJustified").textContent = "1";
}

function initCharts() {
    // Chart pour le tableau de bord admin
    if (document.getElementById("attendanceChart")) {
        const ctx = document.getElementById("attendanceChart").getContext("2d");
        new Chart(ctx, {
            type: "line",
            data: {
                labels: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
                datasets: [{
                    label: "Taux de présence (%)",
                    data: [95, 92, 98, 90, 88, 95, 97],
                    borderColor: "rgba(59, 130, 246, 1)",
                    backgroundColor: "rgba(59, 130, 246, 0.1)",
                    borderWidth: 2,
                    tension: 0.3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 80,
                        max: 100
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    // Chart pour l'interface étudiant
    if (document.getElementById("studentChart")) {
        const ctx = document.getElementById("studentChart").getContext("2d");
        new Chart(ctx, {
            type: "doughnut",
            data: {
                labels: ["Présences", "Absences justifiées", "Absences non justifiées"],
                datasets: [{
                    data: [12, 2, 1],
                    backgroundColor: [
                        "rgba(16, 185, 129, 0.8)",
                        "rgba(245, 158, 11, 0.8)",
                        "rgba(239, 68, 68, 0.8)"
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: "bottom"
                    }
                }
            }
        });
    }
}

// Initialiser les graphiques au chargement de la page
document.addEventListener("DOMContentLoaded", () => {
    initCharts();

    // Fermer les modals en cliquant à l'extérieur
    window.addEventListener("click", (e) => {
        if (e.target === attendanceModal) {
            closeModal();
        }
        if (e.target === uploadModal) {
            closeUploadModal();
        }
    });
});

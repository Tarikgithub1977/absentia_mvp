// Fonction pour charger les étudiants
async function loadStudents() {
    try {
        const response = await fetch('http://localhost:5000/api/students');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const students = await response.json();
        displayStudents(students);
    } catch (error) {
        console.error('Erreur lors du chargement des étudiants:', error);
    }
}

// Fonction pour ajouter un étudiant
async function addStudent(name) {
    try {
        const response = await fetch('http://localhost:5000/api/students', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: name, present: true }),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const newStudent = await response.json();
        console.log('Étudiant ajouté:', newStudent);
        loadStudents(); // Recharge la liste des étudiants
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'étudiant:', error);
    }
}

// Fonction pour afficher les étudiants
function displayStudents(students) {
    const studentsList = document.getElementById('students-list');
    studentsList.innerHTML = '';
    students.forEach(student => {
        const studentElement = document.createElement('div');
        studentElement.innerHTML = `
            <p>${student.name} <input type="checkbox" ${student.present ? 'checked' : ''} onchange="markAbsent(${student.id}, this.checked)"></p>
        `;
        studentsList.appendChild(studentElement);
    });
}

// Fonction pour marquer un étudiant comme absent
async function markAbsent(studentId, isPresent) {
    try {
        const response = await fetch(`http://localhost:5000/api/students/${studentId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ present: isPresent }),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const updatedStudent = await response.json();
        console.log('Statut de présence mis à jour:', updatedStudent);
    } catch (error) {
        console.error('Erreur lors de la mise à jour du statut de présence:', error);
    }
}

// Fonction pour charger les professeurs
async function loadTeachers() {
    try {
        const response = await fetch('http://localhost:5000/api/teachers');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const teachersData = await response.json();
        window.teachers = teachersData; // Stocker les professeurs dans une variable globale
        displayTeachers(teachersData);
    } catch (error) {
        console.error('Erreur lors du chargement des professeurs:', error);
    }
}

// Fonction pour ajouter un professeur
async function addTeacher(name) {
    try {
        const response = await fetch('http://localhost:5000/api/teachers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: name }),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const newTeacher = await response.json();
        console.log('Professeur ajouté:', newTeacher);
        loadTeachers(); // Recharge la liste des professeurs
    } catch (error) {
        console.error('Erreur lors de l\'ajout du professeur:', error);
    }
}

// Fonction pour afficher les professeurs
function displayTeachers(teachers) {
    const teachersList = document.getElementById('teachers-list');
    teachersList.innerHTML = '';
    teachers.forEach(teacher => {
        const teacherElement = document.createElement('div');
        teacherElement.innerHTML = `
            <p>${teacher.name}</p>
        `;
        teachersList.appendChild(teacherElement);
    });
}

// Fonction pour charger les modules
async function loadModules() {
    try {
        const response = await fetch('http://localhost:5000/api/modules');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const modules = await response.json();
        displayModules(modules);
    } catch (error) {
        console.error('Erreur lors du chargement des modules:', error);
    }
}

// Fonction pour afficher les modules
function displayModules(modules) {
    const modulesList = document.getElementById('modules-list');
    modulesList.innerHTML = '';
    modules.forEach(module => {
        const moduleElement = document.createElement('div');
        const teacherName = getTeacherName(module.teacher_id);
        moduleElement.innerHTML = `
            <p>${module.name} - Professeur: ${teacherName || 'Non affecté'}</p>
            <select onchange="assignTeacherToModule(${module.id}, this.value)">
                <option value="">Sélectionnez un professeur</option>
                ${getTeacherOptions(module.teacher_id)}
            </select>
        `;
        modulesList.appendChild(moduleElement);
    });
}

// Fonction pour obtenir le nom d'un professeur
function getTeacherName(teacherId) {
    if (!window.teachers) return null;
    const teacher = window.teachers.find(t => t.id == teacherId);
    return teacher ? teacher.name : null;
}

// Fonction pour obtenir les options des professeurs
function getTeacherOptions(selectedTeacherId) {
    if (!window.teachers) return '';
    let options = '';
    window.teachers.forEach(teacher => {
        const selected = teacher.id == selectedTeacherId ? 'selected' : '';
        options += `<option value="${teacher.id}" ${selected}>${teacher.name}</option>`;
    });
    return options;
}

// Fonction pour affecter un professeur à un module
async function assignTeacherToModule(moduleId, teacherId) {
    try {
        const response = await fetch(`http://localhost:5000/api/modules/${moduleId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ teacher_id: teacherId }),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const updatedModule = await response.json();
        console.log('Module mis à jour:', updatedModule);
        loadModules(); // Recharge la liste des modules
    } catch (error) {
        console.error('Erreur lors de l\'affectation du professeur:', error);
    }
}

// Fonction pour configurer le formulaire d'ajout d'étudiant
function setupAddStudentForm() {
    const form = document.getElementById('add-student-form');
    form.onsubmit = function(e) {
        e.preventDefault();
        const nameInput = document.getElementById('student-name');
        const name = nameInput.value.trim();
        if (name) {
            addStudent(name);
            nameInput.value = '';
        }
    };
}

// Fonction pour configurer le formulaire d'ajout de professeur
function setupAddTeacherForm() {
    const form = document.getElementById('add-teacher-form');
    form.onsubmit = function(e) {
        e.preventDefault();
        const nameInput = document.getElementById('teacher-name');
        const name = nameInput.value.trim();
        if (name) {
            addTeacher(name);
            nameInput.value = '';
        }
    };
}

// Appeler les fonctions au chargement de la page
window.onload = function() {
    loadStudents();
    loadTeachers();
    loadModules();
    setupAddStudentForm();
    setupAddTeacherForm();
};

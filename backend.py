from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Liste des étudiants
students = [
    {"id": 1, "name": "Jean Dupont", "present": True},
    {"id": 2, "name": "Marie Martin", "present": False},
]

# Liste des professeurs
teachers = [
    {"id": 1, "name": "Pierre Dupuis"},
    {"id": 2, "name": "Sophie Lambert"},
]

# Liste des modules
modules = [
    {"id": 1, "name": "Mathématiques", "teacher_id": None},
    {"id": 2, "name": "Physique", "teacher_id": None},
]

# Endpoint pour récupérer les étudiants
@app.route('/api/students', methods=['GET'])
def get_students():
    return jsonify(students)

# Endpoint pour ajouter un étudiant
@app.route('/api/students', methods=['POST'])
def add_student():
    new_student = request.json
    new_student['id'] = len(students) + 1
    students.append(new_student)
    return jsonify(new_student), 201

# Endpoint pour modifier un étudiant
@app.route('/api/students/<int:student_id>', methods=['PUT'])
def update_student(student_id):
    student = next((s for s in students if s['id'] == student_id), None)
    if student is None:
        return jsonify({"error": "Student not found"}), 404
    student.update(request.json)
    return jsonify(student)

# Endpoint pour récupérer les professeurs
@app.route('/api/teachers', methods=['GET'])
def get_teachers():
    return jsonify(teachers)

# Endpoint pour ajouter un professeur
@app.route('/api/teachers', methods=['POST'])
def add_teacher():
    new_teacher = request.json
    new_teacher['id'] = len(teachers) + 1
    teachers.append(new_teacher)
    return jsonify(new_teacher), 201

# Endpoint pour récupérer les modules
@app.route('/api/modules', methods=['GET'])
def get_modules():
    return jsonify(modules)

# Endpoint pour affecter un professeur à un module
@app.route('/api/modules/<int:module_id>', methods=['PUT'])
def assign_teacher_to_module(module_id):
    module = next((m for m in modules if m['id'] == module_id), None)
    if module is None:
        return jsonify({"error": "Module not found"}), 404
    teacher_id = request.json.get('teacher_id')
    module['teacher_id'] = teacher_id
    return jsonify(module)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

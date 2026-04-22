from flask import Flask, request, jsonify
import requests
from datetime import datetime

app = Flask(__name__)

# Données simulées
students = [
    {"id": 1, "name": "Ahmed Hassan", "email": "ahmed@emi.ac.ma", "class": "GI2A"},
    {"id": 2, "name": "Fatima Khadija", "email": "fatima@emi.ac.ma", "class": "GI2A"},
    {"id": 3, "name": "Youssef Mohamed", "email": "youssef@emi.ac.ma", "class": "GI2A"}
]

courses = [
    {"id": 1, "name": "Algorithmique Avancée", "code": "ALG101", "teacher": "Prof. Karim"},
    {"id": 2, "name": "Bases de Données", "code": "BDD101", "teacher": "Prof. Leila"},
    {"id": 3, "name": "Réseaux Informatiques", "code": "RES101", "teacher": "Prof. Omar"}
]

absences = []

# Route pour tester le backend
@app.route('/')
def home():
    return "Backend AbsentIA en cours d'exécution"

# Route pour récupérer les étudiants
@app.route('/api/students', methods=['GET'])
def get_students():
    return jsonify({"success": True, "students": students})

# Route pour récupérer les cours
@app.route('/api/courses', methods=['GET'])
def get_courses():
    return jsonify({"success": True, "courses": courses})

# Route pour marquer une absence
@app.route('/api/absences', methods=['POST'])
def mark_absence():
    data = request.json
    absence = {
        "id": len(absences) + 1,
        "student_id": data.get("student_id"),
        "course_id": data.get("course_id"),
        "date": data.get("date", datetime.now().strftime("%Y-%m-%d")),
        "status": data.get("status", "absent")
    }
    absences.append(absence)
    return jsonify({"success": True, "absence": absence})

# Route pour récupérer les absences
@app.route('/api/absences', methods=['GET'])
def get_absences():
    return jsonify({"success": True, "absences": absences})

# Route pour importer depuis Moodle (simulation)
@app.route('/api/import/moodle', methods=['POST'])
def import_from_moodle():
    data = request.json
    moodle_url = data.get("moodleUrl")
    moodle_token = data.get("moodleToken")

    # Simulation de l'appel à l'API Moodle
    try:
        # Exemple : Récupérer les cours depuis Moodle
        courses_response = requests.get(
            f"{moodle_url}/webservice/rest/server.php",
            params={
                "wstoken": moodle_token,
                "wsfunction": "core_course_get_courses",
                "moodlewsrestformat": "json"
            }
        )
        moodle_courses = courses_response.json() if courses_response.ok else []

        # Exemple : Récupérer les étudiants depuis Moodle
        students_response = requests.get(
            f"{moodle_url}/webservice/rest/server.php",
            params={
                "wstoken": moodle_token,
                "wsfunction": "core_enrol_get_enrolled_users",
                "courseid": 1,  # ID d'un cours exemple
                "moodlewsrestformat": "json"
            }
        )
        moodle_students = students_response.json() if students_response.ok else []

        return jsonify({
            "success": True,
            "message": "Import terminé avec succès",
            "courses": moodle_courses,
            "students": moodle_students
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

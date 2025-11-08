#  Flask-React Comment Manager

A full-stack web application built with **Flask (Python)** and **React (JavaScript)** to manage comments efficiently.  
Users can **create, view, edit, and delete** comments in real time with a responsive interface and clean design.

---

##  Features

-  **Full CRUD** (Create, Read, Update, Delete) comment management  
-  **Flask Backend** with RESTful APIs and SQLite database  
-  **React Frontend** integrated using Axios  
-  **Tailwind CSS** for a clean, minimal UI  
-  Real-time UI updates without page reloads  
-  **CORS** enabled for smooth frontend–backend communication  

---

##  Project Structure

Flask-React-Comment-Manager/
│
├── app/ # Flask backend (APIs and routes)
├── frontend/ # React frontend (UI components)
├── tests/ # Pytest and integration tests
├── requirements.txt # Python dependencies
├── package.json # React dependencies
└── README.md # Project documentation

## Tech Stack

**Frontend:** React, Axios, Tailwind CSS  
**Backend:** Python, Flask, Flask-CORS, SQLAlchemy  
**Database:** SQLite (for local testing)  

##  Installation & Setup

###  Clone the repository
git clone https://github.com/AshaKommana/Flask-React-Comment-Manager.git
cd Flask-React-Comment-Manager
Backend Setup
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python app.py
Backend will start at:
👉 http://127.0.0.1:5000

Frontend Setup
Open a new terminal:
cd frontend
npm install
npm start
Frontend will start at:
👉 http://localhost:3000

Testing
To run backend tests:
pytest

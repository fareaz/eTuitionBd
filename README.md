📘 eTuitionBD – Tuition Management System

A complete Tuition Management Platform where students, tutors, and admins can manage every step of the tuition lifecycle — posting tuitions, tutor applications, payments, confirmations, and administrative approvals.

🔗 Live Demo

Live Site: https://rad-zuccutto-e4a57a.netlify.app/

🛂 Test Admin Login

Email: admin@gmail.com

Password: 123A@a

📦 GitHub Repositories

Client: https://github.com/fareaz/eTuitionBd.git

Server: https://github.com/fareaz/eTuitionBd-Server.git

🚀 Project Overview
👨‍🏫 Tutor Features

Create tutor posts

Edit & delete own tutor posts

Apply for tuition jobs

Set expected salary while applying

👨‍🎓 Student Features

Post new tuitions

Edit & delete own tuition posts

View tutor applications

Confirm a tutor by paying

See full payment history

🛡 Admin Features

Review all tuition posts

Review all tutor posts

Approve / Reject / Edit / Delete any post

Approved items become visible on the platform

💳 Payment System

Secure Stripe payment

Students pay for tutor confirmation

Payments stored with transaction ID, payer email, date

Admin sees all payments with sorting

🖥️ Frontend Tech Stack

React 19

TailwindCSS 4

DaisyUI

Axios

React Query

Firebase Authentication

React Hook Form

Recharts

SweetAlert2

Framer Motion

Swiper + Carousel

Frontend Dependencies
"@tailwindcss/vite": "^4.1.17",
"@tanstack/react-query": "^5.90.12",
"axios": "^1.13.2",
"daisyui": "^5.5.8",
"firebase": "^12.6.0",
"framer-motion": "^12.23.25",
"react": "^19.2.0",
"react-dom": "^19.2.0",
"react-hook-form": "^7.68.0",
"react-hot-toast": "^2.6.0",
"react-icons": "^5.5.0",
"react-responsive-carousel": "^3.2.23",
"react-router": "^7.10.1",
"recharts": "^3.5.1",
"sweetalert2": "^11.26.4",
"swiper": "^12.0.3",
"tailwindcss": "^4.1.17"

🛠️ Backend Tech Stack

Node.js + Express

MongoDB

Firebase Admin

Stripe Payments

CORS

Dotenv

Backend Dependencies
"cors": "^2.8.5",
"dotenv": "^17.2.3",
"express": "^5.2.1",
"firebase-admin": "^13.6.0",
"mongodb": "^7.0.0",
"nodemon": "^3.1.11",
"stripe": "^20.0.0"

🧩 Key Modules
🔹 Tuition Module

Students create & manage tuition posts

Tutors browse approved tuitions

Tutors apply with expected salary

🔹 Tutor Module

Create, edit, delete tutor posts

Apply for multiple tuitions

Track application status

🔹 Payment Module

Stripe payment integration

Student confirms tutor via payment

Admin & student dashboards show history

🔹 Admin Module

Approve or reject tuitions

Approve or reject tutor posts

Remove invalid posts

Monitor payments

📁 Project Structure
/client
 ├── src
 │   ├── components/
 │   ├── hooks/
 │   ├── pages/
 │   ├── routes/
 │   ├── context/
 │   ├── App.jsx
 │   └── main.jsx

/server
 ├── routes/
 ├── controllers/
 ├── config/
 ├── utils/
 ├── index.js
 └── .env

⚙️ Installation
1️⃣ Clone Repos
git clone https://github.com/fareaz/eTuitionBd.git
git clone https://github.com/fareaz/eTuitionBd-Server.git

2️⃣ Install Dependencies
Client
cd eTuitionBd
npm install

Server
cd eTuitionBd-Server
npm install

3️⃣ Add Environment Variables
Client .env
VITE_apiKey=your_firebase_key
VITE_authDomain=your_firebase_domain
VITE_backend_url=http://localhost:5000

Server .env
PORT=5000
MONGODB_URI=your_mongo_string
STRIPE_SECRET_KEY=your_key
FIREBASE_SERVICE_ACCOUNT=your_json_credentials

▶️ Running the Project
Start Client
npm run dev

Start Server
npm start

📝 Main API Endpoints
Method	Endpoint	Purpose
GET	/tuitions/all	Get all approved tuitions
POST	/tuitions/create	Student creates tuition
POST	/tutors/create	Tutor creates profile/post
POST	/apply	Tutor applies to tuition
POST	/payment/create	Process payment
GET	/payment-data	Admin payment overview
📄 License

MIT License

👨‍💻 Developer

Fareaz

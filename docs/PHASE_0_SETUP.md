# Phase 0 Setup Documentation

## 1. What Was Created in Setup
This setup establishes the foundational structure for the **HRC-HUB** project.
It includes:
- A Node.js and Express backend setup with essential packages (Express, pg, JWT, bcrypt, etc.) and basic configuration files.
- A foundational database schema (`schema.sql`) for PostgreSQL containing essential tables like users, organizations, profiles, products, services, enquiries, and orders.
- A basic React Native Expo frontend utilizing JavaScript (no TypeScript) with foundational folder structures, routing, placeholder screens, and API service configuration.

## 2. Folder Structure
```txt
HRC-HUB/
├── backend/
│   ├── database/
│   │   └── schema.sql
│   ├── src/
│   │   ├── config/ (db.js, cloudinary.js, firebase.js)
│   │   ├── controllers/
│   │   ├── middleware/ (auth.middleware.js, role.middleware.js)
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/ (jwt.js)
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── config/ (api.js)
│   │   ├── context/
│   │   ├── navigation/ (AppNavigator.js)
│   │   ├── screens/ (LoginScreen.js, RegisterScreen.js, etc.)
│   │   ├── services/ (api.service.js)
│   │   └── utils/
│   ├── App.js
│   ├── app.json
│   ├── babel.config.js
│   └── package.json
└── docs/
    └── PHASE_0_SETUP.md
```

## 3. Backend Setup Steps
1. Navigate to the `backend` folder: `cd backend`
2. Install dependencies: `npm install`
   *(Since this is a fresh setup, please ensure you run this to install express, pg, dotenv, cors, jsonwebtoken, bcryptjs, multer, cloudinary, firebase-admin, and nodemon).*

## 4. Frontend Setup Steps
1. Navigate to the `frontend` folder: `cd frontend`
2. Install dependencies: `npm install`
   *(This will install Expo, React Native, React Navigation, Axios, and other required libraries).*

## 5. PostgreSQL Setup Steps
1. Ensure PostgreSQL server is installed and running on your local machine.
2. Log into PostgreSQL: `psql -U postgres`
3. Create the database: `CREATE DATABASE hrc_hub;`

## 6. Environment Variable Explanation
The backend uses a `.env` file to securely store configuration details:
- `PORT` & `NODE_ENV`: Server listening port and environment.
- `DB_*`: Credentials for PostgreSQL connection.
- `JWT_*`: Secret key and expiry time for authentication tokens.
- `CLOUDINARY_*`: API credentials for image uploads.
- `FIREBASE_*`: Firebase Admin credentials for push notifications.

## 7. How to Create `.env`
1. Navigate to the `backend` folder.
2. Copy the example file: `cp .env.example .env` (or duplicate the file manually and rename it to `.env`).
3. Open `.env` and fill in your specific PostgreSQL credentials, JWT secret, Cloudinary keys, and Firebase details.

## 8. How to Import `schema.sql`
Once the database is created, import the foundational tables:
1. Open your terminal in the `backend/database` folder.
2. Run: `psql -U postgres -d hrc_hub -f schema.sql`
   *(Or copy the contents of `schema.sql` and run them inside a database client like pgAdmin).*

## 9. How to Run Backend
1. Navigate to the `backend` folder.
2. Run development server: `npm run dev`
3. The server should log: `Server is running on port 5000`

## 10. How to Run Frontend
1. Navigate to the `frontend` folder.
2. Start the Expo server: `npm start`
3. Press `a` to open on Android emulator, `i` for iOS simulator, or `w` for web.

## 11. How to Test `/api/health`
Open your browser or Postman and visit:
`http://localhost:5000/api/health`
**Expected Response:**
```json
{
  "success": true,
  "message": "HRC-HUB backend is running"
}
```

## 12. How to Test `/api/db-test`
Ensure your PostgreSQL server is running and `.env` has the correct `DB_PASSWORD`.
Open your browser or Postman and visit:
`http://localhost:5000/api/db-test`
**Expected Response:**
```json
{
  "success": true,
  "message": "Database connection successful"
}
```

## 13. How to Test Frontend-to-Backend Connectivity
1. Ensure both the backend (`npm run dev`) and frontend (`npm start`) are running.
2. Open the frontend app in an emulator or web browser.
3. At the top of the App screen, you should see a banner stating: `Backend Status: HRC-HUB backend is running` (If it says "Checking...", it means it hasn't fetched yet. If it says "failed", check your backend URL and connection).

## 14. Common Errors and Fixes
- **Error:** Authentication failed or connection error when running `/api/db-test`
  **Fix:** Double-check your `DB_USER` and `DB_PASSWORD` in `backend/.env`. Ensure the PostgreSQL server is running.
- **Error:** Frontend shows `Backend health check failed`
  **Fix:** Ensure backend is running. If testing on an Android Emulator, change `localhost` in `frontend/src/config/api.js` to `10.0.2.2`.
- **Error:** `Cannot find module 'express'`
  **Fix:** Ensure you ran `npm install` inside the `backend` folder.

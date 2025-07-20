# Spring Boot CRM Challenge

A full-stack Customer Relationship Management (CRM) application built with **Spring Boot** (Java) for the backend and **React** (TypeScript, Material-UI) for the frontend.

## Features

### Backend (Spring Boot)
- **User Management API**: Create, read, update, and delete users with fields like name, age, place, contact number, department, designation, organization, employee code, date of joining, manager, role, and avatar.
- **Authentication**: Secure registration and login with JWT-based authentication.
- **Role Support**: Users can have roles (Admin, Sales, Support, User, etc.).
- **Manager Hierarchy**: Users can be assigned managers; prevents deletion of users who are managers of others.
- **Validation & Error Handling**: Robust validation and global exception handling for user-friendly error messages.
- **CORS Enabled**: Configured for local frontend development.
- **Swagger/OpenAPI**: (If enabled) for easy API exploration.

### Frontend (React)
- **Modern UI**: Built with Material-UI, featuring a sidebar layout, dashboard, and responsive design.
- **User List**: View, filter, search, and export users (CSV/Excel). Supports pagination and inline actions (view, edit, delete).
- **User Form**: Add or edit users with validation.
- **User Detail**: View detailed information for a single user.
- **Profile Page**: View and edit your own profile.
- **Dashboard**: Visual analytics (charts, widgets) for user statistics (age groups, places, recent users, etc.).
- **Authentication**: (If implemented) Login and registration flows.
- **Notifications**: Snackbar alerts for actions and errors.

## Getting Started

### Prerequisites
- **Java 17+** (recommended Java 21)
- **Node.js** (v16+ recommended) and npm

### Backend Setup

1. **Install dependencies and build:**
   ```sh
   mvn clean install
   ```

2. **Run the Spring Boot application:**
   ```sh
   mvn spring-boot:run
   ```
   The API will be available at `http://localhost:8080`.

3. **API Endpoints:**
   - `POST /api/auth/register` — Register a new user
   - `POST /api/auth/login` — Login and receive JWT
   - `GET /api/users` — List all users
   - `GET /api/users/{id}` — Get user by ID
   - `POST /api/users` — Create user
   - `PUT /api/users/{id}` — Update user
   - `DELETE /api/users/{id}` — Delete user

### Frontend Setup

1. **Install dependencies:**
   ```sh
   cd crm-frontend
   npm install
   ```

2. **Start the development server:**
   ```sh
   npm start
   ```
   The app will be available at `http://localhost:3000`.

3. **Configuration:**
   - The frontend expects the backend API at `http://localhost:8080/api`.
   - Update CORS settings in the backend if deploying to a different domain.

## Project Structure

```
springboot-challenge/
  ├── src/main/java/com/example/userapi/   # Spring Boot backend
  ├── crm-frontend/                       # React frontend
```

## Technologies Used

- **Backend:** Spring Boot, Spring Security, JPA/Hibernate, JWT, Lombok
- **Frontend:** React, TypeScript, Material-UI, Axios, Recharts

## License

This project is for educational and demonstration purposes. 
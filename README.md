# Frontend README

## Overview

This is the frontend for the Todo List application, providing a user-friendly interface to manage your tasks. It supports both **online** and **offline** modes, allowing seamless task management even without an active internet connection.

### Application Features

1. **Registration and Login**:
   - Users can register with a unique user ID and password.
   - After registration, users can log in to access their todo list.

2. **Todo List Management**:
   - Add, edit, and remove todo items through an intuitive user interface.
   - Offline mode support:
     - Items added offline are saved locally and synced to the server when the connection is restored.

3. **Hosted on S3**:
   - The application is hosted on an AWS S3 bucket:
     [Todo List Frontend](http://123456789-todo-fe.s3-website.il-central-1.amazonaws.com/)
   - **Important**: The application requires an **HTTP connection** and does not support HTTPS. 
     - On mobile devices, URLs may automatically redirect to HTTPS. Ensure the connection remains HTTP to avoid issues.

---

## CI/CD Mechanism

The project implements a **Continuous Integration and Deployment (CI/CD)** mechanism using GitHub Actions. 

### Workflow:
1. Developers push changes to the `main` branch of the repository.
2. A **GitHub Actions workflow** is triggered:
   - The application is built, generating the `/dist` directory.
   - The contents of `/dist` replace the current S3 bucket content.
3. The updated application is deployed and live on the S3 bucket.

---

## Getting Started

### Prerequisites
- Node.js and npm installed locally for local development.
- AWS CLI configured for deployment to S3 if manual deployment is needed.

### Local Development
   1. Clone the repository:
      
   ```bash
   git clone git clone https://github.com/danninon/todo-list-frontend
   ```
   2. Install dependencies:
      
   ```bash
   cd client
   npm install
   ```
   3. Start the development client:
      
   ```bash
   npm run dev
   ```
   - The application will run at http://localhost:5173 unless changed in the vite config.
4. Install the server
   - instructions found at: https://github.com/danninon/todo-list-backend
   


# Service Provider Onboarding Portal

A MERN Stack application for onboarding and managing service providers.

## Live Application

- **Frontend:** https://service-provider-portal-woad.vercel.app/
- **Backend:** https://backend-n8hdc4qtv-rekha-sunils-projects.vercel.app/
- **GitHub Repository:** https://github.com/rekha-sunil/service-provider-portal.git

## Features

### Provider

- Provider registration and login
- JWT authentication
- Complete provider profile
- Add categories, skills and experience
- Add service location
- Submit application for verification
- View application status
- Edit profile before approval
- Edit and resubmit rejected applications
- Profile photo and document upload support

### Admin

- Admin login
- Dashboard statistics
- View all service providers
- Search providers by name, email, phone or category
- Filter providers by application status
- View provider details
- Approve applications
- Reject applications with remarks

## Application Workflow

```text
Provider Registration
        ↓
Complete Profile
        ↓
Submit Application
        ↓
Admin Review
     ↙       ↘
 Reject     Approve
   ↓           ↓
Edit Profile  Approved
   ↓
Resubmit
   ↓
Pending
```

## Technology Stack

### Frontend

- React
- React Router
- Axios
- CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Multer

## Project Structure

```text
service-provider-portal/

├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── app.js
│   │   └── server.js
│   ├── uploads/
│   ├── .env
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── screenshots/
├── API-Collection.json
└── README.md
```

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/rekha-sunil/service-provider-portal.git
cd service-provider-portal
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

Start the backend:

```bash
npm run dev
```

The backend will run locally on:

```text
http://localhost:5000
```

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Start the frontend:

```bash
npm run dev
```

The frontend will run locally using the Vite development server.

## Environment Variables

### Backend

The backend requires:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

Refer to `.env.example` for the required environment variable format.

**Do not commit `.env` files or secret credentials to GitHub.**

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a provider/admin |
| POST | `/api/auth/login` | Login user |

### Provider

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/providers/profile` | Get provider profile |
| PUT | `/api/providers/profile` | Update provider profile |
| POST | `/api/providers/submit` | Submit application |
| POST | `/api/providers/upload/profile-photo` | Upload profile photo |
| POST | `/api/providers/upload/document` | Upload provider document |

### Admin

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/stats` | Get dashboard statistics |
| GET | `/api/admin/providers` | Get all providers |
| PUT | `/api/admin/providers/:id/approve` | Approve provider |
| PUT | `/api/admin/providers/:id/reject` | Reject provider |

## Application Statuses

The application supports the following statuses:

- **Draft** — Provider has not submitted the application
- **Pending** — Application is waiting for admin review
- **Approved** — Application has been approved
- **Rejected** — Application has been rejected and may be edited and resubmitted

## Test Credentials

### Admin

```text
Email: admin@example.com
Password: admin123
```

A provider test account can be created using the registration page.

> These credentials are provided for demonstration/testing purposes only.

## File Upload

The application supports:

- JPG
- JPEG
- PNG
- PDF

Maximum file size:

```text
5 MB
```

## Validation and Security

- JWT-based authentication
- Password hashing using bcryptjs
- Role-based access control for admin routes
- Protected provider and admin APIs
- File type validation
- File size validation
- Required field validation before application submission
- Environment variables used for sensitive configuration

## Deployment

The application is deployed using Vercel.

### Frontend

```text
https://service-provider-portal-woad.vercel.app/
```

### Backend

```text
https://backend-n8hdc4qtv-rekha-sunils-projects.vercel.app/
```

### Database

MongoDB Atlas is used as the production database.

## Screenshots

Project screenshots are available in the `screenshots/` directory.

They demonstrate:

- Provider registration/login
- Provider profile
- Application status
- Admin dashboard
- Provider approval
- Provider rejection with remarks
- Resubmission workflow

## API Collection

An API collection is included in:

```text
API-Collection.json
```

It can be imported into Postman or another compatible API testing tool.

## Demo Flow

The application demonstrates the following complete workflow:

```text
Provider Registration
        ↓
Provider Login
        ↓
Complete Profile
        ↓
Submit Application
        ↓
Admin Dashboard
        ↓
Review Provider
        ↓
Approve / Reject
        ↓
Provider Views Status
        ↓
Edit and Resubmit if Rejected
```

## License

This project was developed as part of a technical assignment for Trizen Ventures.
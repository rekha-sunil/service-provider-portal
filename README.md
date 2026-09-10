\# Service Provider Onboarding Portal



A MERN Stack application for onboarding and managing service providers.



\## Features



\### Provider

\- Provider registration and login

\- JWT authentication

\- Complete provider profile

\- Add categories, skills and experience

\- Add service location

\- Submit application for verification

\- View application status

\- Edit profile before approval

\- Edit and resubmit rejected applications

\- Profile photo and document upload support



\### Admin

\- Admin login

\- Dashboard statistics

\- View all service providers

\- Search providers by name, email, phone or category

\- Filter providers by application status

\- View provider details

\- Approve applications

\- Reject applications with remarks



\## Technology Stack



\### Frontend

\- React

\- React Router

\- Axios

\- CSS



\### Backend

\- Node.js

\- Express.js

\- MongoDB

\- Mongoose

\- JWT

\- bcryptjs

\- Multer



\## Project Structure



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

│   ├── .gitignore

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


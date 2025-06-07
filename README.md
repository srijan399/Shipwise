# 🚢 Shipwise - Management System
A modern, role-based user management system built with Firebase Authentication, React TypeScript, and Node.js. Designed for organizations that need secure, scalable user management with admin and staff roles.

## ✨ Features
### 🔐 Authentication & Authorization
Firebase Authentication - Secure email/password login <br />
Role-Based Access Control - Admin and Management Staff roles <br />
JWT Token Management - Automatic token refresh and validation <br />
Protected Routes - Role-based navigation and API access <br />

### 👥 User Management (Admin Only)
User Creation - Create new admin and staff accounts <br />
User Listing - View all users with roles and status <br />
Role Assignment - Assign admin or management_staff roles <br />
Account Status - View creation time, email verification status <br />

### 🎯 Role-Based Dashboards

Admin Dashboard - Full system access and user management <br />
Staff Dashboard - Limited access for day-to-day operations <br />
Automatic Routing - Users redirected based on their role <br />

<hr />

# Setup Instructions

1. Clone the repository, navigate to it & install dependencies for the client and backend
```
git clone https://github.com/srijan399/Shipwise.git
cd client
pnpm install
cd ../backend
npm install
```

2. Run the docker File (Ensure to have it installed) using the Makefile
```
make composeup
```

3. Start the dev server for client and server in different terminals:

```
cd client
pnpm run dev
```

The frontend is still undergoing changes meanwhile. Now you can navigate through the website and fill the .env using the .env.example format using your own credentials!
Enjoy!

```
cd backend
npm start
```

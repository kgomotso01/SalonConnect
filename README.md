# SalonConnect

## About the Project

SalonConnect is a web-based hair salon booking and management system. It helps customers book appointments and allows the salon owner to manage bookings more easily.

Customers can view salon services, book appointments and track their booking status. The salon owner can approve or decline bookings, assign staff members and manage completed appointments.

## Technologies Used

- React
- JavaScript
- HTML
- CSS
- Node.js
- Express.js
- MySQL
- Git and GitHub

## Main Features

### Customer Features
- Customer registration and login.
- View available salon services and prices.
- Book appointments by selecting a service, date and time.
- View appointment details and booking status.
- Cancel pending appointments.
- View assigned staff members after approval.
- View payment information.
- View salon contact details.

### Salon Owner Features
- Owner login and dashboard.
- View all appointments.
- View pending, approved and completed appointments.
- Approve or decline booking requests.
- Assign staff members to appointments.
- Mark appointments as completed.

## Staff Members

The system includes five salon staff members:

- Lebo
- Karabo
- Peace
- Thandeka
- Lindiwe

The salon owner assigns a staff member when approving a booking.

## Payment Method

Customers pay cash at the salon after receiving the service. Online payments are not currently supported.

## Database

MySQL is used to store:
- Customer and owner accounts.
- Salon services.
- Staff members.
- Appointment information.

## Running the Project Locally

### 1. Clone the repository

```bash
git clone https://github.com/kgomotso01/SalonConnect.git
```

### 2. Open the project folder

```bash
cd SalonConnect
```

### 3. Install frontend dependencies

```bash
npm install
```

### 4. Install backend dependencies

```bash
cd backend
npm install
```

### 5. Configure the database

Create a MySQL database called `salonconnect`.

Create a `.env` file inside the backend folder and add your database connection details:

```env
DB_HOST=localhost
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=salonconnect
PORT=5000
JWT_SECRET=your_secret_key
```

Create the required database tables and insert the initial services and staff members.

### 6. Start the backend

From the backend folder, run:

```bash
npm start
```

### 7. Start the frontend

Open another terminal in the main project folder and run:

```bash
npm run dev
```

Open the local address shown in the terminal to access SalonConnect.


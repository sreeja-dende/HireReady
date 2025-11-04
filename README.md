# HireReady - Full-Stack Placement Preparation Platform

HireReady is a comprehensive web application designed to help students prepare for placements through role-based practice, coding challenges, aptitude tests, and analytics.

## Features

### Authentication & Role System
- User registration and login
- Role-based access (Student / Placement Cell)
- Secure JWT-based authentication

### Student Dashboard
- Clean, card-based UI with Tailwind CSS
- Navigation: Coding Practice, Aptitude, Soft Skills, Mock Interview, Analytics
- Daily progress summary
- Access to resources uploaded by Placement Cell

### Placement Cell Dashboard
- Manage resources (Resume Samples, Company Info, Interview Tips)
- View student analytics and performance metrics
- Upload and manage placement-related materials

### Coding Platform
- Role-specific coding questions (Developer, Data Analyst, AI Engineer)
- CodeMirror editor with syntax highlighting
- Run and submit functionality
- Automatic test case checking
- Score calculation (60% weight in overall assessment)

### Aptitude Module
- Logical, Quantitative, and English questions
- Daily focus rotation
- Timed tests (30 minutes)
- Feedback and scoring (30% weight)

### Soft Skills Module
- AI-powered role-play exercises (placeholder for future implementation)
- HR interview simulations
- Leadership and communication practice

### Mock Interview Module
- Frontend prototype for interview practice
- Text-based Q&A with recording simulation
- Common interview questions

### Analytics Module
- Personal progress tracking for students
- Overall performance metrics
- Charts and graphs using Recharts
- Topic-wise performance analysis

## Tech Stack

### Frontend
- React 18 with Vite
- React Router DOM for navigation
- Tailwind CSS for styling
- Axios for API calls
- Recharts for data visualization
- CodeMirror for code editing

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

### Mock Server
- Express-based mock API for development and preview
- Pre-populated with sample data

## Project Structure

```
HireReady/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── StudentDashboard.jsx
│   │   │   ├── PlacementCellDashboard.jsx
│   │   │   ├── CodingPractice.jsx
│   │   │   ├── Aptitude.jsx
│   │   │   ├── SoftSkills.jsx
│   │   │   ├── MockInterview.jsx
│   │   │   └── Analytics.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── mockServer.js
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── index.html
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Question.js
│   │   ├── Resource.js
│   │   └── Score.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── questions.js
│   │   ├── resources.js
│   │   └── analytics.js
│   ├── controllers/
│   │   └── submitController.js
│   ├── server.js
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (optional, mock server works without it)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd HireReady
   ```

2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. Install backend dependencies:
   ```bash
   cd ../backend
   npm install
   ```

### Running the Application

1. Start the mock server (for API simulation):
   ```bash
   cd frontend
   node mockServer.js
   ```
   The mock server will run on `http://localhost:3001`

2. In a new terminal, start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`

3. (Optional) Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```
   The backend will run on `http://localhost:3000`

### Environment Variables

Create a `.env` file in the backend directory:

```
MONGODB_URI=mongodb://localhost:27017/hireready
JWT_SECRET=your-secret-key-here
PORT=3000
```

For the frontend, create a `.env` file:

```
VITE_API_BASE_URL=http://localhost:3001
```

## Usage

### For Students
1. Register as a Student or login with existing credentials
2. Access the dashboard with navigation to different modules
3. Practice coding problems, take aptitude tests, and view analytics
4. Track progress and access placement resources

### For Placement Cell
1. Register as Placement Cell or login
2. Upload resources for students
3. View analytics and student performance data
4. Manage placement-related materials

## API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login

### Questions
- `GET /api/questions/:role` - Get questions by role

### Resources
- `GET /api/resources` - Get all resources
- `POST /api/resources` - Add new resource

### Submissions
- `POST /api/submit` - Submit coding/aptitude solutions

### Analytics
- `GET /api/analytics/student/:id` - Get student analytics
- `GET /api/analytics/placement` - Get placement analytics

## Scoring Logic

The overall placement readiness score is calculated as:
- Coding: 60%
- Aptitude: 30%
- Participation: 10%

## Future Enhancements

- Real-time code execution and testing
- AI-powered question generation
- Video recording for mock interviews
- Advanced analytics with machine learning
- Mobile app version
- Integration with job portals

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or support, please contact the development team or create an issue in the repository.

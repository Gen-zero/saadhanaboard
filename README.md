# SaadhanaBoard 🌟

A spiritual productivity and self-development application designed to help users engage in guided spiritual practices, meditation, and personal growth journeys. 🙏✨

## 🚀 Tech Stack 💻

- ⚛️ **Frontend**: React + TypeScript + Vite
- 🖥️ **Backend**: Node.js + Express + PostgreSQL
- 🎨 **Styling**: Tailwind CSS
- 🧩 **UI Components**: Radix UI + shadcn-ui
- 🔄 **State Management**: React Context API + Custom Hooks
- 🎯 **3D Graphics**: react-three/fiber + drei
- 🧭 **Routing**: react-router-dom
- 📝 **Form Handling**: react-hook-form + zod
- 📡 **Data Fetching**: @tanstack/react-query
- 🔐 **Authentication**: Local JWT-based Auth
- ✨ **Animations**: Framer Motion
- 🤖 **AI Integration**: Claude AI API

## 📁 Project Structure 🗂️

```
saadhanaboard/
├── src/
│   ├── components/     # React components
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Core utilities and context
│   ├── pages/          # Page components
│   ├── services/       # API service layer
│   ├── styles/         # CSS and styling files
│   ├── types/          # TypeScript types
│   └── utils/          # Helper functions
├── backend/            # Node.js + Express backend
│   ├── controllers/    # Request handlers
│   ├── models/         # Data models
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── middleware/     # Express middleware
│   ├── config/         # Configuration files
│   └── utils/          # Utility functions
├── public/             # Static assets
└── supabase/           # Database migrations (for reference)
```

## 🛠️ Setup Instructions ⚙️

### 📋 Prerequisites
- 🟩 Node.js (v18+)
- 🧧 Bun (optional, project includes a bun.lockb)
- 🗄️ PostgreSQL database or Supabase

### 🖥️ Frontend Setup
```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd saadhanaboard

# Install frontend dependencies
npm install

# Start development server
npm run dev
```

### 🔧 Backend Setup
```bash
cd backend
# Install backend dependencies
npm install
# Start backend server
npm run dev
```

### 🗄️ Database Setup
1. Create a PostgreSQL database named `saadhanaboard` (or use Supabase)
2. Update the database configuration in `backend/.env` (copy from `backend/.env.example`)
3. Run the database initialization script:
```bash
node backend/utils/initDb.js
```

### 🔐 Environment Variables
Create a `.env` file in the project root for frontend values (copy `.env.example`) and in `backend/.env` for backend values (copy `backend/.env.example`).

Example backend values include:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=saadhanaboard
DB_USER=your_postgres_username
DB_PASSWORD=your_postgres_password

# JWT Configuration
JWT_SECRET=your_jwt_secret_key

# Server Configuration
PORT=3004
```

## 🏗️ Development 👷

### 🎨 Frontend Development
- 🌐 The frontend runs on http://localhost:8080 (configured via Vite)
- ⚡ Uses Vite for fast development builds

### ⚙️ Backend Development
- 🌐 The backend API runs on http://localhost:3004
- 🔗 API endpoints are prefixed with `/api`

## 🚢 Deployment 🚀

### 🏭 Build for Production 📦
```bash
# Build frontend
npm run build

# Start production server
npm run preview
```

## 📚 Features ✨

- 🧘 **Sadhana Tracking**: Structured spiritual practice routines
- 📚 **Spiritual Library**: Book viewer and upload functionality
- 🧘‍♀️ **Guided Meditation**: Interactive meditation tools
- 📈 **Progress Tracking**: Visualize your spiritual journey
- 🎮 **3D Visualization**: Immersive deity interfaces
- ⚙️ **Personalization**: Customizable settings and preferences
- 🎨 **Enhanced UI**: Spiritual Hindu-inspired interface with lotus petals, chakra visualization, and yantra geometry
- 📋 **Always Expanded Sidebar**: Sidebar is now fixed in expanded state for better navigation

## 🔐 Authentication 🛡️

The application uses JWT-based authentication with local PostgreSQL storage instead of Supabase Auth.

## 🗄️ Database 💾

The application now uses a local PostgreSQL database instead of Supabase, with tables for:
- Users and profiles
- Spiritual books
- Sadhanas and progress tracking

## 🤝 Contributing 🤲

1. 🍴 Fork the repository
2. 🌿 Create your feature branch
3. 💾 Commit your changes
4. ⬆️ Push to the branch
5. 📬 Open a pull request

## 📄 License 📜 ✅

This project is licensed under the MIT License.
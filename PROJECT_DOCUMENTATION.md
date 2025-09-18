# SaadhanaBoard Project Documentation

## Table of Contents
1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Project Architecture](#project-architecture)
4. [Frontend Structure](#frontend-structure)
5. [Backend Structure](#backend-structure)
6. [Key Features](#key-features)
7. [Authentication System](#authentication-system)
8. [Data Management](#data-management)
9. [UI/UX Components](#uiux-components)
10. [Spiritual Features](#spiritual-features)
11. [Settings and Customization](#settings-and-customization)
12. [Deployment](#deployment)

## Overview

SaadhanaBoard is a comprehensive spiritual practice management application that combines modern web technologies with Hindu spiritual concepts. The application helps users track their daily spiritual practices (sadhana), manage a spiritual library, connect with deities, visualize chakras, and explore sacred geometry.

The application features a React/TypeScript frontend with a Node.js/Express backend, using PostgreSQL for data storage. It incorporates spiritual themes through ambient animations, sound effects, and thematic elements throughout the UI.

## Technology Stack

### Frontend
- **React** with **TypeScript** - Core UI framework
- **Vite** - Build tool and development server
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling framework
- **Lucide React** - Icon library
- **Framer Motion** - Animation library
- **React Hook Form** - Form handling
- **Zod** - Validation library

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Multer** - File uploads
- **PDFKit** - PDF generation

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Jest** - Testing framework

## Project Architecture

```
saadhanaboard/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── server.js
├── public/
│   ├── icons/
│   └── lovable-uploads/
├── src/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── pages/
│   ├── services/
│   ├── styles/
│   ├── types/
│   ├── App.tsx
│   └── main.tsx
├── uploads/
└── package.json
```

## Frontend Structure

### Main Entry Points
- **main.tsx** - Application entry point that renders the React app
- **App.tsx** - Main application component with routing configuration

### Core Components
- **Layout.tsx** - Main application layout with sidebar navigation
- **Dashboard.tsx** - User dashboard showing progress and tasks
- **ProfileCard.tsx** - User profile display component
- **ProtectedRoute.tsx** - Route protection component
- **ThemedBackground.tsx** - Dynamic background animations based on themes

### Hooks
- **useAuth.ts** - Authentication state management
- **useProfileData.ts** - User profile data management
- **useSadhanaData.ts** - Sadhana tracking and management
- **useSettings.ts** - Application settings management
- **useDivineSounds.ts** - Sound effects management
- **useBooks.ts** - Library management
- **useDeityConnection.ts** - Deity interaction functionality

### Services
- **api.ts** - API client configuration
- **authService.ts** - Authentication API calls
- **bookService.ts** - Book/library API calls
- **profileService.ts** - Profile API calls
- **sadhanaService.ts** - Sadhana tracking API calls
- **settingsService.ts** - Settings API calls

### Pages
- **DashboardPage.tsx** - Main dashboard view
- **LoginPage.tsx** - User authentication
- **RegisterPage.tsx** - User registration
- **OnboardingPage.tsx** - New user onboarding
- **ProfilePage.tsx** - User profile management
- **SettingsPage.tsx** - Application settings
- **SadhanaPage.tsx** - Sadhana tracking interface
- **LibraryPage.tsx** - Spiritual library
- **DeityInterfacePage.tsx** - Deity connection interface
- **ChakraVisualizationPage.tsx** - Chakra energy visualization
- **SacredGeometryPage.tsx** - Sacred geometry exploration
- **SpiritualDemoPage.tsx** - Your Yantras demonstration

## Backend Structure

### Main Server
- **server.js** - Express server configuration and startup

### Routes
- **authRoutes.js** - Authentication endpoints
- **bookRoutes.js** - Library/book management endpoints
- **profileRoutes.js** - User profile endpoints
- **sadhanaRoutes.js** - Sadhana tracking endpoints
- **settingsRoutes.js** - Settings management endpoints

### Controllers
- **authController.js** - Authentication logic
- **bookController.js** - Book/library logic
- **profileController.js** - Profile management logic
- **sadhanaController.js** - Sadhana tracking logic
- **settingsController.js** - Settings management logic

### Services
- **authService.js** - Authentication business logic
- **bookService.js** - Book/library business logic
- **profileService.js** - Profile business logic
- **sadhanaService.js** - Sadhana tracking business logic
- **settingsService.js** - Settings business logic

### Models
- **User.js** - User data model
- **Book.js** - Book/library data model
- **Sadhana.js** - Sadhana practice data model
- **Settings.js** - User settings data model

### Middleware
- **authMiddleware.js** - Authentication verification
- **uploadMiddleware.js** - File upload handling

## Key Features

### 1. User Authentication
- Secure registration and login with JWT tokens
- Password hashing with bcrypt
- Protected routes for authenticated users only
- Session management and token refresh

### 2. Dashboard
- Personalized user dashboard
- Progress tracking visualization
- Task management system
- Quick access to key features

### 3. Sadhana Tracking
- Daily practice tracking
- Progress visualization
- Streak management
- Practice history and statistics

### 4. Spiritual Library
- Book upload and management
- PDF storage and retrieval
- Personal library organization
- Search and categorization

### 5. Deity Connection
- AI-powered spiritual guidance
- Interactive deity interface
- Prayer and mantra suggestions
- Personalized spiritual advice

### 6. Chakra Visualization
- Interactive 7-chakra system
- Bija mantra display
- Energy flow visualization
- Chakra balancing information

### 7. Sacred Geometry
- Geometric pattern visualization
- Spiritual significance explanations
- Interactive exploration
- Educational content

### 8. Profile Management
- Personal information management
- Spiritual preferences configuration
- Achievement tracking
- Goal setting and monitoring

### 9. Settings and Customization
- Theme selection (multiple spiritual themes)
- Appearance customization
- Notification preferences
- Privacy controls
- Accessibility options

### 10. Ambient Experience
- Themed background animations
- Spiritual sound effects
- Mantra displays
- Particle effects
- Responsive design

## Authentication System

The authentication system uses JWT tokens for secure user sessions:

1. **Registration**
   - User provides email, password, and display name
   - Password is hashed using bcrypt
   - New user record is created in the database
   - Welcome email may be sent (implementation pending)

2. **Login**
   - User credentials are verified
   - JWT token is generated with user information
   - Token is sent to client for future requests

3. **Token Management**
   - Access tokens for API requests
   - Refresh tokens for session extension
   - Automatic token refresh mechanism

4. **Protected Routes**
   - Middleware verifies JWT tokens
   - Unauthorized access is blocked
   - User information is attached to requests

## Data Management

### Database Schema
The application uses PostgreSQL with the following main tables:

1. **Users**
   - id (UUID)
   - email (string)
   - password_hash (string)
   - display_name (string)
   - created_at (timestamp)
   - updated_at (timestamp)

2. **Books**
   - id (UUID)
   - user_id (foreign key)
   - title (string)
   - author (string)
   - file_path (string)
   - uploaded_at (timestamp)

3. **Sadhana Practices**
   - id (UUID)
   - user_id (foreign key)
   - name (string)
   - description (text)
   - frequency (string)
   - created_at (timestamp)
   - updated_at (timestamp)

4. **Sadhana Completion Records**
   - id (UUID)
   - sadhana_id (foreign key)
   - user_id (foreign key)
   - completed_at (timestamp)
   - notes (text)

5. **Settings**
   - id (UUID)
   - user_id (foreign key)
   - settings_data (JSON)
   - updated_at (timestamp)

### API Endpoints
- **Auth**: `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`
- **Profile**: `/api/profile`
- **Books**: `/api/books`
- **Sadhana**: `/api/sadhana`, `/api/sadhana/complete`
- **Settings**: `/api/settings`

## UI/UX Components

### Core UI Elements
- **Buttons** - Interactive elements with spiritual styling
- **Cards** - Content containers with hover effects
- **Forms** - Data input with validation
- **Modals** - Overlay dialogs for focused tasks
- **Navigation** - Sidebar and header navigation
- **Toasts** - Notification system

### Specialized Components
- **ThemedBackground** - Canvas-based animated backgrounds
- **ChakraVisualization** - Interactive chakra display
- **DeityInterface** - AI-powered deity connection
- **EnhancedDeityIcon** - Animated deity icons
- **FloatingMantras** - Ambient mantra display
- **ProfileCard** - User profile visualization

### Animations and Effects
- **Spiritual particle systems** - Dynamic background elements
- **Hover effects** - Interactive element responses
- **Transitions** - Smooth state changes
- **Ambient animations** - Continuous background motion

## Spiritual Features

### Themes
The application supports multiple spiritual themes that affect the entire UI:
- **Default** - Cosmic energy theme
- **Earth** - Nature-based elements
- **Water** - Flowing water aesthetics
- **Fire** - Dynamic fire effects
- **Shiva** - Lord Shiva cosmic theme
- **Bhairava** - Intense protective energy
- **Serenity** - Calming peaceful theme
- **Ganesha** - Auspicious remover of obstacles

### Deity Connections
- Integration with Claude AI for spiritual guidance
- Personalized deity selection
- Prayer and mantra recommendations
- Spiritual progress tracking

### Chakra System
- Visualization of all 7 chakras
- Bija mantras for each chakra
- Energy flow animations
- Balancing information and practices

### Sacred Geometry
- Interactive geometric patterns
- Spiritual significance explanations
- Educational content about sacred shapes
- Visual exploration tools

## Settings and Customization

### General Settings
- Display name management
- Email preferences
- Notification controls

### Appearance
- Theme selection
- Color scheme customization
- Animation preferences
- Background effects control

### Meditation
- Session duration preferences
- Guided meditation options
- Sound preferences
- Breathing exercise settings

### Privacy
- Data sharing controls
- Profile visibility settings
- Activity logging options

### Notifications
- Email notification preferences
- In-app notification settings
- Reminder configurations

### Accessibility
- Font size adjustments
- Color contrast options
- Keyboard navigation support
- Screen reader compatibility

### Profile
- Personal information management
- Spiritual preferences
- Deity connections
- Practice goals

### Advanced
- Data export/import
- Account management
- Debugging options
- Performance settings

## Deployment

### Development Setup
1. Clone the repository
2. Install dependencies with `npm install`
3. Set up PostgreSQL database
4. Configure environment variables
5. Run development server with `npm run dev`

### Production Deployment
1. Build frontend with `npm run build`
2. Configure production environment variables
3. Set up reverse proxy (Nginx/Apache)
4. Deploy backend server
5. Configure SSL certificates
6. Set up database backups

### Environment Variables
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `UPLOAD_DIR` - Directory for file uploads

### Scaling Considerations
- Database connection pooling
- Load balancing for multiple instances
- CDN for static assets
- Caching strategies
- Monitoring and logging

## Conclusion

SaadhanaBoard represents a unique fusion of modern web technologies and ancient spiritual practices. Its modular architecture allows for easy extension and customization while maintaining a consistent spiritual aesthetic. The application provides a comprehensive platform for individuals to track and enhance their spiritual journey through daily practices, learning, and connection with divine energies.
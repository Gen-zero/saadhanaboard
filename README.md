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

### �️ Database migrations

If you need to apply the soft-delete migration (adds a `deleted_at` column to `spiritual_books`) you can run the helper script included in the backend:

```powershell
node backend/scripts/apply_book_soft_delete_migration.js
```

This script reads the SQL file `supabase/migrations/20250108000000_add_book_soft_delete.sql` and executes it against the configured database (it uses the same connection parameters as the backend). Ensure your backend environment variables (in `backend/.env`) are configured before running it.


### �🔐 Environment Variables
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

## Admin Panel Setup

If you need a demo admin account for local/testing, the repository includes helper scripts to create admin users.

- Create demo admin (non-interactive):

	```powershell
	cd d:\saadhanaboard\backend
	npm run admin:create-demo
	```

- Comprehensive setup (checks DB and creates demo admin if none exists):

	```powershell
	cd d:\saadhanaboard\backend
	npm run admin:setup
	```

## Admin Panel Setup & Troubleshooting

If you're having trouble logging into the Admin panel, follow these steps:

1. Verify database connectivity and admin schema:

```powershell
cd d:\saadhanaboard\backend
npm run debug:admin
# This runs debug_admin_login.js and will print detailed diagnostics
```

2. If the admin table is missing or the demo admin isn't present, run the repair script:

```powershell
# Create table (if missing) and demo admin
npm run fix:admin

# Force-reset demo admin password to 'Subham@98'
npm run reset:admin
```

3. If CORS issues appear in the browser console, ensure your frontend dev server origin is one of the allowed origins (defaults: http://localhost:8080, http://localhost:5173). You can set a comma-separated list in `backend/.env` as `CORS_ORIGIN=http://localhost:8080,http://localhost:5173`.

4. To test a live login attempt via the backend endpoint directly:

```powershell
curl -v -X POST "http://localhost:3004/api/admin/login" -H "Content-Type: application/json" -d '{"usernameOrEmail":"KaliVaibhav","password":"Subham@98"}'
```

5. If you still cannot login, run `npm run debug:admin` and open an issue or contact the project maintainer with the output.


- Create default admin via env (more flexible):

	```powershell
	# set env vars for this PowerShell session
	$env:ADMIN_USERNAME = 'KaliVaibhav'
	$env:ADMIN_EMAIL = 'kali@example.com'
	$env:ADMIN_PASSWORD = 'Subham@98'
	cd d:\saadhanaboard\backend
	npm run admin:create-default
	```

Notes:
- The demo account username is `KaliVaibhav` and password `Subham@98` (for local/demo use only). Change these in production.
- Ensure the `admin_details` table exists in your database before running the scripts. Run the migration file in `supabase/migrations/` if needed.
- Scripts use `adminAuthService` which applies bcrypt hashing for passwords.


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

## Theme Icons (developer guide)

This project keeps a small canonical `icons/` folder at the repository root. During development and build the project copies a curated subset of files from `icons/` into `src/themes/<themeId>/assets` so theme components can reference them as local assets.

Why this exists:
- Keeps large or animated icon files out of the committed theme folders until they are needed.
- Avoids duplication while allowing theme authors to override or extend assets inside `src/themes/*/assets`.

How it works:
- `scripts/generate-theme-manifest.js` creates a manifest used by the build.
- `scripts/copy-theme-icons.cjs` copies files listed in the mapping into `src/themes/<themeId>/assets`.
- The project exposes npm scripts that run these helpers automatically during dev/build/postinstall.

Useful commands:
- Install & sync icons (recommended before first run):

```powershell
npm install
npm run dev:setup
```

- Run the copy script manually (dry-run):

```powershell
npm run themes:copy-icons -- --dry-run
```

- Force overwrite existing destination files:

```powershell
npm run themes:copy-icons -- --force
```

Troubleshooting:
- If icons are missing in the UI, verify `icons/` contains the expected filenames listed in the repository `scripts/copy-theme-icons.cjs` mapping.
- Use `--dry-run` to see which files would be copied without changing the filesystem.
- If `npm run dev` starts but assets are not present, run `npm run dev:setup` to regenerate themes and copy icons.

For more details and advanced troubleshooting steps, see `docs/THEME_ICON_SETUP.md`.
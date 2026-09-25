# 🎓 StudyTracker

A modern, full-stack productivity and study habit tracking web application designed to help learners manage their study hours, maintain daily streaks, and hit their learning goals. Built with **Django** on the backend and **React + Vite** on the frontend, featuring a sleek, dark-themed dashboard.

---

## 🌟 Features

- **📊 Comprehensive Study Dashboard**
  - **Today's Study Hours**: Real-time tracking of daily hours with day-over-day trends.
  - **Weekly Target Progress**: Keep tabs on your weekly hours against your target (e.g., 25 hrs/week).
  - **Streak Counter**: Track consecutive days studied, current streak, and personal best records.
  - **Goal Completion**: Visual progress bar indicating percentage completion toward your milestones.
- **📚 Subject Management**
  - Dedicated cards for active study areas (e.g., Python, Django, React).
  - Color-coded status tags, subtitles, and total time spent per topic.
- **🔐 User Authentication & Session Management**
  - Built-in Django session authentication with secure password hashing.
  - Interactive **Auth Modal** supporting instant Signup and Login.
  - Validation rules: Username length restrictions, alphanumeric validation, and password confirmation checks.
  - Logout functionality with session teardown.
- **💬 Toast Notification System**
  - Polling-based toast notification system bridging Django messages framework with React toasts.
  - Automated auto-dismiss and manual dismiss controls.
- **🎨 Modern Dark UI & Glassmorphism**
  - Polished dark theme powered by custom CSS styling.
  - Typography powered by **Plus Jakarta Sans** and **Google Material Symbols**.
  - Fully responsive navigation with desktop menu and collapsible mobile drawer.

---

## 🏗️ Architecture & Tech Stack

```
StudyTracker/
├── backend/
│   ├── config/              # Django project settings, routes, and API views
│   │   ├── settings.py      # App configurations, static/template paths
│   │   ├── urls.py          # Route definitions
│   │   └── views.py         # Auth logic & API endpoints
│   ├── frontend/            # React + Vite frontend application
│   │   ├── src/             # React components, pages, and styles
│   │   ├── dist/            # Vite production build (served by Django)
│   │   ├── vite.config.js   # Vite bundler configuration
│   │   └── package.json     # Frontend dependencies
│   ├── manage.py            # Django CLI utility
│   └── db.sqlite3           # SQLite database
├── venv/                    # Python virtual environment
└── README.md
```

### Backend
- **Framework**: [Django](https://www.djangoproject.com/)
- **Database**: SQLite3 (default, easily switchable to PostgreSQL/MySQL)
- **Authentication**: Django standard `django.contrib.auth`

### Frontend
- **Library**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Routing**: [React Router DOM v7](https://reactrouter.com/)
- **Icons & Typography**: Google Material Symbols Outlined & Plus Jakarta Sans
- **Styling**: Vanilla CSS with custom glassmorphism design tokens

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- **Python 3.10+**: [Download Python](https://www.python.org/)
- **Node.js 18+ & npm**: [Download Node.js](https://nodejs.org/)

---

### 1. Clone & Set Up the Backend

1. **Activate the virtual environment**:
   - **Windows (PowerShell)**:
     ```powershell
     .\venv\Scripts\Activate.ps1
     ```
   - **Windows (Command Prompt)**:
     ```cmd
     venv\Scripts\activate.bat
     ```
   - **Linux / macOS**:
     ```bash
     source venv/bin/activate
     ```

2. **Run database migrations**:
   ```bash
   cd backend
   python manage.py migrate
   ```

3. **(Optional) Create a superuser for Django Admin**:
   ```bash
   python manage.py createsuperuser
   ```

4. **Start the Django server**:
   ```bash
   python manage.py runserver
   ```
   The backend will be live at `http://127.0.0.1:8000/`.

---

### 2. Set Up & Build the Frontend

1. **Navigate to the frontend directory**:
   ```bash
   cd backend/frontend
   ```

2. **Install frontend dependencies**:
   ```bash
   npm install
   ```

3. **Build the production bundle**:
   Django is configured to serve the production build generated in `backend/frontend/dist`:
   ```bash
   npm run build
   ```

4. **(Optional) Frontend Development Server**:
   If you want to develop React components with Hot Module Replacement (HMR):
   ```bash
   npm run dev
   ```

---

## 🔌 API Endpoints & Routes

| Endpoint | Method | Description |
|---|---|---|
| `/` | `GET` | Main React Dashboard application (`index.html`) |
| `/progress` | `GET` | Progress tracking page |
| `/signup` | `POST` | Registers a new user account with validation |
| `/login` | `POST` | Authenticates and logs in a user session |
| `/logout` | `GET` | Logs out the current user and clears session |
| `/api/user` | `GET` | Returns authentication state and user details |
| `/api/messages` | `GET` | Retrieves and clears queued Django flash messages |
| `/admin/` | `GET/POST` | Django administrative interface |

---

## 💡 How Django & Vite Work Together

This project uses an integrated single-server setup:
1. Vite outputs static assets and an `index.html` file into `backend/frontend/dist`.
2. Django's `settings.py` references `dist/` in both `TEMPLATES['DIRS']` and `STATICFILES_DIRS`.
3. Django handles API routing, authentication endpoints, and session cookies while rendering the single-page application entry point.

---

## 📝 Roadmap

- [ ] Interactive stopwatch and Pomodoro timer for live study sessions.
- [ ] Subject creation and editing modal from the UI.
- [ ] Historical study session logs with filtering and analytics charts.
- [ ] Customizable weekly and monthly study targets.
- [ ] Dark/Light mode theme toggle.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

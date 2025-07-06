# 🚀 TaskMate AI - Intelligent Task Management System

A modern, full-stack task management application powered by AI that helps you create, organize, and manage tasks using natural language processing.

## ✨ Features

### 🤖 AI-Powered Task Creation

- **Natural Language Processing**: Create tasks by describing them in plain English
- **Smart Parsing**: AI automatically extracts title, description, due dates, and priority
- **Graceful Fallback**: Falls back to basic parsing if AI service is unavailable
- **Real-time Processing**: Instant task creation with loading indicators

### 📋 Core Task Management

- **CRUD Operations**: Create, read, update, and delete tasks
- **Priority Levels**: Low, medium, and high priority classification
- **Due Date Management**: Set and track task deadlines
- **Status Tracking**: Mark tasks as active or completed
- **Drag & Drop**: Reorder tasks with intuitive drag-and-drop interface

### 🎨 Modern User Interface

- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark/Light Mode**: Toggle between themes for comfortable viewing
- **Real-time Updates**: Instant UI updates without page refreshes
- **Toast Notifications**: Clear feedback for all user actions
- **Consistent UX**: Unified design language across all components

### ⚙️ User Settings & Preferences

- **Default Sort Options**: Configure how tasks are sorted by default
- **Filter Preferences**: Set default task filters (All, Active, Completed)
- **Personalized Experience**: Save and remember user preferences

### 🔐 Authentication & Security

- **JWT Authentication**: Secure user authentication with JSON Web Tokens
- **Password Hashing**: Bcrypt encryption for password security
- **Protected Routes**: Secure API endpoints and frontend routes
- **Session Management**: Persistent login sessions

## 🏗️ Architecture

### Frontend (React + TypeScript)

- **React 19**: Latest React with modern hooks and features
- **TypeScript**: Type-safe development experience
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Zustand**: Lightweight state management
- **React Router**: Client-side routing
- **Heroicons**: Beautiful SVG icons
- **DND Kit**: Drag and drop functionality

### Backend (Node.js + Express)

- **Node.js**: JavaScript runtime
- **Express**: Fast, unopinionated web framework
- **TypeScript**: Type-safe backend development
- **PostgreSQL**: Robust relational database
- **JWT**: JSON Web Token authentication
- **Bcrypt**: Password hashing
- **OpenAI API**: AI-powered natural language processing

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 12+
- OpenAI API key (for AI features)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd full-stack-task-manager
```

### 2. Backend Setup

```bash
cd server
npm install

# Create .env file
cp .env.example .env
# Add your database and OpenAI API credentials

# Setup database
npm run db:reset

# Start development server
npm run dev
```

### 3. Frontend Setup

```bash
cd client
npm install

# Start development server
npm run dev
```

### 4. Environment Variables

Create `.env` file in the server directory:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/taskmanager

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key

# OpenAI API (for AI features)
OPENAI_API_KEY=your-openai-api-key

# Server
PORT=8080
NODE_ENV=development
```

## 🎯 Usage Examples

### Creating Tasks with AI

1. **Simple Task**

   ```
   Input: "Buy groceries"
   Output: Task with title "Buy groceries"
   ```

2. **Complex Task with Date and Priority**

   ```
   Input: "Review quarterly report by Friday urgent"
   Output: Task with title, description, due date (Friday), and high priority
   ```

3. **Time-based Task**
   ```
   Input: "Call dentist tomorrow at 3pm"
   Output: Task with extracted date and time information
   ```

### Manual Task Creation

Use the traditional form interface to:

- Set task title and description
- Choose priority level
- Set due date
- Add additional details

### Task Management

- **Drag & Drop**: Reorder tasks by dragging them
- **Quick Actions**: Mark tasks as complete/incomplete
- **Edit Tasks**: Click to edit task details
- **Delete Tasks**: Remove tasks with confirmation
- **Filter & Sort**: Organize tasks by status, priority, or date

## 🔧 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Tasks

- `GET /api/tasks` - Get all tasks for user
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `PATCH /api/tasks/:id/toggle` - Toggle task completion

### AI Tasks

- `POST /api/ai-tasks/create` - Create task from natural language
- `POST /api/ai-tasks/enhance` - Enhance existing task with AI
- `POST /api/ai-tasks/suggestions` - Get AI suggestions for task

## 🛠️ Development

### Available Scripts

**Backend:**

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run seed         # Seed database with sample data
npm run db:reset     # Reset and seed database
```

**Frontend:**

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Database Schema

The application uses PostgreSQL with the following main tables:

- `users` - User accounts and authentication
- `tasks` - Task data with relationships to users
- `user_settings` - User preferences and settings

## 🤖 AI Integration

### OpenAI Integration

The application integrates with OpenAI's GPT models to provide:

- Natural language task parsing
- Intelligent task enhancement
- Smart suggestions and recommendations

### Fallback Strategy

If AI services are unavailable:

1. Graceful degradation to basic parsing
2. User-friendly error notifications
3. Continued functionality without AI features

## 🧪 Testing

### Manual Testing Checklist

- [ ] User registration and login
- [ ] Task creation (manual and AI modes)
- [ ] Task editing and deletion
- [ ] Drag and drop functionality
- [ ] Filtering and sorting
- [ ] Settings management
- [ ] Responsive design on mobile
- [ ] Error handling and notifications

## 🔮 Future Enhancements

### Planned Features

- **Voice Input**: Speech-to-text for task creation
- **Calendar Integration**: Sync with external calendars
- **Team Collaboration**: Share tasks and collaborate
- **Advanced AI**: Context-aware suggestions and learning
- **Mobile App**: Native mobile applications
- **Offline Support**: Work without internet connection

### AI Improvements

- **Multi-language Support**: International language processing
- **Context Awareness**: Consider user's schedule and preferences
- **Smart Categorization**: Automatic task categorization
- **Predictive Text**: AI-powered task suggestions

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support and questions:

- Create an issue in the repository
- Check the documentation in the `/docs` folder
- Review the AI integration guides in the server and client directories

---

**Built with ❤️ using React, Node.js, and OpenAI**

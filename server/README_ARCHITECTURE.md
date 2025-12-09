# CrowsNest Backend Architecture

## Overview

This document outlines the backend architecture for the CrowsNest application using Prisma ORM, Hono.js, and TypeScript.

## Project Structure

```
server/
├── src/
│   ├── controllers/      # Request handlers
│   ├── routes/           # API route definitions
│   ├── services/         # Business logic & database operations
│   ├── middleware/       # Express/Hono middleware
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Helper utilities
├── prisma/
│   └── schema.prisma     # Database schema definition
├── .env                  # Environment variables
├── package.json
├── tsconfig.json
└── index.ts              # Main server entry point
```

## Database Schema

The database uses PostgreSQL with the following models:

### User
- Store user account information
- One-to-many with Projects, Notifications
- One-to-many with People

### Project
- Construction/building projects
- Tracks project metadata (name, address, status)
- Owns FloorPlans, Tasks, and People
- Belongs to a User

### FloorPlan
- Floor plan images/documents for projects
- Belongs to a Project

### Person
- Team members/workers on projects
- Tracks role (supervisor, worker, subcontractor, etc.)
- Belongs to both Project and User

### Task
- Project tasks/to-dos
- Tracks status (pending, in-progress, completed)
- Tracks priority (low, medium, high)
- Belongs to a Project

### Notification
- User notifications
- Tracks read status
- Belongs to a User

## API Routes

### Projects
- `GET /api/projects` - Get all projects for authenticated user
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Floor Plans
- `GET /api/:projectId/floor-plans` - Get project's floor plans
- `POST /api/:projectId/floor-plans` - Add floor plan
- `DELETE /api/floor-plans/:id` - Delete floor plan

### People
- `GET /api/:projectId/people` - Get project team members
- `POST /api/:projectId/people` - Add person to project
- `PUT /api/people/:id` - Update person
- `DELETE /api/people/:id` - Delete person

### Tasks
- `GET /api/:projectId/tasks` - Get project tasks
- `POST /api/:projectId/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark notification as read
- `DELETE /api/notifications/:id` - Delete notification

## Setup Instructions

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update the database URL:

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/crowsnest?schema=public"
PORT=3000
NODE_ENV=development
```

### 3. Generate Prisma Client

```bash
npm run prisma:generate
```

### 4. Run Migrations

```bash
npm run prisma:migrate
```

This will create all database tables based on the schema.

### 5. Start Development Server

```bash
npm run dev
```

Server will run on `http://localhost:3000`

## Client Integration

### API Client Layer
Located in `client/src/api/index.ts`, provides:
- `projectAPI` - Project operations
- `floorPlanAPI` - Floor plan operations
- `personAPI` - People management
- `taskAPI` - Task operations
- `notificationAPI` - Notification handling

### Custom Hooks
Located in `client/src/hooks/`:
- `useProjects()` - Project state management
- `useTasks()` - Task state management
- `usePeople()` - People state management
- `useNotifications()` - Notification state management

### Type Definitions
Shared types are defined in `client/src/types/index.ts`

## Authentication

Currently using simple `X-User-Id` header for user identification. 

**Important**: In production, implement proper JWT or OAuth authentication:

```typescript
const userId = c.req.header('X-User-Id');
if (!userId) {
  return c.json({ success: false, error: 'Unauthorized' }, 401);
}
```

## Error Handling

The server includes global error handling middleware in `src/middleware/index.ts`:

```typescript
export const errorHandler = async (c: Context, next: Next) => {
  try {
    await next();
  } catch (error) {
    console.error('Error:', error);
    return c.json(
      {
        success: false,
        error: error.message,
      },
      500
    );
  }
};
```

## Development Workflow

### 1. Database Changes
- Update `prisma/schema.prisma`
- Run migrations: `npm run prisma:migrate`
- This generates Prisma types automatically

### 2. Adding New Endpoints
- Create service in `src/services/`
- Create controller in `src/controllers/`
- Add routes in `src/routes/`
- Add route to `src/routes/index.ts`

### 3. Client Updates
- Update types in `client/src/types/index.ts`
- Add API functions in `client/src/api/index.ts`
- Create/update hooks in `client/src/hooks/`
- Use hooks in components

## Database Inspection

View and manage data with Prisma Studio:

```bash
npm run prisma:studio
```

Opens web UI at `http://localhost:5555`

## Deployment

### Production Build

```bash
npm run build
npm start
```

### Environment Variables
Ensure all environment variables are set in production:
- `DATABASE_URL` - PostgreSQL connection string
- `PORT` - Server port
- `NODE_ENV=production`

## Next Steps

1. **Authentication**: Implement JWT or OAuth
2. **Authorization**: Add role-based access control (RBAC)
3. **File Uploads**: Integrate cloud storage (S3, etc.)
4. **Caching**: Add Redis for performance
5. **Logging**: Setup proper logging (Winston, Pino)
6. **Testing**: Add unit and integration tests
7. **CI/CD**: Setup GitHub Actions or similar

## Resources

- [Prisma Documentation](https://www.prisma.io/docs/)
- [Hono Documentation](https://hono.dev/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

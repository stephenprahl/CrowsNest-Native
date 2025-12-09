# Client Architecture

## Overview

The client is an Expo/React Native mobile application with a clean separation of concerns:
- **Components** in `/app` - Handle UI and presentation
- **API Layer** in `/src/api` - Communicates with backend
- **Hooks** in `/src/hooks` - State management and data fetching
- **Types** in `/src/types` - Shared TypeScript definitions

## Folder Structure

```
client/
├── app/                    # Expo Router screens (UI only)
│   ├── _layout.tsx
│   ├── index.tsx          # Home/Projects screen
│   ├── notifications.tsx
│   ├── profile.tsx
│   ├── data.tsx
│   ├── support.tsx
│   ├── people.tsx
│   └── project/           # Project detail screens
├── src/                    # App logic
│   ├── api/               # API client layer
│   │   └── index.ts       # API functions
│   ├── hooks/             # Custom React hooks
│   │   ├── useProjects.ts
│   │   ├── useTasks.ts
│   │   └── useNotifications.ts
│   ├── types/             # TypeScript definitions
│   │   └── index.ts
│   └── state/             # Global state (if using context/zustand)
├── assets/                # Images, fonts, etc.
└── package.json
```

## Philosophy

### Separation of Concerns

**Keep the UI layer clean:**
- Components in `/app` should only handle presentation and layout
- Use hooks from `/src/hooks` for data fetching and state
- Never import API functions directly into components

**Example - Good:**
```tsx
// app/index.tsx
import { useProjects } from '../src/hooks/useProjects';

export default function Index() {
  const { projects, loading, fetchProjects } = useProjects(userId);
  
  useEffect(() => {
    fetchProjects();
  }, []);
  
  return (
    <FlatList
      data={projects}
      renderItem={/* render project */}
    />
  );
}
```

**Example - Bad:**
```tsx
// DON'T DO THIS
import { projectAPI } from '../src/api';

export default function Index() {
  useEffect(() => {
    projectAPI.getAll(userId).then(/* ... */);
  }, []);
}
```

## API Layer (`src/api/index.ts`)

Provides typed API functions for each resource:

```typescript
// Get projects
const response = await projectAPI.getAll(userId);

// Create project
const newProject = await projectAPI.create(
  { name, address, description },
  userId
);

// Update project
await projectAPI.update(id, { status: 'completed' });

// Delete project
await projectAPI.delete(id);
```

All API functions return `ApiResponse<T>` with proper error handling.

## Custom Hooks (`src/hooks/`)

Each major resource has a hook that handles:
- State management
- Loading/error states
- CRUD operations
- Automatic error handling

### useProjects Hook

```typescript
const {
  projects,           // Current projects array
  loading,           // Loading state
  error,             // Error message if any
  fetchProjects,     // Fetch all projects
  createProject,     // Create new project
  updateProject,     // Update project
  deleteProject,     // Delete project
} = useProjects(userId);

// Usage
useEffect(() => {
  fetchProjects();
}, []);

const handleCreate = async () => {
  const project = await createProject({
    name: 'New Project',
    address: 'Denver, CO'
  });
};
```

### useTasks Hook

```typescript
const {
  tasks,
  loading,
  error,
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
} = useTasks(projectId);
```

### useNotifications Hook

```typescript
const {
  notifications,
  loading,
  error,
  fetchNotifications,
  markAsRead,
  deleteNotification,
} = useNotifications(userId);
```

## Type System (`src/types/index.ts`)

Shared types between client and server ensure type safety:

```typescript
interface Project {
  id: string;
  name: string;
  address?: string;
  description?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  floorPlans?: FloorPlan[];
  people?: Person[];
  tasks?: Task[];
}

interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  dueDate?: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

// ... more types
```

## Environment Configuration

Set the API URL in environment variables:

```bash
# .env (create this file in client root)
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

For production, use the actual server URL.

## State Management Pattern

Each hook manages its own slice of state. For complex global state, consider:
- React Context API (simple cases)
- Zustand (recommended)
- Redux (if really needed)

Example with Context:

```typescript
// UserContext.ts
export const UserContext = React.createContext<User | null>(null);

export function useUser() {
  const user = React.useContext(UserContext);
  if (!user) throw new Error('useUser must be used within UserProvider');
  return user;
}
```

## Best Practices

### 1. Always Handle Loading States

```tsx
{loading && <ActivityIndicator />}
{error && <Text>{error}</Text>}
{!loading && projects.length > 0 && (
  <FlatList data={projects} /* ... */ />
)}
```

### 2. Implement Proper Error Recovery

```tsx
const handleRetry = async () => {
  setError(null);
  await fetchProjects();
};
```

### 3. Use useFocusEffect for Screen-Specific Data

```tsx
import { useFocusEffect } from 'expo-router';

export default function ProjectScreen() {
  const { fetchProjects } = useProjects(userId);

  useFocusEffect(
    React.useCallback(() => {
      fetchProjects();
    }, [])
  );
}
```

### 4. Debounce Rapid API Calls

```tsx
const debouncedSearch = React.useRef(
  debounce((query: string) => {
    searchProjects(query);
  }, 500)
).current;
```

### 5. Cache Data When Appropriate

```tsx
const [cachedData, setCachedData] = useState(null);

useEffect(() => {
  if (cachedData) {
    setData(cachedData);
  } else {
    fetchData();
  }
}, []);
```

## Data Flow

```
User Action
    ↓
Component calls hook method
    ↓
Hook calls API function
    ↓
API sends HTTP request to server
    ↓
Server returns response
    ↓
Hook updates local state
    ↓
Component re-renders
    ↓
User sees updated UI
```

## Next Steps

1. **Authentication**: Integrate with auth provider (Firebase, AWS Cognito)
2. **Persistent Storage**: Add AsyncStorage for offline support
3. **Real-time Updates**: Integrate WebSockets for live notifications
4. **File Uploads**: Handle image uploads for floor plans
5. **Error Boundary**: Add error boundary component
6. **Testing**: Add unit tests for hooks and components
7. **Performance**: Implement memoization and code splitting

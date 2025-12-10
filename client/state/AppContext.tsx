import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Project, Person, Task, Notification, FloorPlan } from '../types';
import { useProjects } from '../hooks/useProjects';
import { useTasks } from '../hooks/useTasks';
import { useNotifications } from '../hooks/useNotifications-fixed';

interface AppState {
  userId: string | null;
  projects: Project[];
  people: Person[];
  tasks: Task[];
  notifications: Notification[];
  floorPlans: FloorPlan[];
  loading: boolean;
  error: string | null;
}

interface AppContextType extends AppState {
  setUserId: (userId: string | null) => void;
  refreshData: () => Promise<void>;
  updateProject: (project: Project) => void;
  updatePerson: (person: Person) => void;
  updateTask: (task: Task) => void;
  updateNotification: (notification: Notification) => void;
  updateFloorPlan: (floorPlan: FloorPlan) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export { AppContext };

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [userId, setUserIdState] = useState<string | null>(null);

  const projectsHook = useProjects(userId || '');
  const tasksHook = useTasks(userId || '');
  const notificationsHook = useNotifications(userId || '');

  const setUserId = (userId: string | null) => {
    setUserIdState(userId);
  };

  const refreshData = async () => {
    if (!userId) return;

    await Promise.all([
      projectsHook.fetchProjects(),
      tasksHook.fetchTasks(),
      notificationsHook.fetchNotifications(),
    ]);
  };

  const updateProject = (project: Project) => {
    projectsHook.setProjects(projectsHook.projects.map(p => p.id === project.id ? project : p));
  };

  const updatePerson = (person: Person) => {
    // For now, we'll need to implement people hook
    console.log('Update person:', person);
  };

  const updateTask = (task: Task) => {
    tasksHook.setTasks(tasksHook.tasks.map(t => t.id === task.id ? task : t));
  };

  const updateNotification = (notification: Notification) => {
    notificationsHook.setNotifications(notificationsHook.notifications.map(n => n.id === notification.id ? notification : n));
  };

  const updateFloorPlan = (floorPlan: FloorPlan) => {
    // For now, we'll need to implement floor plan hook
    console.log('Update floor plan:', floorPlan);
  };

  useEffect(() => {
    if (userId) {
      refreshData();
    }
  }, [userId]);

  const contextValue: AppContextType = {
    userId,
    projects: projectsHook.projects,
    people: [], // TODO: implement people hook
    tasks: tasksHook.tasks,
    notifications: notificationsHook.notifications,
    floorPlans: [], // TODO: implement floor plans hook
    loading: projectsHook.loading || tasksHook.loading || notificationsHook.loading,
    error: projectsHook.error || tasksHook.error || notificationsHook.error,
    setUserId,
    refreshData,
    updateProject,
    updatePerson,
    updateTask,
    updateNotification,
    updateFloorPlan,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};
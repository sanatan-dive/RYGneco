

const TASKS_STORAGE_KEY = 'taskManager_tasks';
const USER_STORAGE_KEY = 'taskManager_user';
const CATEGORIES_STORAGE_KEY = 'taskManager_categories';

export const saveTasks = (tasks) => {
  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Failed to save tasks to localStorage:', error);
  }
};

export const loadTasks = () => {
  try {
    const tasksJson = localStorage.getItem(TASKS_STORAGE_KEY);
    if (!tasksJson) return [];
    
    const tasks = JSON.parse(tasksJson);
    return tasks.map((task) => ({
      ...task,
      createdAt: new Date(task.createdAt),
      dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
      priority: task.priority || 'medium',
      category: task.category || 'Personal'
    }));
  } catch (error) {
    console.error('Failed to load tasks from localStorage:', error);
    return [];
  }
};

export const saveUser = (username)=> {
  try {
    localStorage.setItem(USER_STORAGE_KEY, username);
  } catch (error) {
    console.error('Failed to save user to localStorage:', error);
  }
};

export const loadUser = () => {
  try {
    return localStorage.getItem(USER_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to load user from localStorage:', error);
    return null;
  }
};

export const clearUser = () => {
  try {
    localStorage.removeItem(USER_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear user from localStorage:', error);
  }
};

export const saveCategories = (categories)=> {
  try {
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
  } catch (error) {
    console.error('Failed to save categories to localStorage:', error);
  }
};

export const loadCategories = () => {
  try {
    const categoriesJson = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    if (!categoriesJson) return [];
    return JSON.parse(categoriesJson);
  } catch (error) {
    console.error('Failed to load categories from localStorage:', error);
    return [];
  }
};
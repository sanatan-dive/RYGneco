import React, { useState, useEffect, useMemo } from 'react';

import { saveTasks, loadTasks, clearUser, saveCategories, loadCategories } from '../utils/localStorage';
import { useTheme } from '../contexts/ThemeContext';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import TaskFilter from './TaskFilter';
import SearchBar from './SearchBar';
import { LogOut, User, Moon, Sun, Plus } from 'lucide-react';

const TaskDashboard = ({ username, onLogout }) => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState(['Personal', 'Work', 'Shopping']);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showTaskForm, setShowTaskForm] = useState(false);
  
  // Add loading states to prevent race conditions
  const [isTasksLoaded, setIsTasksLoaded] = useState(false);
  const [isCategoriesLoaded, setIsCategoriesLoaded] = useState(false);
  
  const { isDarkMode, toggleDarkMode } = useTheme();

  // Load data on mount
  useEffect(() => {
    const loadedTasks = loadTasks();
    const loadedCategories = loadCategories();
    
    setTasks(loadedTasks);
    setIsTasksLoaded(true); // Mark as loaded
    
    if (loadedCategories.length > 0) {
      setCategories(loadedCategories);
    }
    setIsCategoriesLoaded(true); // Mark as loaded
  }, []);

  // Save tasks only after they've been loaded initially
  useEffect(() => {
    if (isTasksLoaded) {
      saveTasks(tasks);
    }
  }, [tasks, isTasksLoaded]);

  // Save categories only after they've been loaded initially
  useEffect(() => {
    if (isCategoriesLoaded) {
      saveCategories(categories);
    }
  }, [categories, isCategoriesLoaded]);

  const addTask = (title, description, dueDate, priority = 'medium', category = 'Personal') => {
    const newTask = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      title,
      description,
      completed: false,
      createdAt: new Date(),
      dueDate,
      priority,
      category,
    };
    setTasks(prev => [newTask, ...prev]);
    
    // Add category if it doesn't exist
    if (!categories.includes(category)) {
      setCategories(prev => [...prev, category]);
    }
  };

  const toggleTaskComplete = (id) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const editTask = (id, title, description, dueDate, priority = 'medium', category= 'Personal') => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, title, description, dueDate, priority, category } : task
      )
    );
    
    // Add category if it doesn't exist
    if (!categories.includes(category)) {
      setCategories(prev => [...prev, category]);
    }
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const handleLogout = () => {
    clearUser();
    onLogout();
  };

  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks;

    // Filter by completion status
    switch (activeFilter) {
      case 'completed':
        filtered = filtered.filter(task => task.completed);
        break;
      case 'pending':
        filtered = filtered.filter(task => !task.completed);
        break;
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(task => task.category === selectedCategory);
    }

    // Sort tasks
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return filtered;
  }, [tasks, activeFilter, searchQuery, selectedCategory, sortBy]);

  const taskCounts = useMemo(() => ({
    all: tasks.length,
    completed: tasks.filter(task => task.completed).length,
    pending: tasks.filter(task => !task.completed).length,
  }), [tasks]);

  const overdueTasks = useMemo(() => {
    const now = new Date();
    return tasks.filter(task => 
      !task.completed && 
      task.dueDate && 
      new Date(task.dueDate) < now
    ).length;
  }, [tasks]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8 animate-slideDown">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center space-x-3 mb-4 lg:mb-0">
              <div className="bg-blue-100 dark:bg-blue-900 w-12 h-12 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back, {username}!</h1>
                <p className="text-gray-600 dark:text-gray-300">
                  {overdueTasks > 0 && (
                    <span className="text-red-500 font-medium">
                      {overdueTasks} overdue task{overdueTasks > 1 ? 's' : ''} • 
                    </span>
                  )} Let's get things done today
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleDarkMode}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 transform hover:scale-110"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Add Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowTaskForm(!showTaskForm)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg transform hover:scale-[1.02] active:scale-[0.98] animate-fadeIn"
          >
            <Plus className={`w-5 h-5 transition-transform duration-200 ${showTaskForm ? 'rotate-45' : ''}`} />
            <span>{showTaskForm ? 'Cancel' : 'Add New Task'}</span>
          </button>
        </div>

        {/* Task Form */}
        {showTaskForm && (
          <div className="mb-8 animate-slideDown">
            <TaskForm 
              onAddTask={addTask} 
              categories={categories}
              onClose={() => setShowTaskForm(false)}
            />
          </div>
        )}

        {/* Search and Controls */}
        <div className="mb-6 space-y-4">
          <SearchBar 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {/* Task Filters */}
        <TaskFilter
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          counts={taskCounts}
        />

        {/* Task List */}
        <TaskList
          tasks={filteredAndSortedTasks}
          onToggleComplete={toggleTaskComplete}
          onEditTask={editTask}
          onDeleteTask={deleteTask}
          categories={categories}
        />
      </div>
    </div>
  );
};

export default TaskDashboard;
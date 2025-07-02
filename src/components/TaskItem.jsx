import React, { useState } from 'react';

import { CheckCircle, Circle, Edit2, Trash2, Calendar, Flag, Tag, Clock } from 'lucide-react';
import TaskForm from './TaskForm';



const TaskItem= ({ task, onToggleComplete, onEditTask, onDeleteTask, categories }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleEdit = (title, description, dueDate, priority, category) => {
    onEditTask(task.id, title, description, dueDate, priority, category);
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDeleteTask(task.id);
    setShowDeleteConfirm(false);
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const isOverdue = task.dueDate && !task.completed && new Date(task.dueDate) < new Date();
  const isDueSoon = task.dueDate && !task.completed && 
    new Date(task.dueDate).getTime() - new Date().getTime() < 24 * 60 * 60 * 1000;

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
    }
  };

  const getCategoryColor = (category) => {
    const colors = [
      'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400',
      'text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400',
      'text-pink-600 bg-pink-100 dark:bg-pink-900/30 dark:text-pink-400',
      'text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400',
    ];
    const index = category.length % colors.length;
    return colors[index];
  };

  if (isEditing) {
    return (
      <div className="animate-slideDown">
        <TaskForm
          onAddTask={handleEdit}
          categories={categories}
          onClose={() => setIsEditing(false)}
          initialData={{
            title: task.title,
            description: task.description,
            dueDate: task.dueDate,
            priority: task.priority,
            category: task.category,
          }}
          isEditing={true}
        />
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border transition-all duration-300 hover:shadow-lg transform hover:scale-[1.01] animate-fadeIn ${
      task.completed 
        ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10' 
        : isOverdue 
          ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10'
          : 'border-gray-200 dark:border-gray-700'
    }`}>
      <div className="p-6">
        <div className="flex items-start space-x-4">
          <button
            onClick={() => onToggleComplete(task.id)}
            className={`mt-1 transition-all duration-200 transform hover:scale-110 ${
              task.completed ? 'text-green-600 dark:text-green-400' : 'text-gray-400 hover:text-green-500'
            }`}
          >
            {task.completed ? (
              <CheckCircle className="w-6 h-6" />
            ) : (
              <Circle className="w-6 h-6" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                <Flag className="w-3 h-3 inline mr-1" />
                {task.priority.toUpperCase()}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(task.category)}`}>
                <Tag className="w-3 h-3 inline mr-1" />
                {task.category}
              </span>
              {isOverdue && (
                <span className="px-2 py-1 rounded-full text-xs font-medium text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400 animate-pulse">
                  <Clock className="w-3 h-3 inline mr-1" />
                  OVERDUE
                </span>
              )}
              {isDueSoon && !isOverdue && (
                <span className="px-2 py-1 rounded-full text-xs font-medium text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400">
                  <Clock className="w-3 h-3 inline mr-1" />
                  DUE SOON
                </span>
              )}
            </div>

            <h3 className={`text-lg font-semibold transition-all duration-200 ${
              task.completed 
                ? 'text-green-800 dark:text-green-300 line-through' 
                : 'text-gray-900 dark:text-white'
            }`}>
              {task.title}
            </h3>
            
            {task.description && (
              <p className={`mt-2 transition-all duration-200 ${
                task.completed 
                  ? 'text-green-600 dark:text-green-400 line-through' 
                  : 'text-gray-600 dark:text-gray-300'
              }`}>
                {task.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                <span>Created {formatDate(task.createdAt)}</span>
              </div>
              {task.dueDate && (
                <div className={`flex items-center ${isOverdue ? 'text-red-600 dark:text-red-400 font-medium' : ''}`}>
                  <Clock className="w-4 h-4 mr-1" />
                  <span>Due {formatDate(task.dueDate)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => setIsEditing(true)}
              className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 transform hover:scale-110"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200 transform hover:scale-110"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 px-6 py-4 rounded-b-xl animate-slideDown">
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
            Are you sure you want to delete this task? This action cannot be undone.
          </p>
          <div className="flex space-x-2">
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 transform hover:scale-105"
            >
              Delete
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 text-sm font-medium rounded-lg transition-colors duration-200 transform hover:scale-105"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskItem;
import React from 'react';

import TaskItem from './TaskItem';
import { ListTodo } from 'lucide-react';



const TaskList= ({ tasks, onToggleComplete, onEditTask, onDeleteTask, categories }) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-16 animate-fadeIn">
        <div className="bg-gray-100 dark:bg-gray-700 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
          <ListTodo className="w-12 h-12 text-gray-400 dark:text-gray-500" />
        </div>
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">No tasks found</h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto text-lg">
          Get started by creating your first task. Stay organized and productive!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task, index) => (
        <div
          key={task.id}
          style={{ animationDelay: `${index * 50}ms` }}
          className="animate-slideUp"
        >
          <TaskItem
            task={task}
            onToggleComplete={onToggleComplete}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
            categories={categories}
          />
        </div>
      ))}
    </div>
  );
};

export default TaskList;
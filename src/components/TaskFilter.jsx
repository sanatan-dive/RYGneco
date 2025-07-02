import React from 'react';
import { ListTodo, CheckCircle, Clock } from 'lucide-react';



const TaskFilter = ({ activeFilter, onFilterChange, counts }) => {
  const filters = [
    { 
      key: 'all' , 
      label: 'All Tasks', 
      count: counts.all, 
      icon: ListTodo,
      color: 'blue'
    },
    { 
      key: 'pending' , 
      label: 'Pending', 
      count: counts.pending, 
      icon: Clock,
      color: 'amber'
    },
    { 
      key: 'completed' , 
      label: 'Completed', 
      count: counts.completed, 
      icon: CheckCircle,
      color: 'green'
    },
  ];

  const getButtonClasses = (filter, color) => {
    const isActive = activeFilter === filter;
    const baseClasses = "flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 active:scale-95";
    
    if (isActive) {
      const activeColors = {
        blue: 'bg-blue-600 text-white shadow-lg',
        amber: 'bg-amber-600 text-white shadow-lg',
        green: 'bg-green-600 text-white shadow-lg'
      };
      return `${baseClasses} ${activeColors[ activeColors]}`;
    }
    
    const hoverColors = {
      blue: 'hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-200 dark:hover:border-blue-700',
      amber: 'hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:border-amber-200 dark:hover:border-amber-700',
      green: 'hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-200 dark:hover:border-green-700'
    };
    
    return `${baseClasses} bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 ${hoverColors[hoverColors]} shadow-sm`;
  };

  return (
    <div className="flex flex-wrap gap-3 mb-6 animate-fadeIn">
      {filters.map(({ key, label, count, icon: Icon, color }) => (
        <button
          key={key}
          onClick={() => onFilterChange(key)}
          className={getButtonClasses(key, color)}
        >
          <Icon className="w-5 h-5" />
          <span>{label}</span>
          <span className={`px-2 py-1 rounded-full text-xs font-bold transition-all duration-200 ${
            activeFilter === key 
              ? 'bg-white bg-opacity-20 text-white' 
              : `bg-${color}-100 dark:bg-${color}-900/30 text-${color}-800 dark:text-${color}-400`
          }`}>
            {count}
          </span>
        </button>
      ))}
    </div>
  );
};

export default TaskFilter;
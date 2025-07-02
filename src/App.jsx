import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import TaskDashboard from './components/TaskDashboard';
import { saveUser, loadUser } from './utils/localStorage';

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const loadedUser = loadUser();
      setUser(loadedUser);
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLogin = (username) => {
    try {
      saveUser(username);
      setUser(username);
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 flex items-center space-x-4">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-lg font-medium text-gray-700">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      {user ? (
        <TaskDashboard username={user} onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}

      
    </div>
  );
}

export default App;
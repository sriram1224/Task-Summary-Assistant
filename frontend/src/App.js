import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { Toaster } from "sonner";

import "./App.css";
import { TaskProvider } from "./context/TaskContext";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./components/Home";
import Footer from "./components/Footer";
import Tasks from "./components/Tasks";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Summary from "./components/Summary";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = loading

  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem("token");
      setIsAuthenticated(!!token);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return (
    <TaskProvider>
      <Toaster position="top-right" richColors />
      <Router>
        {isAuthenticated ? (
          // When token exists, show full app layout
          <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
            <Navbar
              isAuthenticated={isAuthenticated}
              setIsAuthenticated={setIsAuthenticated}
            />
            <div className="flex flex-1 mt-16">
              <Sidebar />
              <div className="flex-1 flex flex-col">
                <Routes>
                  <Route path="/summary" element={<Summary />} />
                  <Route
                    path="/tasks"
                    element={
                      <ProtectedRoute>
                        <Tasks />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/" element={<Home />} />
                </Routes>
              </div>
            </div>
            <Footer />
          </div>
        ) : (
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
            <Navbar
              isAuthenticated={isAuthenticated}
              setIsAuthenticated={setIsAuthenticated}
            />
            <Routes>
              <Route
                path="/login"
                element={<Login onLogin={() => setIsAuthenticated(true)} />}
              />
              <Route path="/signup" element={<Signup />} />
              <Route path="*" element={<Login />} />
            </Routes>
          </div>
        )}
      </Router>
    </TaskProvider>
  );
}

export default App;


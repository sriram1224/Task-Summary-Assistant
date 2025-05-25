import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

const TaskContext = createContext();

const API_URL = "https://task-summary-assistant.onrender.com/todos/";

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(API_URL, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log("Fetched task data:", data); // 👈 log what actually comes back

      if (Array.isArray(data)) {
        const filtered = data.filter((task) => !task.completed);
        setTasks(filtered.reverse());
      } else {
        toast.error("Invalid data format from server");
        console.error("Expected array but got:", data);
      }
    } catch (err) {
      toast.error("Failed to fetch tasks");
      console.error("Fetch tasks error:", err);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (taskData) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskData),
      });
      toast.success("Task created successfully");
      fetchTasks();
    } catch (err) {
      toast.error("Failed to add task");
      console.error("Add task error:", err);
    }
  };

  const updateTask = async (id, taskData) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_URL}${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskData),
      });
      toast.success("Task updated successfully");
      fetchTasks();
    } catch (err) {
      toast.error("Failed to update task");
      console.error("Update task error:", err);
    }
  };

  const deleteTask = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_URL}${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Task deleted successfully");
      fetchTasks();
    } catch (err) {
      toast.error("Failed to delete task");
      console.error("Delete task error:", err);
    }
  };

  const markComplete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_URL}${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ completed: true }),
      });
      toast.success("Task marked as completed");
      fetchTasks();
    } catch (err) {
      toast.error("Failed to mark task completed");
      console.error("Complete task error:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        addTask,
        updateTask,
        deleteTask,
        markComplete,
        fetchTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);

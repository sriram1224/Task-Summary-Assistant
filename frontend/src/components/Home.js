/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_URL = "https://task-summary-assistant.onrender.com/todos/";

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
      console.log("Fetched task data:", data);

      if (Array.isArray(data)) {
        const filtered = data.filter((task) => !task.completed);
        const completed = data.filter((task) => task.completed);
        setTasks([...filtered.reverse(), ...completed.reverse()]);
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

  useEffect(() => {
    fetchTasks();
  }, []);

  const incompleteTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  return (
    <main className="flex-1 p-8 bg-gray-50">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Incomplete Tasks */}
        <div className="bg-white p-4 rounded-lg shadow border">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Incomplete Tasks
          </h2>
          {loading ? (
            <p>Loading...</p>
          ) : incompleteTasks.length === 0 ? (
            <p>No incomplete tasks.</p>
          ) : (
            <ul className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {incompleteTasks.map((task) => (
                <li
                  key={task._id}
                  className="flex items-start bg-gray-50 p-4 rounded-lg shadow-sm"
                >
                  <div>
                    <div className="font-semibold text-gray-800 text-lg">
                      {task.title}
                    </div>
                    {task.description && (
                      <p className="text-sm text-gray-600">
                        {task.description}
                      </p>
                    )}
                    {task.dueDate && (
                      <div className="text-sm text-gray-500 mt-1">
                        Due:{" "}
                        {new Date(task.dueDate).toLocaleDateString("en-GB")}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white p-4 rounded-lg shadow border">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Completed Tasks
          </h2>
          {loading ? (
            <p>Loading...</p>
          ) : completedTasks.length === 0 ? (
            <p>No tasks completed yet.</p>
          ) : (
            <ul className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {completedTasks.map((task) => (
                <li
                  key={task._id}
                  className="bg-green-50 p-4 rounded-lg shadow-sm"
                >
                  <div className="font-semibold text-green-800 text-lg line-through">
                    {task.title}
                  </div>
                  {task.description && (
                    <p className="text-sm text-gray-600 line-through">
                      {task.description}
                    </p>
                  )}
                  {task.dueDate && (
                    <div className="text-sm text-gray-500 mt-1">
                      Due: {new Date(task.dueDate).toLocaleDateString("en-GB")}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
};

export default Home;

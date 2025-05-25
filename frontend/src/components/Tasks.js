/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import { toast, Toaster } from "sonner";
import { useTasks } from "../context/TaskContext";

const Tasks = () => {
  const { tasks, loading, addTask, updateTask, deleteTask, markComplete } =
    useTasks();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Work");
  const [labels, setLabels] = useState([]);
  const [dueDate, setDueDate] = useState(null);
  const [recurrence, setRecurrence] = useState("none");
  const [recurrenceDays, setRecurrenceDays] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [selectedLabels, setSelectedLabels] = useState([]);

  const availableLabels = [
    { name: "Urgent", color: "bg-red-500" },
    { name: "Deadline", color: "bg-yellow-500" },
    { name: "Important", color: "bg-blue-500" },
    { name: "Optional", color: "bg-gray-400" },
  ];
  const formatDateToISO = (date) => {
    const parsedDate = new Date(date);
    return isNaN(parsedDate.getTime()) ? null : parsedDate.toISOString();
  };

  const toggleLabel = (labelName) => {
    setSelectedLabels((prev) =>
      prev.includes(labelName)
        ? prev.filter((l) => l !== labelName)
        : [...prev, labelName]
    );
  };

  const handleAddTask = async () => {
    if (!title.trim()) return;
    const newTask = {
      title,
      description,
      labels: selectedLabels,
      category,
      dueDate: formatDateToISO(dueDate),
      recurrence,
      recurrenceDays,
    };
    await addTask(newTask);
    resetForm();
  };

  const handleUpdate = async () => {
    if (!editingTaskId) return;
    const updatedTask = {
      title,
      description,
      category,
      labels: selectedLabels,
      dueDate,
      recurrence,
      recurrenceDays,
    };
    await updateTask(editingTaskId, updatedTask);
    resetForm();
  };

  const startEditing = (task) => {
    setEditingTaskId(task._id);
    setTitle(task.title);
    setDescription(task.description || "");
    setCategory(task.category || "Work");
    setLabels(task.labels || []);
    setSelectedLabels(task.labels || []);
    setDueDate(task.dueDate || null);
    setRecurrence(task.recurrence || "none");
    setRecurrenceDays(task.recurrenceDays || []);
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("Work");
    setLabels([]);
    setSelectedLabels([]);
    setDueDate(null);
    setRecurrence("none");
    setRecurrenceDays([]);
    setEditingTaskId(null);
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <>
      <Toaster position="top-right" richColors />
      <div className="max-w-6xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
          <div className="border border-gray-300 rounded-lg p-4 mb-6">
            <input
              type="text"
              placeholder="Task title"
              className="w-full text-lg font-medium text-gray-800 border-none focus:outline-none"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              placeholder="Optional description..."
              className="w-full mt-2 text-sm text-gray-600 resize-none focus:outline-none"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>Work</option>
                <option>Personal</option>
                <option>Family</option>
                <option>Events</option>
              </select>
            </div>
            <div className="mt-4">
              <div className="text-sm font-medium mb-2 text-gray-700">
                Select Labels:
              </div>
              <div className="flex flex-wrap gap-2">
                {availableLabels.map((label) => (
                  <button
                    key={label.name}
                    type="button"
                    onClick={() => toggleLabel(label.name)}
                    className={`text-white px-3 py-1 text-xs rounded-full cursor-pointer transition ${
                      label.color
                    } ${
                      selectedLabels.includes(label.name)
                        ? "opacity-100"
                        : "opacity-50"
                    }`}
                  >
                    #{label.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700">
                Due Date
              </label>
              <Datepicker
                value={dueDate}
                onChange={(date) => setDueDate(date)}
                asSingle={true}
                useRange={false}
                minDate={today}
                displayFormat={"DD/MM/YYYY"}
                classNames={{
                  input:
                    "w-full border border-gray-300 rounded-md shadow-sm mt-1",
                }}
              />
            </div>
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700">
                Recurrence
              </label>
              <select
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                value={recurrence}
                onChange={(e) => setRecurrence(e.target.value)}
              >
                <option value="none">None</option>
                <option value="daily">Daily</option>
                <option value="monthly">Monthly</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            {recurrence === "custom" && (
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700">
                  Select Days
                </label>
                <div className="grid grid-cols-7 gap-2 mt-1">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                      <label key={day} className="flex items-center">
                        <input
                          type="checkbox"
                          className="mr-1"
                          checked={recurrenceDays.includes(day)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setRecurrenceDays([...recurrenceDays, day]);
                            } else {
                              setRecurrenceDays(
                                recurrenceDays.filter((d) => d !== day)
                              );
                            }
                          }}
                        />
                        {day}
                      </label>
                    )
                  )}
                </div>
              </div>
            )}
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={resetForm}
                className="text-sm px-4 py-1 rounded bg-gray-100 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={editingTaskId ? handleUpdate : handleAddTask}
                className="text-sm px-4 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                {editingTaskId ? "Update Task" : "Add Task"}
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Tasks</h2>
          <ul className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            {loading ? (
              <li>Loading...</li>
            ) : (
              tasks.map((task) => (
                <li
                  key={task._id}
                  className="flex items-start justify-between p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition"
                >
                  <div className="flex gap-3">
                    <input
                      type="checkbox"
                      className="appearance-none w-5 h-5 border-2 border-blue-500 rounded-full checked:bg-blue-500 checked:border-transparent focus:outline-none transition"
                      onChange={() => markComplete(task._id)}
                    />
                    <div>
                      <div className="font-semibold text-gray-800 text-lg">
                        {task.title}
                      </div>
                      {task.description && (
                        <div className="text-sm text-gray-600 mt-1">
                          {task.description}
                        </div>
                      )}
                      <div className="text-sm text-gray-500 mt-1">
                        Category: {task.category}
                      </div>
                      {task.labels?.length > 0 && (
                        <div className="flex flex-wrap mt-2 gap-1">
                          {task.labels.map((label, idx) => (
                            <span
                              key={idx}
                              className="text-xs px-2 py-0.5 bg-gray-200 text-gray-800 rounded-full"
                            >
                              #{label}
                            </span>
                          ))}
                        </div>
                      )}
                      {task.dueDate && (
                        <div className="text-sm text-gray-500 mt-1">
                          Due Date:{" "}
                          {new Date(task.dueDate).toLocaleDateString("en-GB")}
                        </div>
                      )}
                      {task.recurrence && (
                        <div className="text-sm text-gray-500 mt-1">
                          Recurrence: {task.recurrence}
                        </div>
                      )}
                      {task.recurrence === "custom" &&
                        task.recurrenceDays?.length > 0 && (
                          <div className="text-sm text-gray-500 mt-1">
                            Recurs on: {task.recurrenceDays.join(", ")}
                          </div>
                        )}
                    </div>
                  </div>
                  <div className="space-x-2 text-sm text-right">
                    <button
                      onClick={() => startEditing(task)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTask(task._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Tasks;

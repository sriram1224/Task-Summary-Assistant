const Todo = require("../models/Todo");

exports.getTodo = async (req, res) => {
  console.log("Get Todo");
  console.log(req.user._id);
  try {
    const todos = await Todo.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(todos);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching todos", error: error.message });
  }
};

exports.createTodo = async (req, res) => {
  const {
    title,
    description,
    category,
    labels,
    dueDate,
    recurrence,
    recurrenceDays,
  } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  try {
    const newTodo = new Todo({
      userId: req.user._id,
      title,
      description,
      category,
      labels,
      dueDate,
      recurrence,
      recurrenceDays,
    });

    const savedTodo = await newTodo.save();

    res.status(201).json(savedTodo);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating todo", error: error.message });
  }
};

exports.updateTodo = async (req, res) => {
  const {
    title,
    description,
    completed,
    category,
    labels,
    dueDate,
    recurrence,
    recurrenceDays,
  } = req.body;
  const { id } = req.params;

  try {
    const todo = await Todo.findOne({ _id: id, userId: req.user._id });

    if (!todo) {
      return res
        .status(404)
        .json({ message: "Todo not found or unauthorized" });
    }

    if (title !== undefined) todo.title = title;
    if (description !== undefined) todo.description = description;
    if (typeof completed === "boolean") todo.completed = completed;
    if (category !== undefined) todo.category = category;
    if (labels !== undefined) todo.labels = labels;
    if (dueDate !== undefined) todo.dueDate = dueDate;
    if (recurrence !== undefined) todo.recurrence = recurrence;
    if (recurrenceDays !== undefined) todo.recurrenceDays = recurrenceDays;

    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating todo", error: error.message });
  }
};

exports.deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Todo.findOneAndDelete({
      _id: id,
      userId: req.user._id,
    });

    if (!deleted) {
      return res
        .status(404)
        .json({ message: "Todo not found or unauthorized" });
    }

    res.json({ message: "Todo deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting todo", error: error.message });
  }
};

const Task = require("../models/Task");

exports.createTask = async (req, res) => {
  try {
    const task = await Task.create(req.body);

    req.io.emit("taskCreated", task);

    res.json(task);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
  userId: req.user.id
})

    res.json(tasks);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    req.io.emit("taskUpdated", task);

    res.json(task);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);

    req.io.emit("taskDeleted", req.params.id);

    res.json("Deleted");
  } catch (err) {
    res.status(500).json(err);
  }
};
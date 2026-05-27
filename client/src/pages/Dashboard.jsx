import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  motion,
  AnimatePresence
} from "framer-motion";

import toast, {
  Toaster
} from "react-hot-toast";

function Dashboard() {

  const API = "http://localhost:5000/api/tasks";

  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] = useState(false);

  const [filter, setFilter] = useState("All");

  const [search, setSearch] = useState("");

  const [editingTask, setEditingTask] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    priority: "Medium",
    status: "Todo",
    dueDate: ""
  });

  const [editData, setEditData] = useState({
    title: "",
    priority: "Medium",
    status: "Todo",
    dueDate: ""
  });

  // FETCH TASKS

  const fetchTasks = async () => {

    try {

      setLoading(true);

      const res = await axios.get(API);

      setTasks(res.data.reverse());

    } catch (err) {

      toast.error("Failed to load tasks");

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // ADD TASK

  const addTask = async () => {

    if (!formData.title.trim()) {
      toast.error("Task title required");
      return;
    }

    try {

      await axios.post(API, formData);

      toast.success("Task Added");

      setFormData({
        title: "",
        priority: "Medium",
        status: "Todo",
        dueDate: ""
      });

      fetchTasks();

    } catch (err) {

      toast.error("Failed to add task");
    }
  };

  // DELETE TASK

  const deleteTask = async (id) => {

    try {

      await axios.delete(`${API}/${id}`);

      toast.success("Task Deleted");

      fetchTasks();

    } catch (err) {

      toast.error("Delete failed");
    }
  };

  // OPEN EDIT MODAL

  const openEditModal = (task) => {

    setEditingTask(task);

    setEditData({
      title: task.title,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate?.slice(0, 10) || ""
    });
  };

  // UPDATE TASK

  const updateTask = async () => {

    try {

      await axios.put(
        `${API}/${editingTask._id}`,
        editData
      );

      toast.success("Task Updated");

      setEditingTask(null);

      fetchTasks();

    } catch (err) {

      toast.error("Update failed");
    }
  };

  // FILTERED TASKS

  const filteredTasks = useMemo(() => {

    return tasks.filter((task) => {

      const matchesFilter =
        filter === "All"
          ? true
          : task.status === filter;

      const matchesSearch =
        task.title
          .toLowerCase()
          .includes(search.toLowerCase());

      return matchesFilter && matchesSearch;
    });

  }, [tasks, filter, search]);

  // COLORS

  const priorityColor = (priority) => {

    switch (priority) {

      case "High":
        return "bg-red-500/20 text-red-400 border border-red-500/20";

      case "Medium":
        return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/20";

      default:
        return "bg-green-500/20 text-green-400 border border-green-500/20";
    }
  };

  const statusColor = (status) => {

    switch (status) {

      case "Completed":
        return "text-green-400";

      case "In Progress":
        return "text-blue-400";

      default:
        return "text-slate-400";
    }
  };

  // STATS

  const completedCount =
    tasks.filter(
      task => task.status === "Completed"
    ).length;

  const pendingCount =
    tasks.filter(
      task => task.status !== "Completed"
    ).length;

  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white p-6">

      <Toaster />

      {/* HEADER */}

      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row justify-between gap-6 mb-10"
      >

        <div>

          <h1 className="text-5xl font-extrabold tracking-tight">
            TaskFlow Pro
          </h1>

          <p className="text-slate-400 mt-3">
            Manage your productivity efficiently
          </p>

        </div>

        {/* STATS */}

        <div className="grid grid-cols-3 gap-4">

          <div className="bg-slate-900 border border-slate-800 px-6 py-4 rounded-2xl">
            <p className="text-slate-400 text-sm">
              Total
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {tasks.length}
            </h2>
          </div>

          <div className="bg-slate-900 border border-slate-800 px-6 py-4 rounded-2xl">
            <p className="text-slate-400 text-sm">
              Pending
            </p>

            <h2 className="text-3xl font-bold mt-2 text-yellow-400">
              {pendingCount}
            </h2>
          </div>

          <div className="bg-slate-900 border border-slate-800 px-6 py-4 rounded-2xl">
            <p className="text-slate-400 text-sm">
              Completed
            </p>

            <h2 className="text-3xl font-bold mt-2 text-green-400">
              {completedCount}
            </h2>
          </div>

        </div>

      </motion.div>

      {/* SEARCH + FILTER */}

      <div className="flex flex-col md:flex-row gap-4 mb-8">

        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="flex-1 bg-slate-900 border border-slate-800 p-4 rounded-xl"
        />

        <select
          value={filter}
          onChange={(e) =>
            setFilter(e.target.value)
          }
          className="bg-slate-900 border border-slate-800 p-4 rounded-xl"
        >
          <option>All</option>
          <option>Todo</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>

      </div>

      {/* FORM */}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl mb-10">

        <div className="grid md:grid-cols-5 gap-4">

          <input
            type="text"
            placeholder="Enter task title..."
            value={formData.title}
            onChange={(e) =>
              setFormData({
                ...formData,
                title: e.target.value
              })
            }
            className="md:col-span-2 bg-slate-800 border border-slate-700 p-4 rounded-xl outline-none"
          />

          <input
            type="date"
            value={formData.dueDate}
            onChange={(e) =>
              setFormData({
                ...formData,
                dueDate: e.target.value
              })
            }
            className="bg-slate-800 border border-slate-700 p-4 rounded-xl"
          />

          <select
            value={formData.priority}
            onChange={(e) =>
              setFormData({
                ...formData,
                priority: e.target.value
              })
            }
            className="bg-slate-800 border border-slate-700 p-4 rounded-xl"
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>

          <button
            onClick={addTask}
            className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 rounded-xl font-semibold"
          >
            Add Task
          </button>

        </div>

      </div>

      {/* TASK GRID */}

      {loading ? (

        <div className="text-center text-slate-400 mt-20">
          Loading tasks...
        </div>

      ) : filteredTasks.length === 0 ? (

        <div className="text-center text-slate-500 mt-24">
          <h2 className="text-3xl font-bold">
            No Tasks Found
          </h2>
        </div>

      ) : (

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

          <AnimatePresence>

            {filteredTasks.map((task) => (

              <motion.div
                key={task._id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                whileHover={{
                  scale: 1.03,
                  y: -5
                }}
                className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl"
              >

                <div className="flex justify-between items-start gap-4">

                  <div>

                    <h2 className="text-2xl font-bold break-words">
                      {task.title}
                    </h2>

                    <p className={`mt-2 ${statusColor(task.status)}`}>
                      {task.status}
                    </p>

                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${priorityColor(task.priority)}`}
                  >
                    {task.priority}
                  </span>

                </div>

                {task.dueDate && (

                  <p className="text-slate-500 text-sm mt-4">
                    Due:
                    {" "}
                    {new Date(task.dueDate).toLocaleDateString()}
                  </p>

                )}

                <div className="flex gap-3 mt-6">

                  <button
                    onClick={() => openEditModal(task)}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 py-3 rounded-xl font-semibold"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteTask(task._id)}
                    className="flex-1 bg-red-500 hover:bg-red-600 py-3 rounded-xl font-semibold"
                  >
                    Delete
                  </button>

                </div>

              </motion.div>

            ))}

          </AnimatePresence>

        </div>

      )}

      {/* EDIT MODAL */}

      {editingTask && (

        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">

          <motion.div
            initial={{
              scale: 0.7,
              opacity: 0
            }}
            animate={{
              scale: 1,
              opacity: 1
            }}
            className="bg-slate-900 border border-slate-700 p-8 rounded-2xl w-[90%] max-w-md"
          >

            <h2 className="text-3xl font-bold mb-6">
              Edit Task
            </h2>

            <div className="space-y-4">

              <input
                type="text"
                value={editData.title}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    title: e.target.value
                  })
                }
                className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl"
              />

              <input
                type="date"
                value={editData.dueDate}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    dueDate: e.target.value
                  })
                }
                className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl"
              />

              <select
                value={editData.priority}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    priority: e.target.value
                  })
                }
                className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>

              <select
                value={editData.status}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    status: e.target.value
                  })
                }
                className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl"
              >
                <option>Todo</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>

              <div className="flex gap-4 pt-4">

                <button
                  onClick={updateTask}
                  className="flex-1 bg-green-500 hover:bg-green-600 py-3 rounded-xl font-semibold"
                >
                  Save
                </button>

                <button
                  onClick={() =>
                    setEditingTask(null)
                  }
                  className="flex-1 bg-slate-700 hover:bg-slate-600 py-3 rounded-xl font-semibold"
                >
                  Cancel
                </button>

              </div>

            </div>

          </motion.div>

        </div>
      )}

    </div>
  );
}

export default Dashboard;
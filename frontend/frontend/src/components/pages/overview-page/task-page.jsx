import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, Clock, AlertTriangle } from "lucide-react";

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          "http://localhost:5000/api/tasks",
          {
            headers: {
              Authorization: token,
            },
          }
        );

        const data = await res.json();
        setTasks(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading) {
    return (
      <div className="pt-24 text-center text-lg">
        Loading tasks...
      </div>
    );
  }

  return (
    <div className="pt-24 px-6 bg-gray-50 min-h-screen">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Tasks</h1>

        <Link
          to="/tasks/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          + Create Task
        </Link>
      </div>

      {tasks.length === 0 ? (
        <p className="text-gray-500">No tasks found</p>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="bg-white p-5 rounded-xl shadow flex justify-between items-center"
            >
              {/* LEFT */}
              <div>
                <h2 className="font-semibold text-lg">
                  {task.title}
                </h2>

                <p className="text-sm text-gray-500">
                  {task.priority} •{" "}
                  {task.project?.name || "No Project"}
                </p>
              </div>

              {/* STATUS */}
              <div className="flex items-center gap-2">
                {task.status === "Done" && (
                  <CheckCircle className="text-green-600" />
                )}

                {task.status === "In Progress" && (
                  <Clock className="text-blue-600" />
                )}

                {task.status === "To Do" && (
                  <AlertTriangle className="text-yellow-600" />
                )}

                <span>{task.status}</span>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-2">
                <Link
                  to={`/tasks/${task._id}/edit`}
                  className="text-yellow-600"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TasksPage;
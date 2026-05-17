import React, {
  useEffect,
  useState,
} from "react";

import { Link } from "react-router-dom";

import TaskStatusChart from "../../component/TaskStatusChart";
import TaskOverview from "../../Taskovrview/TaskOverview";
import TaskLineChart from "../../component/TaskLineChart";

import {
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Clock3,
  AlertTriangle,
  FolderKanban,
} from "lucide-react";

function DashboardPage() {

  const [tasks, setTasks] =
    useState([]);

  const [projects, setProjects] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  /* =========================
     FETCH TASKS + PROJECTS
  ========================= */

  useEffect(() => {

    const fetchData = async () => {

      try {

        const token =
          localStorage.getItem("token");

        /* TASKS */

        const taskRes = await fetch(
          "http://localhost:5000/api/tasks",
          {
            headers: {
              Authorization: token,
            },
          }
        );

        const taskData =
          await taskRes.json();

        if (taskRes.ok) {
          setTasks(taskData);
        }

        /* PROJECTS */

        const projectRes = await fetch(
          "http://localhost:5000/api/projects",
          {
            headers: {
              Authorization: token,
            },
          }
        );

        const projectData =
          await projectRes.json();

        if (projectRes.ok) {
          setProjects(projectData);
        }

      } catch (err) {

        console.error(
          "Error fetching data:",
          err
        );

      } finally {

        setLoading(false);
      }
    };

    fetchData();

  }, []);

  /* =========================
     DELETE TASK
  ========================= */

  const handleDelete = async (
    id
  ) => {

    try {

      const token =
        localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/api/tasks/${id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: token,
          },
        }
      );

      if (!res.ok) {
        throw new Error(
          "Failed to delete task"
        );
      }

      setTasks(
        tasks.filter(
          (task) =>
            task._id !== id
        )
      );

    } catch (err) {

      console.error(
        "Error deleting task:",
        err
      );
    }
  };

  /* =========================
     ANALYTICS
  ========================= */

  const completedTasks =
    tasks.filter(
      (t) =>
        t.status === "Done"
    );

  const pendingTasks =
    tasks.filter(
      (t) =>
        t.status !== "Done"
    );

  const overdueTasks =
    tasks.filter(
      (t) =>
        new Date(
          t.dueDate
        ) < new Date() &&
        t.status !== "Done"
    );

  /* =========================
     CHART DATA
  ========================= */

  const taskChartData = {
    labels: [
      "To Do",
      "In Progress",
      "Done",
    ],

    datasets: [
      {
        data: [
          tasks.filter(
            (t) =>
              t.status ===
              "To Do"
          ).length,

          tasks.filter(
            (t) =>
              t.status ===
              "In Progress"
          ).length,

          tasks.filter(
            (t) =>
              t.status ===
              "Done"
          ).length,
        ],

        backgroundColor: [
          "#facc15",
          "#3b82f6",
          "#22c55e",
        ],
      },
    ],
  };

  if (loading) {

    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl font-semibold">
          Loading Dashboard...
        </p>
      </div>
    );
  }

  return (

    <div className="bg-gray-50 min-h-screen pt-24 px-6">

      {/* PAGE TITLE */}

      <h1
        className="
          text-4xl
          font-bold
          text-center
          text-gray-800
          mb-10
        "
      >
        Team Task Manager
      </h1>

      {/* STATS */}

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-4
          gap-6
          mb-10
        "
      >

        {/* COMPLETED */}

        <div
          className="
            bg-green-100
            p-6
            rounded-2xl
            shadow
          "
        >

          <div className="flex items-center gap-3">

            <CheckCircle className="text-green-700" />

            <h2 className="text-lg font-semibold text-green-700">
              Completed
            </h2>
          </div>

          <p className="text-3xl font-bold mt-3">
            {completedTasks.length}
          </p>
        </div>

        {/* PENDING */}

        <div
          className="
            bg-yellow-100
            p-6
            rounded-2xl
            shadow
          "
        >

          <div className="flex items-center gap-3">

            <Clock3 className="text-yellow-700" />

            <h2 className="text-lg font-semibold text-yellow-700">
              Pending
            </h2>
          </div>

          <p className="text-3xl font-bold mt-3">
            {pendingTasks.length}
          </p>
        </div>

        {/* OVERDUE */}

        <div
          className="
            bg-red-100
            p-6
            rounded-2xl
            shadow
          "
        >

          <div className="flex items-center gap-3">

            <AlertTriangle className="text-red-700" />

            <h2 className="text-lg font-semibold text-red-700">
              Overdue
            </h2>
          </div>

          <p className="text-3xl font-bold mt-3">
            {overdueTasks.length}
          </p>
        </div>

        {/* PROJECTS */}

        <div
          className="
            bg-blue-100
            p-6
            rounded-2xl
            shadow
          "
        >

          <div className="flex items-center gap-3">

            <FolderKanban className="text-blue-700" />

            <h2 className="text-lg font-semibold text-blue-700">
              Projects
            </h2>
          </div>

          <p className="text-3xl font-bold mt-3">
            {projects.length}
          </p>
        </div>
      </div>

      {/* CHARTS */}

      <div
        className="
          flex
          flex-col
          md:flex-row
          justify-center
          gap-10
          mb-12
        "
      >

        <TaskStatusChart
          data={taskChartData}
          total={tasks.length}
          label="Tasks"
        />

      </div>

      {/* ACTION BUTTONS */}

      <div
        className="
          flex
          flex-col
          md:flex-row
          justify-center
          gap-4
          mb-10
        "
      >

        {/* CREATE TASK */}

        <Link
          to="/tasks/create"

          className="
            inline-flex
            items-center
            justify-center
            px-5
            py-3
            bg-blue-600
            text-white
            rounded-lg
            shadow
            hover:bg-blue-700
            transition
          "
        >

          <Plus className="w-5 h-5 mr-2" />

          Create Task

        </Link>

        {/* CREATE PROJECT */}

        <Link
          to="/project/create"

          className="
            inline-flex
            items-center
            justify-center
            px-5
            py-3
            bg-green-600
            text-white
            rounded-lg
            shadow
            hover:bg-green-700
            transition
          "
        >

          <FolderKanban className="w-5 h-5 mr-2" />

          Create Project

        </Link>

        {/* VIEW PROJECTS */}

        <Link
          to="/projects"

          className="
            inline-flex
            items-center
            justify-center
            px-5
            py-3
            bg-purple-600
            text-white
            rounded-lg
            shadow
            hover:bg-purple-700
            transition
          "
        >

          View Projects

        </Link>
      </div>

      {/* RECENT TASKS */}

      <h3 className="text-2xl font-semibold mb-4">
        Recent Tasks
      </h3>

      {tasks.length === 0 ? (

        <div
          className="
            bg-white
            rounded-xl
            shadow
            p-8
            text-center
          "
        >

          <p className="text-gray-500">
            No tasks created yet
          </p>
        </div>

      ) : (

        <ul className="space-y-4">

          {tasks
            .sort(
              (a, b) =>
                new Date(
                  b.createdAt
                ) -
                new Date(
                  a.createdAt
                )
            )

            .slice(0, 5)

            .map((task) => (

              <li
                key={task._id}

                className="
                  flex
                  flex-col
                  md:flex-row
                  justify-between
                  md:items-center
                  p-5
                  bg-white
                  rounded-xl
                  shadow
                  hover:shadow-md
                  transition
                  gap-4
                "
              >

                {/* LEFT */}

                <div>

                  <p className="font-semibold text-lg text-gray-800">
                    {task.title}
                  </p>

                  <p className="text-sm text-gray-500 mt-1">

                    Priority:
                    {" "}
                    {task.priority}

                    {" • "}

                    Status:
                    {" "}
                    {task.status}

                  </p>

                  <p className="text-sm text-gray-500 mt-1">

                    Due:
                    {" "}

                    {task.dueDate
                      ? new Date(
                          task.dueDate
                        ).toLocaleDateString()
                      : "No Date"}

                  </p>

                  {/* PROJECT */}

                  {task.project && (

                    <p className="text-sm text-blue-600 mt-1">

                      Project:
                      {" "}

                      {task.project.name}

                    </p>
                  )}

                  {/* ASSIGNED USER */}

                  {task.assignedTo && (

                    <p className="text-sm text-green-600 mt-1">

                      Assigned To:
                      {" "}

                      {task.assignedTo.name}

                    </p>
                  )}
                </div>

                {/* RIGHT */}

                <div className="flex items-center gap-3">

                  {/* EDIT */}

                  <Link
                    to={`/tasks/${task._id}/edit`}

                    className="
                      inline-flex
                      items-center
                      px-3
                      py-1.5
                      text-sm
                      bg-yellow-500
                      text-white
                      rounded-md
                      hover:bg-yellow-600
                      transition
                    "
                  >

                    <Edit className="w-4 h-4 mr-1" />

                    Edit

                  </Link>

                  {/* DELETE */}

                  <button
                    onClick={() =>
                      handleDelete(
                        task._id
                      )
                    }

                    className="
                      inline-flex
                      items-center
                      px-3
                      py-1.5
                      text-sm
                      bg-red-500
                      text-white
                      rounded-md
                      hover:bg-red-600
                      transition
                    "
                  >

                    <Trash2 className="w-4 h-4 mr-1" />

                    Delete

                  </button>
                </div>
              </li>
            ))}
        </ul>
      )}

      {/* MONTHLY OVERVIEW */}

      <div className="mt-14">

        <h2 className="text-3xl font-bold text-center mb-8">
          Monthly Task Overview
        </h2>

        <TaskOverview />

      </div>

      {/* LINE CHART */}

      <div className="mt-14">

        <TaskLineChart />

      </div>
    </div>
  );
}

export default DashboardPage;
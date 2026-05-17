import React, {
  useEffect,
  useState,
} from "react";

import { Link } from "react-router-dom";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const TaskOverview = () => {

  const [tasks, setTasks] =
    useState([]);

  const [selectedMonth,
    setSelectedMonth] =
    useState(null);

  /* =========================
     FETCH TASKS
  ========================= */

  const fetchTasks = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:5000/api/tasks",
        {
          headers: {
            Authorization: token,
          },
        }
      );

      const data =
        await res.json();

      setTasks(data);

    } catch (err) {

      console.error(
        "Error fetching tasks:",
        err
      );
    }
  };

  useEffect(() => {
    fetchTasks();
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

      await fetch(
        `http://localhost:5000/api/tasks/${id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: token,
          },
        }
      );

      fetchTasks();

    } catch (err) {

      console.error(
        "Error deleting task:",
        err
      );
    }
  };

  /* =========================
     FILTER MONTH
  ========================= */

  const filtered =
    selectedMonth !== null
      ? tasks.filter((task) => {

          const date =
            new Date(
              task.dueDate
            );

          return (
            date.getMonth() ===
            selectedMonth
          );
        })
      : [];

  /* =========================
     TASK ANALYTICS
  ========================= */

  const completedTasks =
    filtered.filter(
      (t) =>
        t.status === "Done"
    ).length;

  const pendingTasks =
    filtered.filter(
      (t) =>
        t.status !== "Done"
    ).length;

  const overdueTasks =
    filtered.filter(
      (t) =>
        new Date(
          t.dueDate
        ) < new Date() &&
        t.status !== "Done"
    ).length;

  return (
    <div className="p-6">

      {/* MONTH BUTTONS */}

      <div
        className="
          grid
          grid-cols-2
          md:grid-cols-4
          gap-4
          mb-6
        "
      >

        {months.map(
          (month, index) => (

            <button
              key={index}

              onClick={() =>
                setSelectedMonth(
                  index
                )
              }

              className={`p-4 rounded-xl shadow-md transition ${
                selectedMonth ===
                index
                  ? "bg-blue-600 text-white"
                  : "bg-blue-100 hover:bg-blue-200"
              }`}
            >

              <h2 className="text-lg font-bold">
                {month}
              </h2>

            </button>
          )
        )}
      </div>

      {/* MONTH SUMMARY */}

      {selectedMonth !== null && (

        <div>

          <h1 className="text-2xl font-bold mb-4">

            {
              months[
                selectedMonth
              ]
            }{" "}

            Task Summary

          </h1>

          {/* SUMMARY CARDS */}

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-3
              gap-4
              mb-6
            "
          >

            {/* Completed */}

            <div
              className="
                p-4
                bg-green-100
                rounded-lg
                shadow
              "
            >

              <h3 className="font-bold text-green-700">
                Completed
              </h3>

              <p className="text-xl">
                {completedTasks}
              </p>

            </div>

            {/* Pending */}

            <div
              className="
                p-4
                bg-yellow-100
                rounded-lg
                shadow
              "
            >

              <h3 className="font-bold text-yellow-700">
                Pending
              </h3>

              <p className="text-xl">
                {pendingTasks}
              </p>

            </div>

            {/* Overdue */}

            <div
              className="
                p-4
                bg-red-100
                rounded-lg
                shadow
              "
            >

              <h3 className="font-bold text-red-700">
                Overdue
              </h3>

              <p className="text-xl">
                {overdueTasks}
              </p>

            </div>
          </div>

          {/* TASK LIST */}

          <ul className="space-y-4">

            {filtered.map((task) => (

              <li
                key={task._id}

                className="
                  p-4
                  bg-white
                  shadow
                  rounded-xl
                  flex
                  flex-col
                  md:flex-row
                  md:justify-between
                  md:items-center
                  gap-4
                "
              >

                {/* LEFT */}

                <div>

                  <strong className="text-lg">
                    {task.title}
                  </strong>

                  <br />

                  <span className="text-sm text-gray-500">

                    Priority:
                    {" "}
                    {task.priority}

                    {" • "}

                    Due:
                    {" "}

                    {new Date(
                      task.dueDate
                    ).toLocaleDateString()}

                  </span>
                </div>

                {/* RIGHT */}

                <div className="flex items-center gap-3">

                  {/* STATUS */}

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      task.status ===
                      "Done"
                        ? "bg-green-100 text-green-700"

                        : task.status ===
                          "In Progress"

                        ? "bg-blue-100 text-blue-700"

                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >

                    {task.status}

                  </span>

                  {/* EDIT */}

                  <Link
                    to={`/tasks/${task._id}/edit`}

                    className="
                      px-3
                      py-1
                      bg-yellow-400
                      text-white
                      rounded
                      hover:bg-yellow-500
                    "
                  >
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
                      px-3
                      py-1
                      bg-red-500
                      text-white
                      rounded
                      hover:bg-red-600
                    "
                  >
                    Delete
                  </button>

                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TaskOverview;
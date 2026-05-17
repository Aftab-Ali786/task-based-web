import React, {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
  Link,
} from "react-router-dom";

/* =========================
   FETCH TASK
========================= */

const fetchTask = async (
  id
) => {

  const token =
    localStorage.getItem("token");

  const res = await fetch(
    `http://localhost:5000/api/tasks/${id}`,
    {
      headers: {
        Authorization: token,
      },
    }
  );

  return await res.json();
};

/* =========================
   DELETE TASK
========================= */

const deleteTask = async (
  id
) => {

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
};

export default function DeleteTask() {

  const { id } = useParams();

  const navigate =
    useNavigate();

  const [task, setTask] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  /* =========================
     LOAD TASK
  ========================= */

  useEffect(() => {

    (async () => {

      try {

        const data =
          await fetchTask(id);

        setTask(data);

      } catch (err) {

        console.error(
          "Error fetching task:",
          err
        );
      }
    })();

  }, [id]);

  /* =========================
     HANDLE DELETE
  ========================= */

  const handleDelete =
    async () => {

      try {

        setLoading(true);

        await deleteTask(id);

        navigate("/");

      } catch (err) {

        console.error(
          "Error deleting task:",
          err
        );

      } finally {

        setLoading(false);
      }
    };

  /* =========================
     LOADING
  ========================= */

  if (!task) {

    return (
      <div className="min-h-screen flex justify-center items-center">

        <p className="text-lg font-medium">
          Loading task...
        </p>

      </div>
    );
  }

  return (

    <div
      className="
        min-h-screen
        flex
        justify-center
        items-center
        bg-gray-100
        px-4
      "
    >

      <div
        className="
          bg-white
          shadow-xl
          rounded-2xl
          p-8
          max-w-md
          w-full
        "
      >

        {/* TITLE */}

        <h2
          className="
            text-2xl
            font-bold
            text-red-600
            mb-4
          "
        >
          Delete Task
        </h2>

        {/* MESSAGE */}

        <p className="text-gray-700 mb-6">

          Are you sure you want to delete

          {" "}

          <strong>
            {task.title}
          </strong>

          ?

        </p>

        {/* TASK INFO */}

        <div
          className="
            bg-gray-50
            border
            rounded-xl
            p-4
            mb-6
          "
        >

          <p className="mb-2">

            <span className="font-semibold">
              Priority:
            </span>

            {" "}

            {task.priority}

          </p>

          <p className="mb-2">

            <span className="font-semibold">
              Status:
            </span>

            {" "}

            {task.status}

          </p>

          <p>

            <span className="font-semibold">
              Due Date:
            </span>

            {" "}

            {new Date(
              task.dueDate
            ).toLocaleDateString()}

          </p>
        </div>

        {/* ACTION BUTTONS */}

        <div className="flex gap-4">

          {/* DELETE */}

          <button
            onClick={handleDelete}

            disabled={loading}

            className="
              flex-1
              bg-red-500
              text-white
              py-2.5
              rounded-lg
              hover:bg-red-600
              transition
            "
          >

            {loading
              ? "Deleting..."
              : "Yes, Delete"}

          </button>

          {/* CANCEL */}

          <Link
            to="/"

            className="
              flex-1
              text-center
              bg-gray-200
              text-gray-800
              py-2.5
              rounded-lg
              hover:bg-gray-300
              transition
            "
          >
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
}
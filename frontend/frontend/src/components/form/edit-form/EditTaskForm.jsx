import React, {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

const EditTaskForm = () => {

  const { id } = useParams();

  const navigate = useNavigate();

  const [formData, setFormData] =
    useState({
      title: "",
      description: "",
      priority: "",
      status: "",
      dueDate: "",
      assignedTo: "",
      project: "",
    });

  const [success, setSuccess] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  /* =========================
     FETCH TASK
  ========================= */

  useEffect(() => {

    const fetchTask = async () => {

      try {

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

        const data =
          await res.json();

        setFormData({
          title: data.title || "",

          description:
            data.description || "",

          priority:
            data.priority || "",

          status:
            data.status || "",

          dueDate: data.dueDate
            ? data.dueDate.split("T")[0]
            : "",

          assignedTo:
            data.assignedTo?._id || "",

          project:
            data.project?._id || "",
        });

      } catch (err) {

        console.error(
          "Error fetching task:",
          err
        );
      }
    };

    fetchTask();

  }, [id]);

  /* =========================
     UPDATE TASK
  ========================= */

  const handleSubmit = async (
    e
  ) => {

    e.preventDefault();

    try {

      setLoading(true);

      const token =
        localStorage.getItem("token");

      await fetch(
        `http://localhost:5000/api/tasks/${id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",

            Authorization: token,
          },

          body: JSON.stringify(
            formData
          ),
        }
      );

      setSuccess(true);

      setTimeout(() => {

        setSuccess(false);

        navigate("/tasks");

      }, 2000);

    } catch (err) {

      console.error(
        "Error updating task:",
        err
      );

    } finally {

      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="
        p-6
        shadow-lg
        rounded-2xl
        bg-white
        max-w-xl
        mx-auto
        mt-8
      "
    >

      {/* Heading */}

      <h2 className="text-2xl font-bold mb-6 text-center">
        Edit Task
      </h2>

      {/* Title */}

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Task Title
        </label>

        <input
          type="text"

          value={formData.title}

          onChange={(e) =>
            setFormData({
              ...formData,
              title:
                e.target.value,
            })
          }

          className="w-full p-3 border rounded-lg"

          required
        />
      </div>

      {/* Description */}

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Description
        </label>

        <textarea
          value={
            formData.description
          }

          onChange={(e) =>
            setFormData({
              ...formData,
              description:
                e.target.value,
            })
          }

          className="w-full p-3 border rounded-lg"

          rows="4"
        />
      </div>

      {/* Priority */}

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Priority
        </label>

        <select
          value={formData.priority}

          onChange={(e) =>
            setFormData({
              ...formData,
              priority:
                e.target.value,
            })
          }

          className="w-full p-3 border rounded-lg"
        >
          <option value="">
            Select Priority
          </option>

          <option value="Low">
            Low
          </option>

          <option value="Medium">
            Medium
          </option>

          <option value="High">
            High
          </option>
        </select>
      </div>

      {/* Status */}

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Status
        </label>

        <select
          value={formData.status}

          onChange={(e) =>
            setFormData({
              ...formData,
              status:
                e.target.value,
            })
          }

          className="w-full p-3 border rounded-lg"
        >
          <option value="To Do">
            To Do
          </option>

          <option value="In Progress">
            In Progress
          </option>

          <option value="Done">
            Done
          </option>
        </select>
      </div>

      {/* Due Date */}

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Due Date
        </label>

        <input
          type="date"

          value={formData.dueDate}

          onChange={(e) =>
            setFormData({
              ...formData,
              dueDate:
                e.target.value,
            })
          }

          className="w-full p-3 border rounded-lg"
        />
      </div>

      {/* Assigned To */}

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Assigned User
        </label>

        <input
          type="text"

          value={
            formData.assignedTo
          }

          onChange={(e) =>
            setFormData({
              ...formData,
              assignedTo:
                e.target.value,
            })
          }

          className="w-full p-3 border rounded-lg"

          placeholder="User ID"
        />
      </div>

      {/* Project */}

      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">
          Project ID
        </label>

        <input
          type="text"

          value={formData.project}

          onChange={(e) =>
            setFormData({
              ...formData,
              project:
                e.target.value,
            })
          }

          className="w-full p-3 border rounded-lg"

          placeholder="Project ID"
        />
      </div>

      {/* Button */}

      <button
        type="submit"

        disabled={loading}

        className="
          w-full
          bg-blue-600
          text-white
          p-3
          rounded-lg
          hover:bg-blue-700
          transition
        "
      >
        {loading
          ? "Updating..."
          : "Update Task"}
      </button>

      {/* Success */}

      {success && (
        <p className="text-green-600 text-sm mt-4 text-center">
          Task updated successfully!
        </p>
      )}
    </form>
  );
};

export default EditTaskForm;
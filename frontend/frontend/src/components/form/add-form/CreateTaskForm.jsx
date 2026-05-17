import React from "react";

const CreateTaskForm = () => {

  const [formData, setFormData] =
    React.useState({
      title: "",
      description: "",
      priority: "",
      status: "To Do",
      dueDate: "",
      assignedTo: "",
      project: "",
    });

  const [projects, setProjects] =
    React.useState([]);

  const [users, setUsers] =
    React.useState([]);

  const [success, setSuccess] =
    React.useState(false);

  const [loading, setLoading] =
    React.useState(false);

  /* =========================
     FETCH DATA
  ========================= */

  React.useEffect(() => {

    const fetchProjects = async () => {

      try {

        const token =
          localStorage.getItem("token");

        const res = await fetch(
          "http://localhost:5000/api/projects",
          {
            headers: {
              Authorization: token,
            },
          }
        );

        const data =
          await res.json();

        setProjects(data);

      } catch (err) {

        console.log(
          "Failed to fetch projects",
          err
        );
      }
    };

    const fetchUsers = async () => {

      try {

        const token =
          localStorage.getItem("token");

        const res = await fetch(
          "http://localhost:5000/api/users",
          {
            headers: {
              Authorization: token,
            },
          }
        );

        const data =
          await res.json();

        setUsers(data);

      } catch (err) {

        console.log(
          "Failed to fetch users",
          err
        );
      }
    };

    fetchProjects();
    fetchUsers();

  }, []);

  /* =========================
     HANDLE SUBMIT
  ========================= */

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const token =
        localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:5000/api/tasks",
        {
          method: "POST",

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

      const data =
        await res.json();

      if (!res.ok) {

        throw new Error(
          data.message ||
          "Failed to create task"
        );
      }

      console.log(
        "Task created:",
        data
      );

      /* RESET FORM */

      setFormData({
        title: "",
        description: "",
        priority: "",
        status: "To Do",
        dueDate: "",
        assignedTo: "",
        project: "",
      });

      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
      }, 3000);

    } catch (err) {

      console.log(err);

      alert(err.message);

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

      {/* HEADING */}

      <h2 className="text-2xl font-bold mb-6 text-center">
        Create New Task
      </h2>

      {/* TITLE */}

      <div className="mb-4">

        <label className="block mb-1 font-medium">
          Task Title
        </label>

        <input
          type="text"

          value={formData.title}

          onChange={(e) =>
            setFormData({
              ...formData,
              title: e.target.value,
            })
          }

          className="
            w-full
            p-3
            border
            rounded-lg
          "

          placeholder="Enter task title"

          required
        />
      </div>

      {/* DESCRIPTION */}

      <div className="mb-4">

        <label className="block mb-1 font-medium">
          Description
        </label>

        <textarea
          rows="4"

          value={formData.description}

          onChange={(e) =>
            setFormData({
              ...formData,
              description:
                e.target.value,
            })
          }

          className="
            w-full
            p-3
            border
            rounded-lg
          "

          placeholder="Task description"
        />
      </div>

      {/* PRIORITY */}

      <div className="mb-4">

        <label className="block mb-1 font-medium">
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

          className="
            w-full
            p-3
            border
            rounded-lg
          "

          required
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

      {/* STATUS */}

      <div className="mb-4">

        <label className="block mb-1 font-medium">
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

          className="
            w-full
            p-3
            border
            rounded-lg
          "
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

      {/* DUE DATE */}

      <div className="mb-4">

        <label className="block mb-1 font-medium">
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

          className="
            w-full
            p-3
            border
            rounded-lg
          "

          required
        />
      </div>

      {/* ASSIGN USER */}

      <div className="mb-4">

        <label className="block mb-1 font-medium">
          Assign To
        </label>

        <select
          value={formData.assignedTo}

          onChange={(e) =>
            setFormData({
              ...formData,
              assignedTo:
                e.target.value,
            })
          }

          className="
            w-full
            p-3
            border
            rounded-lg
          "
        >

          <option value="">
            Select User
          </option>

          {users.map((user) => (

            <option
              key={user._id}
              value={user._id}
            >
              {user.name}
            </option>
          ))}
        </select>
      </div>

      {/* PROJECT */}

      <div className="mb-6">

        <label className="block mb-1 font-medium">
          Select Project
        </label>

        <select
          value={formData.project}

          onChange={(e) =>
            setFormData({
              ...formData,
              project:
                e.target.value,
            })
          }

          className="
            w-full
            p-3
            border
            rounded-lg
          "
        >

          <option value="">
            Select Project
          </option>

          {projects.map((project) => (

            <option
              key={project._id}
              value={project._id}
            >
              {project.name}
            </option>
          ))}
        </select>
      </div>

      {/* BUTTON */}

      <button
        type="submit"

        disabled={loading}

        className="
          w-full
          bg-blue-600
          hover:bg-blue-700
          text-white
          p-3
          rounded-lg
          transition
        "
      >

        {loading
          ? "Creating..."
          : "Create Task"}

      </button>

      {/* SUCCESS */}

      {success && (

        <p className="text-green-600 text-center mt-4">
          Task created successfully!
        </p>
      )}
    </form>
  );
};

export default CreateTaskForm;
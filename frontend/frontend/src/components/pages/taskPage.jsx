import React from "react";

const TasksPage = () => {

  const [tasks, setTasks] =
    React.useState([]);

  const [loading, setLoading] =
    React.useState(true);

  /* =========================
     FETCH TASKS
  ========================= */

  React.useEffect(() => {

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

        console.log(err);

      } finally {

        setLoading(false);
      }
    };

    fetchTasks();

  }, []);

  /* =========================
     DELETE TASK
  ========================= */

  const deleteTask = async (id) => {

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
          (task) => task._id !== id
        )
      );

    } catch (err) {

      console.log(err);

      alert(err.message);
    }
  };

  if (loading) {

    return (
      <p className="text-center mt-10">
        Loading tasks...
      </p>
    );
  }

  return (

    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">
        Tasks
      </h1>

      {tasks.length === 0 ? (

        <p>No tasks found</p>

      ) : (

        <div className="grid gap-5">

          {tasks.map((task) => (

            <div
              key={task._id}

              className="
                bg-white
                shadow-md
                rounded-xl
                p-5
                border
              "
            >

              <div className="flex justify-between items-start">

                <div>

                  <h2 className="text-xl font-bold">
                    {task.title}
                  </h2>

                  <p className="text-gray-600 mt-1">
                    {task.description}
                  </p>

                  <div className="mt-3 space-y-1 text-sm">

                    <p>
                      <span className="font-semibold">
                        Priority:
                      </span>{" "}
                      {task.priority}
                    </p>

                    <p>
                      <span className="font-semibold">
                        Status:
                      </span>{" "}
                      {task.status}
                    </p>

                    <p>
                      <span className="font-semibold">
                        Due Date:
                      </span>{" "}
                      {new Date(
                        task.dueDate
                      ).toLocaleDateString()}
                    </p>

                    <p>
                      <span className="font-semibold">
                        Assigned To:
                      </span>{" "}
                      {task.assignedTo?.name ||
                        "Not Assigned"}
                    </p>

                    <p>
                      <span className="font-semibold">
                        Project:
                      </span>{" "}
                      {task.project?.name ||
                        "No Project"}
                    </p>

                  </div>
                </div>

                {/* DELETE BUTTON */}

                <button
                  onClick={() =>
                    deleteTask(task._id)
                  }

                  className="
                    bg-red-500
                    hover:bg-red-600
                    text-white
                    px-4
                    py-2
                    rounded-lg
                  "
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TasksPage;
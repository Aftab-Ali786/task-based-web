import React, { useEffect, useState } from "react";

const ManageTeam = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          "http://localhost:5000/api/team",
          {
            headers: {
              Authorization: token,
            },
          }
        );

        const data = await res.json();
        setTeam(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, []);

  if (loading) {
    return (
      <div className="pt-24 text-center">
        Loading team...
      </div>
    );
  }

  return (
    <div className="pt-24 px-6 bg-gray-50 min-h-screen">

      <h1 className="text-3xl font-bold mb-6">
        Manage Team (Admin Only)
      </h1>

      {team.map((user) => (
        <div
          key={user._id}
          className="bg-white p-5 rounded-xl shadow mb-4"
        >
          {/* USER INFO */}
          <div className="mb-3">
            <h2 className="text-xl font-semibold">
              {user.name}
            </h2>

            <p className="text-gray-500 text-sm">
              {user.email} • {user.role}
            </p>
          </div>

          {/* TASK LIST */}
          <div>
            <h3 className="font-semibold mb-2">
              Assigned Tasks ({user.tasks.length})
            </h3>

            {user.tasks.length === 0 ? (
              <p className="text-gray-400 text-sm">
                No tasks assigned
              </p>
            ) : (
              <ul className="space-y-2">
                {user.tasks.map((task) => (
                  <li
                    key={task._id}
                    className="border p-3 rounded-lg"
                  >
                    <p className="font-medium">
                      {task.title}
                    </p>

                    <p className="text-sm text-gray-500">
                      {task.status} • {task.priority}
                    </p>

                    <p className="text-sm text-blue-600">
                      Project: {task.project?.name}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ManageTeam;
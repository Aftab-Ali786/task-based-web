import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FolderKanban, Users } from "lucide-react";

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          "http://localhost:5000/api/projects",
          {
            headers: {
              Authorization: token,
            },
          }
        );

        const data = await res.json();
        setProjects(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="pt-24 text-center text-lg">
        Loading projects...
      </div>
    );
  }

  return (
    <div className="pt-24 px-6 bg-gray-50 min-h-screen">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Projects</h1>

        <Link
          to="/projects/create"
          className="bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          + Create Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <p className="text-gray-500">No projects found</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project._id}
              className="bg-white p-5 rounded-xl shadow"
            >
              <div className="flex items-center gap-2 mb-2">
                <FolderKanban className="text-blue-600" />
                <h2 className="font-semibold text-lg">
                  {project.name}
                </h2>
              </div>

              <p className="text-gray-600 text-sm mb-3">
                {project.description || "No description"}
              </p>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Users size={16} />
                {project.members?.length || 0} Members
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
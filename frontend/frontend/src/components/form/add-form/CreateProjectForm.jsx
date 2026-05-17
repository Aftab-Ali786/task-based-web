import React, {
  useEffect,
  useState,
} from "react";

const CreateProjectForm = () => {

  const [formData, setFormData] =
    useState({
      name: "",
      description: "",
      members: [],
    });

  const [users, setUsers] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {

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

        const data = await res.json();

        if (res.ok) {
          setUsers(data);
        }

      } catch (err) {
        console.log(err);
      }
    };

    fetchUsers();

  }, []);

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleMembersChange = (e) => {

    const selectedUsers = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );

    setFormData({
      ...formData,
      members: selectedUsers,
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const token =
        localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:5000/api/projects",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },

          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      setSuccess(true);

      setFormData({
        name: "",
        description: "",
        members: [],
      });

    } catch (err) {

      setError(err.message);

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-5">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-2xl"
      >

        <h2 className="text-3xl font-bold mb-8 text-center">
          Create Project
        </h2>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 text-green-600 p-3 rounded mb-4">
            Project Created Successfully
          </div>
        )}

        <input
          type="text"
          name="name"
          placeholder="Project Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded-lg mb-5"
        />

        <textarea
          name="description"
          placeholder="Project Description"
          rows="5"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg mb-5"
        />

        <select
          multiple
          value={formData.members}
          onChange={handleMembersChange}
          className="w-full p-3 border rounded-lg h-40 mb-6"
        >

          {users.map((user) => (
            <option
              key={user._id}
              value={user._id}
            >
              {user.name} ({user.email})
            </option>
          ))}
        </select>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg"
        >
          {loading
            ? "Creating..."
            : "Create Project"}
        </button>
      </form>
    </div>
  );
};

export default CreateProjectForm;

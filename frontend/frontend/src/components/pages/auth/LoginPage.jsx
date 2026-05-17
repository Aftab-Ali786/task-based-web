import React, {
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  Mail,
  Lock,
  LogIn,
} from "lucide-react";

const LoginPage = () => {

  const navigate =
    useNavigate();

  const [formData,
    setFormData] =
    useState({
      email: "",
      password: "",
    });

  const [loading,
    setLoading] =
    useState(false);

  const [error,
    setError] =
    useState("");

  /* =========================
     HANDLE CHANGE
  ========================= */

  const handleChange = (
    e
  ) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  /* =========================
     HANDLE SUBMIT
  ========================= */

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      setError("");

      try {

        setLoading(true);

        const res = await fetch(
          "http://localhost:5000/api/auth/login",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
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
            "Login failed"
          );
        }

        /* SAVE TOKEN */

        localStorage.setItem(
          "token",
          data.token
        );

        localStorage.setItem(
          "user",
          JSON.stringify(
            data.user
          )
        );

        navigate("/");

      } catch (err) {

        setError(err.message);

      } finally {

        setLoading(false);
      }
    };

  return (

    <div
      className="
        min-h-screen
        flex
        items-center
        justify-center
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
          w-full
          max-w-md
        "
      >

        {/* TITLE */}

        <h1
          className="
            text-3xl
            font-bold
            text-center
            text-gray-800
            mb-2
          "
        >
          Welcome Back
        </h1>

        <p
          className="
            text-center
            text-gray-500
            mb-8
          "
        >
          Login to continue
        </p>

        {/* ERROR */}

        {error && (

          <div
            className="
              bg-red-100
              text-red-600
              p-3
              rounded-lg
              mb-4
            "
          >
            {error}
          </div>
        )}

        {/* FORM */}

        <form
          onSubmit={
            handleSubmit
          }

          className="space-y-5"
        >

          {/* EMAIL */}

          <div>

            <label className="block mb-2 font-medium text-gray-700">
              Email
            </label>

            <div className="relative">

              <Mail
                className="
                  absolute
                  left-3
                  top-3
                  text-gray-400
                "
                size={18}
              />

              <input
                type="email"
                name="email"

                value={
                  formData.email
                }

                onChange={
                  handleChange
                }

                placeholder="Enter email"

                required

                className="
                  w-full
                  pl-10
                  p-3
                  border
                  rounded-lg
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
              />
            </div>
          </div>

          {/* PASSWORD */}

          <div>

            <label className="block mb-2 font-medium text-gray-700">
              Password
            </label>

            <div className="relative">

              <Lock
                className="
                  absolute
                  left-3
                  top-3
                  text-gray-400
                "
                size={18}
              />

              <input
                type="password"
                name="password"

                value={
                  formData.password
                }

                onChange={
                  handleChange
                }

                placeholder="Enter password"

                required

                className="
                  w-full
                  pl-10
                  p-3
                  border
                  rounded-lg
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
              />
            </div>
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
              py-3
              rounded-lg
              transition
              flex
              items-center
              justify-center
              gap-2
            "
          >

            <LogIn size={18} />

            {loading
              ? "Logging in..."
              : "Login"}

          </button>
        </form>

        {/* REGISTER */}

        <p
          className="
            text-center
            text-gray-600
            mt-6
          "
        >

          Don’t have an account?

          {" "}

          <Link
            to="/register"

            className="
              text-blue-600
              hover:underline
              font-medium
            "
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
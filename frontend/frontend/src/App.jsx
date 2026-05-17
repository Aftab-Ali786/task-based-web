import React from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

/* =========================
   COMPONENTS
========================= */

import Navbar from "./components/component/navbar";

import Footer from "./components/component/footer";

/* =========================
   PAGES
========================= */

import DashboardPage from "./components/pages/home-page/DashboardPage";

import CreateTaskForm from "./components/form/add-form/CreateTaskForm";

import EditTaskForm from "./components/form/edit-form/EditTaskForm";

import DeleteTask from "./components/pages/DeleteTask";
import CreateProjectForm from "./components/form/add-form/CreateProjectForm";
import ProjectPage from "./components/pages/overview-page/project-page";
import TaskPage from "./components/pages/overview-page/task-page";
import ManageTeam from "./components/pages/overview-page/manage-team";
/* =========================
   AUTH PAGES
========================= */

import LoginPage from "./components/pages/auth/LoginPage";

import RegisterPage from "./components/pages/auth/RegisterPage";

/* =========================
   PRIVATE ROUTE
========================= */

const PrivateRoute = ({
  children,
}) => {

  const token =
    localStorage.getItem("token");

  return token
    ? children
    : <Navigate to="/login" />;
};

export default function App() {

  return (

    <BrowserRouter>

      {/* NAVBAR */}

      <Navbar />

      {/* MAIN CONTENT */}

      <div className="min-h-screen bg-gray-50 pt-20">

        <Routes>

          {/* =====================
              AUTH ROUTES
          ===================== */}

          <Route
            path="/login"

            element={<LoginPage />}
          />
          <Route
            path="/project/create"

            element={<CreateProjectForm />}
          />
          <Route
            path="/register"

            element={<RegisterPage />}
          />
          <Route
            path="/team"
            element={
              <PrivateRoute>
                <ManageTeam />
              </PrivateRoute>
            }
          />
          {/* =====================
              DASHBOARD
          ===================== */}

          <Route
            path="/"

            element={
              <PrivateRoute>

                <DashboardPage />

              </PrivateRoute>
            }
          />

          {/* =====================
              CREATE TASK
          ===================== */}

          <Route
            path="/tasks/create"

            element={
              <PrivateRoute>

                <CreateTaskForm />

              </PrivateRoute>
            }

          />
          <Route
            path="/projects"
            element={
              <PrivateRoute>
                <ProjectPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/tasks"
            element={
              <PrivateRoute>
                <TaskPage />
              </PrivateRoute>
            }
          />

          {/* =====================
              EDIT TASK
          ===================== */}

          <Route
            path="/tasks/:id/edit"

            element={
              <PrivateRoute>

                <EditTaskForm />

              </PrivateRoute>
            }
          />

          {/* =====================
              DELETE TASK
          ===================== */}

          <Route
            path="/tasks/:id/delete"

            element={
              <PrivateRoute>

                <DeleteTask />

              </PrivateRoute>
            }
          />

          {/* =====================
              FALLBACK
          ===================== */}

          <Route
            path="*"

            element={
              <Navigate to="/" />
            }
          />

        </Routes>
      </div>

      {/* FOOTER */}

      <Footer />

    </BrowserRouter>
  );
}
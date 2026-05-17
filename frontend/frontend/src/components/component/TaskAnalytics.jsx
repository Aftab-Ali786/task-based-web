import React, {
  useEffect,
  useState,
} from "react";

import TaskStatusChart from "./TaskStatusChart";

const TaskAnalytics = () => {

  const [tasks, setTasks] =
    useState([]);

  useEffect(() => {

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

    fetchTasks();

  }, []);

  /* =========================
     TASK STATUS COUNTS
  ========================= */

  const todoTasks =
    tasks.filter(
      (t) => t.status === "To Do"
    ).length;

  const inProgressTasks =
    tasks.filter(
      (t) =>
        t.status === "In Progress"
    ).length;

  const doneTasks =
    tasks.filter(
      (t) => t.status === "Done"
    ).length;

  /* =========================
     PRIORITY COUNTS
  ========================= */

  const lowPriority =
    tasks.filter(
      (t) =>
        t.priority === "Low"
    ).length;

  const mediumPriority =
    tasks.filter(
      (t) =>
        t.priority === "Medium"
    ).length;

  const highPriority =
    tasks.filter(
      (t) =>
        t.priority === "High"
    ).length;

  return (
    <div
      className="
        flex
        flex-wrap
        justify-center
        gap-10
        mt-8
      "
    >

      {/* STATUS CHART */}

      <TaskStatusChart
        todo={todoTasks}
        inProgress={inProgressTasks}
        done={doneTasks}
      />

      {/* PRIORITY CHART */}

      <TaskStatusChart
        todo={lowPriority}
        inProgress={mediumPriority}
        done={highPriority}
      />

    </div>
  );
};

export default TaskAnalytics;
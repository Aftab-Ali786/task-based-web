import React, {
  useEffect,
  useState,
} from "react";

import { Line } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const TaskLineChart = () => {
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

        const data = await res.json();

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

  const chartData =
    prepareChartData(tasks);

  const options = {
    responsive: true,

    plugins: {
      legend: {
        position: "top",
      },

      title: {
        display: true,
        text: "Monthly Task Progress",
      },
    },
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-6">
      <Line
        data={chartData}
        options={options}
      />
    </div>
  );
};

/* =========================
   PREPARE CHART DATA
========================= */

const prepareChartData = (
  tasks
) => {

  // Tasks Created

  const monthlyCreated =
    Array(12).fill(0);

  // Tasks Completed

  const monthlyCompleted =
    Array(12).fill(0);

  tasks.forEach((task) => {

    // Created Month

    const createdDate =
      new Date(
        task.createdAt ||
        task.dueDate
      );

    const createdMonth =
      createdDate.getMonth();

    monthlyCreated[
      createdMonth
    ] += 1;

    // Completed Tasks

    if (task.status === "Done") {
      monthlyCompleted[
        createdMonth
      ] += 1;
    }
  });

  return {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],

    datasets: [
      {
        label: "Tasks Created",

        data: monthlyCreated,

        borderColor: "#3b82f6",

        backgroundColor:
          "rgba(59,130,246,0.2)",

        tension: 0.3,

        fill: true,
      },

      {
        label: "Tasks Completed",

        data: monthlyCompleted,

        borderColor: "#10b981",

        backgroundColor:
          "rgba(16,185,129,0.2)",

        tension: 0.3,

        fill: true,
      },
    ],
  };
};

export default TaskLineChart;
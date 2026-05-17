import React from "react";
import { Doughnut } from "react-chartjs-2";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const TaskStatusChart = ({
  todo = 0,
  inProgress = 0,
  done = 0,
}) => {

  const data = {
    labels: [
      "To Do",
      "In Progress",
      "Done",
    ],

    datasets: [
      {
        data: [
          todo,
          inProgress,
          done,
        ],

        backgroundColor: [
          "#f59e0b",
          "#3b82f6",
          "#10b981",
        ],

        borderWidth: 1,
      },
    ],
  };

  const totalTasks =
    todo + inProgress + done;

  const options = {
    cutout: "75%",

    plugins: {
      legend: {
        display: true,
        position: "bottom",
      },

      tooltip: {
        enabled: true,
      },
    },

    maintainAspectRatio: false,
  };

  return (
    <div
      style={{
        width: "280px",
        height: "280px",
        margin: "20px",
        position: "relative",
      }}
    >
      <Doughnut
        data={data}
        options={options}
      />

      {/* Center Text */}

      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform:
            "translate(-50%, -50%)",

          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: "24px",
            fontWeight: "bold",
          }}
        >
          {totalTasks}
        </div>

        <div
          style={{
            fontSize: "12px",
            color: "#666",
          }}
        >
          Total Tasks
        </div>
      </div>
    </div>
  );
};

export default TaskStatusChart;
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const router = express.Router();

const PORT = process.env.PORT || 5000;

/* =========================
   MIDDLEWARE
========================= */

app.use(cors());
app.use(express.json());

/* =========================
   DATABASE
========================= */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log(err);
  });

/* =========================
   USER SCHEMA
========================= */

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["Admin", "Member"],
      default: "Member",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

/* =========================
   PROJECT SCHEMA
========================= */

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model("Project", projectSchema);

/* =========================
   TASK SCHEMA
========================= */

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

    status: {
      type: String,
      enum: ["To Do", "In Progress", "Done"],
      default: "To Do",
    },

    dueDate: {
      type: Date,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", taskSchema);

/* =========================
   AUTH MIDDLEWARE
========================= */

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};

/* =========================
   AUTH ROUTES
========================= */

router.post("/auth/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
    } = req.body;

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "Member",
    });

    res.status(201).json({
      message: "Registration successful",
      user,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      token,
      user,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

/* =========================
   USERS ROUTE
========================= */

router.get(
  "/users",
  authMiddleware,
  async (req, res) => {
    try {
      const users = await User.find().select(
        "-password"
      );

      res.json(users);
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  }
);

/* =========================
   PROJECT ROUTES
========================= */

router.post(
  "/projects",
  authMiddleware,
  async (req, res) => {
    try {
      const {
        name,
        description,
        members,
      } = req.body;

      const uniqueMembers = [
        req.user.id,
        ...(members || []),
      ];

      const project = await Project.create({
        name,
        description,
        admin: req.user.id,
        members: [...new Set(uniqueMembers)],
      });

      const populatedProject =
        await Project.findById(project._id)
          .populate("admin", "name email")
          .populate(
            "members",
            "name email"
          );

      res.status(201).json(populatedProject);
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  }
);

router.get(
  "/projects",
  authMiddleware,
  async (req, res) => {
    try {
      const projects = await Project.find({
        members: req.user.id,
      })
        .populate("admin", "name email")
        .populate("members", "name email");

      res.json(projects);
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  }
);
/* =========================
   TEAM ROUTE
========================= */
router.get("/team", authMiddleware, async (req, res) => {
  try {
    // Only Admin can access
    if (req.user.role !== "Admin") {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const users = await User.find()
      .select("-password")
      .lean();

    const tasks = await Task.find()
      .populate("project", "name")
      .lean();

    const teamData = users.map((user) => {
      const userTasks = tasks.filter(
        (t) =>
          t.assignedTo &&
          t.assignedTo.toString() === user._id.toString()
      );

      return {
        ...user,
        tasks: userTasks,
      };
    });

    res.json(teamData);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});
/* =========================
   TASK ROUTES
========================= */

router.post(
  "/tasks",
  authMiddleware,
  async (req, res) => {
    try {
      const taskData = {
        ...req.body,
      };

      if (!taskData.assignedTo) {
        delete taskData.assignedTo;
      }

      if (!taskData.project) {
        delete taskData.project;
      }

      const task = await Task.create(taskData);

      const populatedTask = await Task.findById(
        task._id
      )
        .populate("assignedTo", "name email")
        .populate("project", "name");

      res.status(201).json(populatedTask);
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  }
);

router.get(
  "/tasks",
  authMiddleware,
  async (req, res) => {
    try {
      const tasks = await Task.find()
        .populate("assignedTo", "name email")
        .populate("project", "name");

      res.json(tasks);
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  }
);

router.put(
  "/tasks/:id",
  authMiddleware,
  async (req, res) => {
    try {
      const updatedTask =
        await Task.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
          }
        )
          .populate(
            "assignedTo",
            "name email"
          )
          .populate("project", "name");

      res.json(updatedTask);
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  }
);

router.delete(
  "/tasks/:id",
  authMiddleware,
  async (req, res) => {
    try {
      await Task.findByIdAndDelete(
        req.params.id
      );

      res.json({
        message: "Task deleted successfully",
      });
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  }
);

/* =========================
   DASHBOARD ROUTE
========================= */

router.get(
  "/dashboard",
  authMiddleware,
  async (req, res) => {
    try {
      const totalTasks =
        await Task.countDocuments();

      const completedTasks =
        await Task.countDocuments({
          status: "Done",
        });

      const overdueTasks =
        await Task.countDocuments({
          dueDate: {
            $lt: new Date(),
          },

          status: {
            $ne: "Done",
          },
        });

      const totalProjects =
        await Project.countDocuments();

      res.json({
        totalTasks,
        completedTasks,
        overdueTasks,
        totalProjects,
      });
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  }
);

/* =========================
   BASE ROUTE
========================= */

app.get("/", (req, res) => {
  res.send("Team Task Manager API Running");
});

/* =========================
   API ROUTES
========================= */

app.use("/api", router);

/* =========================
   SERVER
========================= */

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

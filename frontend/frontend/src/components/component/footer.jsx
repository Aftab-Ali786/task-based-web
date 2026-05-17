import React from "react";

import {
  Github,
  Linkedin,
  Mail,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t mt-16 shadow-inner">
      <div className="container mx-auto px-6 py-8">

        {/* Top Section */}

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Logo / Brand */}

          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-800">
              Team Task Manager
            </h2>

            <p className="text-gray-500 text-sm mt-2 max-w-md">
              Organize projects, manage tasks,
              collaborate with your team,
              and track progress efficiently.
            </p>
          </div>

          {/* Navigation */}

          <div className="flex gap-6 text-sm font-medium text-gray-600">
            <a
              href="/"
              className="hover:text-blue-600 transition"
            >
              Dashboard
            </a>

            <a
              href="/projects"
              className="hover:text-blue-600 transition"
            >
              Projects
            </a>

            <a
              href="/tasks"
              className="hover:text-blue-600 transition"
            >
              Tasks
            </a>

            <a
              href="/create-task"
              className="hover:text-blue-600 transition"
            >
              Create Task
            </a>
          </div>

          {/* Social Icons */}

          <div className="flex items-center gap-4">

            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="text-gray-600 hover:text-black transition"
            >
              <Github size={22} />
            </a>

            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="text-gray-600 hover:text-blue-700 transition"
            >
              <Linkedin size={22} />
            </a>

            <a
              href="mailto:example@gmail.com"
              className="text-gray-600 hover:text-red-500 transition"
            >
              <Mail size={22} />
            </a>
          </div>
        </div>

        {/* Bottom Section */}

        <div className="border-t mt-6 pt-4 text-center text-sm text-gray-500">

          © {new Date().getFullYear()} Team Task Manager.
          All rights reserved.

        </div>
      </div>
    </footer>
  );
};

export default Footer;
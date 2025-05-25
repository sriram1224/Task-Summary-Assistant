import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => (
  <nav
    className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-[90%] max-w-xl bg-white/30 backdrop-blur-md shadow-xl shadow-(color:blue-500) rounded-2xl flex justify-around items-center py-3 px-6 z-50 border border-blue-800/40"
    style={{ boxShadow: "0 4px 10px var(--my-custom-color)" }}
  >
    <Link
      to="/"
      className="text-gray-800 hover:text-blue-600 font-semibold transition-colors"
    >
      Home
    </Link>
    <Link
      to="/tasks"
      className="text-gray-800 hover:text-blue-600 font-semibold transition-colors"
    >
      Tasks
    </Link>
    <Link
      to="/summary"
      className="text-gray-800 hover:text-blue-600 font-semibold transition-colors"
    >
      Summary
    </Link>
  </nav>
);

export default Sidebar;

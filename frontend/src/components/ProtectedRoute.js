/* eslint-disable no-unreachable */
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
  return children;
};

export default ProtectedRoute;

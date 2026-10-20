import React from "react";
import Login from "../../Pages/Login/Login";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  if (!localStorage.getItem("userToken")) {
    return <Navigate to={"/login"} />;
  } else {
    return <>{children}</>;
  }
}

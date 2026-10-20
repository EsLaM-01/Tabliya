import React from "react";

import { Navigate } from "react-router-dom";
export function ProtectedLogin({ children }) {
  if (!localStorage.getItem("userToken")) {
    return <>{children}</>;
  } else {
    return <Navigate to={"/home"} />;
  }
}

import React from "react";
import Navbar from "../components/Navbar/Navbar";
import Fotter from "../components/Fotter/Fotter";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-900 text-slate-100">
        <Outlet />
      </div>
      {/* <Fotter />; */}
    </>
  );
}

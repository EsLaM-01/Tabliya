import React, { useContext, useState } from "react";
import logo from "../../assets/Tabliya.png";
import { HiMenu, HiX } from "react-icons/hi";
import { CgMenuLeftAlt } from "react-icons/cg";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { IoIosLogOut } from "react-icons/io";
import { AuthContext } from "../../context/AuthContext";
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { userLogin, setuserLogin, setUserData } = useContext(AuthContext);
  const navigate = useNavigate();
  function logout() {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userData");

    setuserLogin(null);
    setUserData(null);

    navigate("/login");
  }

  // دالة لتحديد كلاسات الروابط بناءً على حالة الـ Active
  const getLinkClass = ({ isActive }) => {
    return `transition-colors duration-200 font-medium px-3 py-2 ${
      isActive
        ? "text-[#615fff] font-semibold"
        : "text-white hover:text-[#615fff]"
    }`;
  };

  // دالة خاصة لزر الـ Register في الشاشات الكبيرة
  const getRegisterLinkClass = ({ isActive }) => {
    return `px-5 py-2 rounded-lg font-medium transition-all duration-200 shadow-md ${
      isActive
        ? "bg-[#615fff] text-white shadow-[#4f39f6]/40"
        : "bg-[#4f39f6] hover:bg-[#615fff] text-white hover:shadow-[#4f39f6]/30"
    }`;
  };

  return (
    <nav className="bg-[#0F162A] text-white px-6 py-4 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo - يسار */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <img
              src={logo}
              alt="Tabliya Logo"
              className="h-10 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Links - يمين (الشاشات الكبيرة) */}
        <div className="hidden md:flex items-center space-x-4">
          {userLogin ? (
            <>
              <NavLink to="/" className={getLinkClass} end>
                Home
              </NavLink>
              <NavLink to="/profile" className={getLinkClass}>
                Profile
              </NavLink>
              <button className="" onClick={logout}>
                <IoIosLogOut className="w-6 h-6 hover:text-rose-500" />
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={getLinkClass}>
                Login
              </NavLink>

              {/* زر Register متميز */}
              <NavLink to="/register" className={getRegisterLinkClass}>
                Register
              </NavLink>
            </>
          )}
        </div>

        {/* Mobile Menu Button - للشاشات الصغيرة */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-300 hover:text-white focus:outline-none"
            aria-label="Toggle Menu"
          >
            {/* <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg> */}
            {isOpen ? (
              <HiX className="w-6 h-6" />
            ) : (
              <CgMenuLeftAlt className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 pb-4 border-t border-slate-800 pt-4 flex flex-col space-y-3">
          {userLogin ? (
            <>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `px-2 py-1 ${isActive ? "text-[#615fff] font-semibold" : "text-white"}`
                }
                onClick={() => setIsOpen(false)}
                end
              >
                Home
              </NavLink>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `px-2 py-1 ${isActive ? "text-[#615fff] font-semibold" : "text-white"}`
                }
                onClick={() => setIsOpen(false)}
              >
                Profile
              </NavLink>
              <button
                onClick={logout}
                className="group flex items-center justify-center gap-1.5 text-gray-700 hover:text-rose-500 transition-colors duration-200"
              >
                <span className="text-sm font-medium">Logout</span>
                <IoIosLogOut className="w-5 h-5 text-gray-500 group-hover:text-rose-500 transition-colors duration-200" />
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `px-2 py-1 ${isActive ? "text-[#615fff] font-semibold" : "text-white"}`
                }
                onClick={() => setIsOpen(false)}
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-center font-medium transition-colors duration-200 ${isActive ? "bg-[#615fff] text-white" : "bg-[#4f39f6] text-white"}`
                }
                onClick={() => setIsOpen(false)}
              >
                Register
              </NavLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

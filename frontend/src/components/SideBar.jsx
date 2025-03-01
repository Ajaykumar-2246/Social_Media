import React, { useEffect } from "react";
import { Home, User, Bookmark, LogOut } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../zustandStore/AuthStore";
import { useUserStore } from "../zustandStore/userStore";

const SideBar = () => {
  const { logout } = useAuthStore();
  const { loggedInUserDetails, loggedInUser } = useUserStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    loggedInUser();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex flex-col h-screen bg-base-200 text-base-content w-16 sm:w-64 lg:w-72 p-4 border-r border-white">
      {/* Logo or Title */}
      <div className="mb-8 flex justify-center sm:justify-start">
        <h1 className="text-xl sm:text-2xl font-bold hidden sm:block ">
        ChirpNet
        </h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1">
        <ul className="space-y-2">
          <li>
            <Link
              to="/"
              className={`flex items-center p-2 rounded-lg hover:bg-primary hover:text-white transition-colors
                ${location.pathname === "/" ? "bg-primary text-white" : ""}`}
            >
              <Home className="w-5 h-5" />
              <span className="hidden md:block ml-3">Home</span>
            </Link>
          </li>
          <li>
            <Link
              to="/profile"
              className={`flex items-center p-2 rounded-lg hover:bg-primary hover:text-white transition-colors
                ${
                  location.pathname === "/profile"
                    ? "bg-primary text-white"
                    : ""
                }`}
            >
              <User className="w-5 h-5" />
              <span className="hidden md:block ml-3">Profile</span>
            </Link>
          </li>
          <li>
            <Link
              to="/saved-posts"
              className={`flex items-center p-2 rounded-lg hover:bg-primary hover:text-white transition-colors
                ${
                  location.pathname === "/saved-posts"
                    ? "bg-primary text-white"
                    : ""
                }
                `}
            >
              <Bookmark className="w-5 h-5" />
              <span className="hidden md:block ml-3">Bookmark</span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* Profile Section */}
      {loggedInUserDetails && (
        <div className="mt-auto">
          <div className="flex flex-col sm:flex-row items-center rounded-lg">
            <img
              src={
                loggedInUserDetails?.user?.profileImg ||
                "https://i.pinimg.com/236x/de/59/6d/de596de8fd7df0b424fd6d9f300623d9.jpg"
              }
              alt="Profile"
              className="size-10 rounded-full object-cover"
            />
            <div className="hidden sm:block ml-3">
              <p className="font-semibold text-sm">
                {loggedInUserDetails?.user?.fullName || "Guest User"}
              </p>
              <p className="font-semibold text-gray-500 text-sm">
                {loggedInUserDetails?.user?.username || "guest"}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-red-500 hover:text-white rounded-lg transition-colors ml-auto"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SideBar;
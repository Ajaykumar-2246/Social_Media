import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "./zustandStore/AuthStore";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import SavedPosts from "./pages/SavedPosts";
import SearchUserProfile from "./pages/SearchUserProfile";

function App() {
  const { user, isCheckingAuth, checkAuth } = useAuthStore();
  const navigate = useNavigate();

  // Check authentication when the app loads
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Show loading spinner while checking authentication
  if (isCheckingAuth) {
    return (
      <div
        className="flex justify-center  items-center min-h-screen"
        data-theme="dark"
      >
        <Loader2 className="animate-spin h-12 w-12 text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen" data-theme="dark">
      <Routes>
        <Route path="/" element={user ? <HomePage /> : <Login />} />
        <Route
          path="/signup"
          element={user ? <Navigate to="/" /> : <SignUp />}
        />
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route
          path="/profile"
          element={user ? <ProfilePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/saved-posts"
          element={user ? <SavedPosts /> : <Navigate to="/login" />}
        />
        <Route
          path="/searchedProfile/:id"
          element={user ? <SearchUserProfile /> : <Navigate to="/login" />}
        />
      </Routes>

      <Toaster />
    </div>
  );
}

export default App;

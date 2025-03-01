import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../zustandStore/AuthStore";

const Login = () => {
  const { login, isLoggingIn } = useAuthStore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const validateData = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email))
      newErrors.email = "Invalid email format";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLoginData = async (e) => {
    e.preventDefault();
    if (!validateData()) return;

    await login(formData);
    navigate("/");
    setFormData({ email: "", password: "" });
    setErrors({});
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200">
      <div className="bg-base-100 shadow-2xl rounded-2xl p-6 w-full max-w-sm mx-4">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-base-content mb-1">
            Welcome Back!
          </h1>
          <p className="text-sm text-base-content/70">Login to your account</p>
        </div>

        <form onSubmit={handleLoginData}>
          {errors.form && (
            <p className="text-sm text-error mb-3">{errors.form}</p>
          )}

          {/* Email Field */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-base-content mb-1"
            >
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              name="email"
              id="email"
              className="w-full px-3 py-1.5 border border-base-300 rounded-md bg-base-200 focus:ring-2 focus:ring-primary text-sm"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-xs text-error mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-base-content mb-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                name="password"
                id="password"
                className="w-full px-3 py-1.5 border border-base-300 rounded-md bg-base-200 focus:ring-2 focus:ring-primary text-sm"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-error mt-1">{errors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full btn btn-primary text-white py-1.5 px-4 rounded-md hover:bg-primary-focus transition duration-300 mb-3 disabled:opacity-50 text-sm"
            disabled={isLoggingIn}
          >
            {isLoggingIn ? "Logging In..." : "Login"}
          </button>
        </form>

        {/* Don't have an account? Sign Up Link */}
        <div className="text-center">
          <p className="text-sm text-base-content/70">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

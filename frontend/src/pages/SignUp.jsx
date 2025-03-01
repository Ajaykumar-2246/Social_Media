import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../zustandStore/AuthStore";

const SignUp = () => {
  const { signUp, isSigningUp } = useAuthStore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const validateData = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.fullName) newErrors.fullName = "Full name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!confirmPassword)
      newErrors.confirmPassword = "Confirm Password is required";
    if (formData.password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    // Password strength validation
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Password must be at least 8 characters and include uppercase, lowercase, numbers, and special characters";
    }

    // Email format validation
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUpData = async (e) => {
    e.preventDefault();
    if (!validateData()) return;

    try {
      await signUp(formData);
      navigate("/");
      setFormData({ username: "", fullName: "", email: "", password: "" });
      setConfirmPassword("");
      setErrors({});
    } catch (error) {
      setErrors({
        form: error.response?.data?.message || "Signup failed. Try again.",
      });
    }
  };

  // Clear errors when the user starts typing in a field
  const clearError = (field) => {
    if (errors[field]) {
      setErrors((prevErrors) => ({ ...prevErrors, [field]: "" }));
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200">
      <div className="bg-base-100 shadow-2xl rounded-2xl p-6 w-full max-w-sm mx-4">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-base-content mb-1">
            Create an Account
          </h1>
          <p className="text-sm text-base-content/70">
            Join our community today!
          </p>
        </div>

        <form onSubmit={handleSignUpData}>
          {errors.form && (
            <p className="text-sm text-error mb-3">{errors.form}</p>
          )}

          {/* Username and Full Name Fields (Side by Side) */}
          <div className="flex gap-4 mb-4">
            {/* Username Field */}
            <div className="flex-1">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-base-content mb-1"
              >
                Username
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => {
                  setFormData({ ...formData, username: e.target.value });
                  clearError("username");
                }}
                name="username"
                id="username"
                className="w-full px-3 py-1.5 border border-base-300 rounded-md bg-base-200 focus:ring-2 focus:ring-primary text-sm"
                placeholder="Enter your username"
              />
              {errors.username && (
                <p className="text-xs text-error mt-1">{errors.username}</p>
              )}
            </div>

            {/* Full Name Field */}
            <div className="flex-1">
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-base-content mb-1"
              >
                Full Name
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => {
                  setFormData({ ...formData, fullName: e.target.value });
                  clearError("fullName");
                }}
                name="fullName"
                id="fullName"
                className="w-full px-3 py-1.5 border border-base-300 rounded-md bg-base-200 focus:ring-2 focus:ring-primary text-sm"
                placeholder="Enter your full name"
              />
              {errors.fullName && (
                <p className="text-xs text-error mt-1">{errors.fullName}</p>
              )}
            </div>
          </div>

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
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                clearError("email");
              }}
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
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  clearError("password");
                }}
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

          {/* Confirm Password Field */}
          <div className="mb-4">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-base-content mb-1"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  clearError("confirmPassword");
                }}
                name="confirmPassword"
                id="confirmPassword"
                className="w-full px-3 py-1.5 border border-base-300 rounded-md bg-base-200 focus:ring-2 focus:ring-primary text-sm"
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-error mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full btn btn-primary text-white py-1.5 px-4 rounded-md hover:bg-primary-focus transition duration-300 mb-3 disabled:opacity-50 text-sm"
            disabled={isSigningUp}
          >
            {isSigningUp ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        {/* Already have an account? Login Link */}
        <div className="text-center">
          <p className="text-sm text-base-content/70">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

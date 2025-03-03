import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

// const baseUrl = "http://localhost:3000/api/auth";
const baseUrl = "https://linkup-zlqw.onrender.com/api/auth";

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
  user: null,
  isCheckingAuth: false,
  isSigningUp: false,
  isLoggingIn: false,

  // Check if the user is authenticated
  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axios.get(`${baseUrl}/checkAuth`);
      set({ user: res.data });
    } catch (error) {
      console.error("Auth check failed:", error);
      set({ user: null }); // Ensure user is reset on failure
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // Sign Up Function
  signUp: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axios.post(`${baseUrl}/signup`, data);
      set({ user: res.data }); // Update user state
      toast.success("User created successfully");
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(error.response?.data?.message || "Signup failed. Try again.");
    } finally {
      set({ isSigningUp: false });
    }
  },

  // Login Function
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axios.post(`${baseUrl}/login`, data);
      set({ user: res.data }); // Update user state
      toast.success("Logged in successfully");
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Login failed. Try again.");
    } finally {
      set({ isLoggingIn: false }); // Reset loading state
    }
  },

  // Logout Function
  logout: async () => {
    try {
      await axios.post(`${baseUrl}/logout`);
      set({ user: null }); // Reset user state
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed. Try again.");
    }
  },
}));

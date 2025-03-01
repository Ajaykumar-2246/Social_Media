import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const baseUrl = "https://chirpnet.onrender.com/api/post";
// const baseUrl = "http://localhost:3000/api/post";
axios.defaults.withCredentials = true;

export const usePostStore = create((set) => ({
  posts: [],
  isCreatingPost: false,

  getAllPosts: async () => {
    try {
      const res = await axios.get(`${baseUrl}/getAllPosts`);
      set({ posts: res.data.posts });
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  },

  createPost: async (postData) => {
    set({ isCreatingPost: true });
    try {
      const res = await axios.post(`${baseUrl}/createPost`, postData);
      toast.success("Post created successfully");
    } catch (error) {
      console.error("Post creation error:", error);
    } finally {
      set({ isCreatingPost: false });
    }
  },

  saveThePosts: async (postId) => {
    try {
      const res = await axios.post(`${baseUrl}/savePosts/${postId}`);
      toast.success("Post saved successfully");
    } catch (error) {
      console.error("Error saving post:", error);
      toast.error("Error saving post. Try again.");
    }
  },

  unSaveThePost: async (postId) => {
    try {
      const res = await axios.post(`${baseUrl}/savePosts/${postId}`);
      toast.success("Post unsaved successfully");
    } catch (error) {
      console.error("Error unsaving post:", error);
      toast.error("Error unsaving post. Try again.");
    }
  },

 
  likeUnlikePost:async(postId)=>{
    try {
      const res=await axios.put(`${baseUrl}/likeUnlike/${postId}`);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  }
}));

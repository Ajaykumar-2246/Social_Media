import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const baseUrl = "https://linkup-zlqw.onrender.com/api/user";
// const baseUrl = "http://localhost:3000/api/user";
axios.defaults.withCredentials = true;

export const useUserStore = create((set, get) => ({
  savedPosts: [],
  loggedInUserDetails: null,
  isSavingPostLoading: false,
  loggedInUserPosts: [],
  suggestedUsersList: [],
  searchedUserDetails: null,
  otherUserData: null,

  loggedInUser: async () => {
    try {
      const res = await axios.get(`${baseUrl}/LoggedInUserDetail`);
      set({ loggedInUserDetails: res.data });
    } catch (error) {
      console.error("Error fetching saved posts:", error);
    }
  },

  savedPostsOfUser: async () => {
    set({ isSavingPostLoading: true });
    try {
      const res = await axios.get(`${baseUrl}/getAllSavedPostsOfUser`);
      set({ savedPosts: res.data.savedPosts });
    } catch (error) {
      console.error("Error fetching saved posts:", error);
    } finally {
      set({ isSavingPostLoading: false });
    }
  },

  getLoggedInUserPosts: async () => {
    try {
      const res = await axios.get(`${baseUrl}/getPostOfUser`);
      set({ loggedInUserPosts: res.data.posts });
    } catch (error) {
      console.error("Error fetching saved posts:", error);
    }
  },

  updateUser: async (formData) => {
    try {
      const res = await axios.put(`${baseUrl}/updateProfile`, formData);
      await get().loggedInUser();
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error fetching saved posts:", error);
      toast.error("Error updating profile. Try again.");
    }
  },

  updateUserProfilePicture: async (formData) => {
    try {
      const res = await axios.put(`${baseUrl}/updateProfilePic`, formData);
      await get().loggedInUser(); // Refresh user data after update
      toast.success("Profile picture updated successfully");
    } catch (error) {
      console.error("Error updating profile picture:", error);
      toast.error("Error updating profile picture. Try again.");
    }
  },

  deletePost: async (postId) => {
    try {
      const res = await axios.delete(`${baseUrl}/deletePost/${postId}`);
      await get().getLoggedInUserPosts();
      toast.success("Post deleted successfully");
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Error deleting post. Try again.");
    }
  },

  suggestedUsers: async () => {
    try {
      const res = await axios.get(`${baseUrl}/suggestedUsers`);
      set({ suggestedUsersList: res.data.suggestedUsers });
    } catch (error) {
      console.error("Error fetching suggested users:", error);
    }
  },

  followUser: async (userId) => {
    try {
      const res = await axios.put(`${baseUrl}/followUnfollow/${userId}`);
      await get().suggestedUsers();
      await get().loggedInUser();
      toast.success("User followed successfully");
    } catch (error) {
      console.error("Error following user:", error);
      toast.error("Error following user. Try again.");
    }
  },

  unfollowUser: async (userId) => {
    try {
      const res = await axios.put(`${baseUrl}/followUnfollow/${userId}`);
      await get().suggestedUsers();
      await get().loggedInUser();
      toast.success("User unfollowed successfully");
    } catch (error) {
      console.error("Error following user:", error);
      toast.error("Error following user. Try again.");
    }
  },

  searchUsers: async (username) => {
    try {
      const res = await axios.get(`${baseUrl}/searchUser/${username}`);
      set({ searchedUserDetails: res.data.user });
    } catch (error) {
      console.error("Error searching users:", error);
    }
  },

  clearSearchedUserDetails: async () => {
    set({ searchedUserDetails: null });
  },

  fetchOtherUserData: async (userId) => {
    try {
      const res = await axios.get(`${baseUrl}/getOtherUserProfile/${userId}`);

      set({ otherUserData: res.data });
    } catch (error) {
      console.error("Error fetching other user data:", error);
    }
  },
}));

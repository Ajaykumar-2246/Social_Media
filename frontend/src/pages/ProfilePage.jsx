import React, { useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import SuggestedUser from "../components/SuggestedUser";
import { useUserStore } from "../zustandStore/userStore";
import { useAuthStore } from "../zustandStore/AuthStore";
import { Edit } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";

const ProfilePage = () => {
  const {
    deletePost,
    loggedInUserDetails,
    loggedInUser,
    loggedInUserPosts,
    getLoggedInUserPosts,
    updateUser,
    updateUserProfilePicture,
  } = useUserStore();
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    bio: "",
  });
  const [editModal, setEditModal] = useState(false);
  const [profilePreview, setProfilePreview] = useState(null); // For profile picture preview
  const [profileFile, setProfileFile] = useState(null); // For storing the selected file
  const [isUploading, setIsUploading] = useState(false); // Loading state for profile picture upload

  // Initialize formData when loggedInUserDetails is available
  useEffect(() => {
    if (loggedInUserDetails?.user) {
      setFormData({
        username: loggedInUserDetails.user.username || "",
        fullName: loggedInUserDetails.user.fullName || "",
        email: loggedInUserDetails.user.email || "",
        bio: loggedInUserDetails.user.bio || "",
      });
    }
  }, [loggedInUserDetails]);

  // Fetch logged-in user details and posts
  useEffect(() => {
    loggedInUser();
    getLoggedInUserPosts();
  }, []);

  // Handle profile picture upload
  const handleUpdateProfile = async (event) => {
    const file = event.target.files[0];

    if (file) {
      setIsUploading(true); // Start loading

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file.");
        setIsUploading(false);
        return;
      }

      // Validate file size (e.g., 2MB limit)
      const maxSize = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSize) {
        toast.error("File size exceeds 2MB. Please choose a smaller image.");
        setIsUploading(false);
        return;
      }

      // Create URL for preview
      const imageURL = URL.createObjectURL(file);
      setProfilePreview(imageURL);
      setProfileFile(file);

      // Upload the image to the server
      const formData = new FormData();
      formData.append("profileImg", file);

      try {
        await updateUserProfilePicture(formData);
        toast.success("Profile picture updated successfully!");
      } catch (error) {
        toast.error("Failed to update profile picture. Please try again.");
      } finally {
        setIsUploading(false); // End loading
      }
    }
  };

  // Handle updating user data
  const handleUpdateUserData = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.fullName || !formData.email) return;

    // Validate email format using regex
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    await updateUser(formData);
    setEditModal(false);
  };

  // Handle deleting a post
  const handleDeletePost = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      await deletePost(postId);
    }
  };

  // Loading state
  if (!loggedInUserDetails) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );
  }

  return (
    <div className="flex relative min-h-screen bg-base-200 font-sans">
      {/* Sidebar */}
      <div className="flex-shrink-0">
        <SideBar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 bg-base-200 overflow-y-auto h-screen max-w-3xl no-scrollbar">
        {/* Profile Header */}
        <div className="bg-base-100 p-6 rounded-lg shadow-lg">
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="relative">
              <img
                src={
                  profilePreview ||
                  loggedInUserDetails?.user?.profileImg ||
                  "https://i.pinimg.com/236x/de/59/6d/de596de8fd7df0b424fd6d9f300623d9.jpg"
                }
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover ring-4 ring-primary ring-opacity-25"
              />
              <label
                htmlFor="profile-picture"
                className="absolute bottom-0 right-0 bg-white rounded-full p-2 cursor-pointer hover:bg-gray-100 transition-all duration-300"
              >
                <Edit className="size-2 text-primary" />
              </label>
              <input
                id="profile-picture"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleUpdateProfile}
                disabled={isUploading}
              />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-2xl font-bold text-base-content">
                {loggedInUserDetails?.user?.fullName || "Unknown User"}
              </h1>
              <p className="text-gray-500">
                @{loggedInUserDetails?.user?.username}
              </p>
              <p className="mt-2 text-base-content">
                {loggedInUserDetails?.user?.bio || "No bio available"}
              </p>
            </div>
          </div>
          <div className="mt-4 flex justify-center md:justify-start space-x-6">
            <div>
              <span className="font-bold text-base-content">
                {loggedInUserDetails?.user?.followers.length || 0}
              </span>
              <span className="text-gray-500"> Followers</span>
            </div>
            <div>
              <span className="font-bold text-base-content">
                {loggedInUserDetails?.user?.followings.length || 0}
              </span>
              <span className="text-gray-500"> Following</span>
            </div>
          </div>
          <button
            onClick={() => setEditModal(!editModal)}
            className="mt-4 btn bg-gradient-to-r from-primary to-secondary text-white font-bold py-2 px-6 rounded-full hover:from-secondary hover:to-primary transition-all duration-300"
          >
            <Edit className="size-4" /> Edit Profile
          </button>
        </div>

        {/* Posts Section */}
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4 text-base-content">Posts</h2>
          <div className="space-y-6">
            {loggedInUserPosts && loggedInUserPosts.length > 0 ? (
              loggedInUserPosts.map((post) => (
                <div
                  key={post._id}
                  className="bg-base-100 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  {loggedInUserDetails?.user?.username ===
                    user?.user?.username && (
                    <div className="p-2">
                      <button
                        onClick={() => handleDeletePost(post._id)}
                        className="btn-error bg-error text-white font-bold py-2 px-4 rounded-full hover:bg-red-700 hover:ring-4 hover:ring-red-300 transition-all duration-300"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                  {post.image && (
                    <img
                      src={post.image}
                      alt="Post"
                      className="w-full h-64 object-cover rounded-lg mb-4"
                    />
                  )}
                  {post.description && (
                    <p className="text-base-content text-lg">
                      {post.description}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No posts available.</p>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-gray-900 opacity-50"
            onClick={() => setEditModal(false)}
          ></div>

          {/* Modal Content */}
          <div className="bg-base-100 p-6 rounded-lg shadow-lg z-50 w-11/12 md:w-2/3 lg:w-1/2 relative">
            {/* Close (X) Icon */}
            <button
              onClick={() => setEditModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Modal Title */}
            <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>

            {/* Form */}
            <form className="space-y-4" onSubmit={handleUpdateUserData}>
              {/* Username and Full Name (Side by Side) */}
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-base-content mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-base-content mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-base-content mb-1">
                  Email
                </label>
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-base-content mb-1">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  rows="3"
                  className="w-full p-2 resize-none border rounded-lg focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Save and Cancel Buttons */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setEditModal(false)}
                  className="btn btn-ghost text-gray-600 hover:bg-gray-100 font-bold py-2 px-6 rounded-full transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn bg-gradient-to-r from-primary to-secondary text-white font-bold py-2 px-6 rounded-full hover:from-secondary hover:to-primary transition-all duration-300"
                >
                  Update Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Suggested Users Section */}
      <div className="hidden lg:block flex-shrink-0 w-1/4 p-8 border-l border-base-300">
        <SuggestedUser />
      </div>
    </div>
  );
};

export default ProfilePage;

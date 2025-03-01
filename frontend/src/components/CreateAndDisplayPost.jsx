import React, { useEffect, useState } from "react";
import { usePostStore } from "../zustandStore/PostStore";
import { useAuthStore } from "../zustandStore/AuthStore";
import { Image,HeartOff, Heart, Save, X } from "lucide-react"; // Import X icon
import { useUserStore } from "../zustandStore/userStore";
import { Link } from "react-router-dom";

const CreateAndDisplayPost = () => {
  const {
    getAllPosts,
    posts,
    createPost,
    isCreatingPost,
    saveThePosts,
    likeUnlikePost,
  } = usePostStore();
  const { user } = useAuthStore();
  const {
    searchedUserDetails,
    searchUsers,
    clearSearchedUserDetails,
    loggedInUserDetails,
    loggedInUser,
  } = useUserStore(); // Add clearSearchedUserDetails
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [error, setError] = useState("");
  const [searchedUser, setSearchedUser] = useState("");
  const [searchError, setSearchError] = useState("");

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB size limit
        alert("File size must be less than 5MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // Base64 string
        setImagePreview(reader.result); // For preview
        setError("");
      };
      reader.readAsDataURL(file); // Convert image to Base64
    }
  };

  // Handle post creation
  const handleTweetData = async (e) => {
    e.preventDefault();
    if (!image && !description) {
      setError("Please add a description or an image.");
      return;
    }

    const tweetData = { description, image }; // Base64 image string

    try {
      await createPost(tweetData);
      await getAllPosts();
      // Reset form
      setDescription("");
      setImage("");
      setImagePreview("");
      setError("");
    } catch (err) {
      setError("Failed to create post. Please try again.");
    }
  };
  useEffect(() => {
    loggedInUser();
  }, []);

  // Fetch posts on component mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        await getAllPosts();
      } catch (err) {
        setError("Failed to fetch posts. Please try again.");
      }
    };
    fetchPosts();
  }, [getAllPosts]);

  // Handle saving a post
  const handleSavePost = async (postId) => {
    await saveThePosts(postId);
  };

  // Handle user search
  const handleSearchData = async (e) => {
    e.preventDefault();
    if (!searchedUser.trim()) {
      setSearchError("Please enter a username to search.");
      return;
    }

    try {
      await searchUsers(searchedUser);
      setSearchError("");
    } catch (err) {
      setSearchError("User not found. Please try again.");
    }
  };

  // Handle closing the search results
  const handleCloseSearchResults = () => {
    clearSearchedUserDetails(); // Clear the searched user details
    setSearchedUser(""); // Reset the search input
    setSearchError(""); // Clear any search errors
  };

  const handleLikePost = async (postId) => {
    await likeUnlikePost(postId);
    await getAllPosts();
  };


  console.log("posts", posts);
  console.log("loggedInUserDetails", loggedInUserDetails);
  

  return (
    <div className="p-4 h-[calc(100vh-2rem)] overflow-y-auto no-scrollbar scroll-smooth border-r min-h-screen bg-base-100">
      {/* Search Bar */}
      <div className="bg-base-100 p-4 border-b border-base-300">
        <div className="relative">
          <form onSubmit={handleSearchData} className="flex items-center gap-2">
            <input
              type="text"
              value={searchedUser}
              onChange={(e) => setSearchedUser(e.target.value)}
              placeholder="Search users..."
              className="w-5/6 p-2 rounded-lg bg-base-200 placeholder:text-base-content/50"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-500 text-white font-semibold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity duration-200"
            >
              Search
            </button>
          </form>
          {searchError && (
            <p className="text-error mt-2 text-sm">{searchError}</p>
          )}
          {searchedUserDetails && (
            <div className="absolute top-7 mt-4 p-4 bg-base-300 w-5/6 rounded-lg">
              <div className="flex justify-between items-center">
                <Link
                  to={`/searchedProfile/${searchedUserDetails._id}`}
                  onClick={handleCloseSearchResults}
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        searchedUserDetails.profileImg ||
                        "https://via.placeholder.com/150"
                      }
                      alt={searchedUserDetails.fullName}
                      className="size-12 rounded-full object-cover"
                    />
                    <div className="flex flex-col">
                      <span className="font-semibold text-base-content">
                        {searchedUserDetails.fullName}
                      </span>
                      <span className="text-sm text-base-content/80">
                        @{searchedUserDetails.username}
                      </span>
                    </div>
                  </div>
                </Link>
                <button
                  onClick={handleCloseSearchResults}
                  className="p-2 rounded-full hover:bg-base-400 transition-colors duration-200"
                  aria-label="Close search results"
                >
                  <X className="size-5 text-base-content" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Post Form */}
      <form
        onSubmit={handleTweetData}
        className="mb-8 p-4 border-b border-base-300"
      >
        <div className="flex gap-4">
          <img
            src={
              loggedInUserDetails?.user?.profileImg ||
              "https://i.pinimg.com/236x/de/59/6d/de596de8fd7df0b424fd6d9f300623d9.jpg"
            }
            alt="User"
            className="size-12 rounded-full object-cover"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full resize-none p-2 rounded-lg bg-base-200 placeholder:text-base-content/50"
            rows="3"
          />
        </div>

        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            className="w-20 h-20 object-cover mt-4 rounded-lg"
          />
        )}

        {/* Custom Image Upload Button */}
        <div className="flex items-center justify-between mt-4">
          <label className="flex items-center justify-center size-10 rounded-lg cursor-pointer bg-base-200 hover:bg-base-300">
            <Image className="size-5 text-base-content" />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              aria-label="Upload image"
            />
          </label>
          <button
            type="submit"
            disabled={isCreatingPost}
            aria-disabled={isCreatingPost}
            className="bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-500 text-white font-semibold py-2 px-6 rounded-full hover:opacity-90 transition-opacity duration-200"
          >
            {isCreatingPost ? "Tweeting..." : "Tweet"}
          </button>
        </div>

        {error && <p className="text-error mt-2">{error}</p>}
      </form>

      {/* Display Posts */}
      <div className="space-y-4 p-4">
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post?._id}
              className="card bg-base-200 shadow-md hover:shadow-lg transition-shadow duration-200"
            >
              <div className="card-body">
                <div className="flex  items-start gap-4">
                  <img
                    src={
                      post.userId?.profileImg ||
                      "https://via.placeholder.com/50"
                    }
                    alt={post.userId?.fullName || "User"}
                    className="size-9 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <Link to={loggedInUserDetails?.user?._id === post?.userId?._id ? "/profile" : `/searchedProfile/${post.userId?._id}`}><h2 className="text-sm cursor-pointer  text-base-content">
                      @{post.userId?.username || "Anonymous"}
                    </h2></Link>
                    {post.description && (
                      <p className="text-base-content/80 mt-2">
                        {post.description}
                      </p>
                    )}
                    {post.image && (
                      <img
                        src={post.image}
                        alt="Post"
                        className="w-full h-64 object-cover mt-4 rounded-lg"
                      />
                    )}
                    <div className="flex items-center justify-between mt-4">
                      <button
                        onClick={() => handleLikePost(post?._id)}
                        className="btn btn-ghost btn-sm"
                      >
                        {post.likes.includes(loggedInUserDetails?.user?._id) ? (
                          <HeartOff  className="size-5" />
                        ) : (
                          <Heart className="size-5" />
                        )}

                        <span className="">{post.likes.length || 0}</span>
                      </button>
                      <button
                        onClick={() => handleSavePost(post?._id)}
                        className="btn btn-ghost btn-sm"
                      >
                        <Save className="size-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-base-content/50">No posts available.</p>
        )}
      </div>
    </div>
  );
};

export default CreateAndDisplayPost;

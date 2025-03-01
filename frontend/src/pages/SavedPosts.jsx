import React, { useEffect } from "react";
import SideBar from "../components/SideBar";
import SuggestedUser from "../components/SuggestedUser";
import { useUserStore } from "../zustandStore/userStore";
import { usePostStore } from "../zustandStore/PostStore";
import { Link } from "react-router-dom";
import { SaveOff, Heart, MessageCircle, Share } from "lucide-react";

const SavedPosts = () => {
  const { savedPostsOfUser, savedPosts, isSavingPostLoading } = useUserStore();
  const { unSaveThePost } = usePostStore();
  const { loggedInUser, loggedInUserDetails } = useUserStore();

  useEffect(() => {
    savedPostsOfUser();
    loggedInUser();
  }, [savedPostsOfUser, loggedInUser]);

  const handleUnsavePost = async (postId) => {
    await unSaveThePost(postId);
    savedPostsOfUser(); // Refresh the saved posts list
  };

  console.log(savedPosts);

  return (
    <div className="flex min-h-screen bg-base-200">
      {/* Sidebar (Fixed) */}
      <div className="flex-shrink-0">
        <SideBar />
      </div>

      {/* Saved Posts Section (Scrollable) */}
      <div className="flex-1 p-8 bg-base-200 overflow-y-auto max-w-3xl h-screen no-scrollbar">
        <h1 className="text-3xl font-bold text-base-content mb-6">
          Saved Posts
        </h1>
        {isSavingPostLoading ? (
          <div className="flex justify-center items-center h-64">
            <span className="loading loading-spinner text-primary"></span>
          </div>
        ) : savedPosts && savedPosts.length > 0 ? (
          <div className="space-y-6">
            {savedPosts.map((post) => (
              <div
                key={post._id}
                className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="card-body">
                  <div className="flex items-start space-x-4">
                    {/* User Avatar */}
                    <div className="avatar">
                      <div className="w-12 h-12 rounded-full">
                        <img
                          src={
                            post.userId?.profileImg ||
                            "https://via.placeholder.com/50"
                          }
                          alt={post.user?.name || "User"}
                          className="rounded-full size-8"
                        />
                      </div>
                    </div>
                    {/* Post Content */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <Link
                          to={
                            loggedInUserDetails.user._id === post.userId._id
                              ? "/profile"
                              : `/searchedProfile/${post.userId?._id}`
                          }
                        >
                          <h2 className="text-sm font-bold text-base-content">
                            {post.userId?.username || "Anonymous"}
                          </h2>
                        </Link>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => handleUnsavePost(post._id)}
                        >
                          <SaveOff className="w-5 h-5 text-red-500" />
                        </button>
                      </div>
                      {post.description && (
                        <p className="text-base-content mt-2">
                          {post.description}
                        </p>
                      )}
                      {post.image && (
                        <div className="mt-4">
                          <img
                            src={post.image}
                            alt="Post"
                            className="w-full h-64 object-cover rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-base-content text-lg">
              No saved posts available.
            </p>
          </div>
        )}
      </div>

      {/* Suggested Users Section (Fixed) */}
      <div className="hidden lg:block flex-shrink-0 w-1/4 p-8 border-l border-base-300">
        <SuggestedUser />
      </div>
    </div>
  );
};

export default SavedPosts;

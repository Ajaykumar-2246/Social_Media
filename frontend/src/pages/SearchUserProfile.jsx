import React, { useEffect } from "react";
import SideBar from "../components/SideBar";
import SuggestedUser from "../components/SuggestedUser";
import { Edit } from "lucide-react";
import { useParams } from "react-router-dom";
import { useUserStore } from "../zustandStore/userStore";

const SearchUserProfile = () => {
  const {
    fetchOtherUserData,
    otherUserData,
    loggedInUserDetails,
    loggedInUser,
    followUser,
    unfollowUser,
  } = useUserStore();
  const { id } = useParams();

  // Fetch the other user's data when the `id` changes
  useEffect(() => {
    fetchOtherUserData(id);
  }, [id, fetchOtherUserData]);

  // Fetch the logged-in user's data when the component mounts
  useEffect(() => {
    loggedInUser();
  }, [loggedInUser]);

  // Handle follow/unfollow button click
  const handleFollowUser = async (userId) => {
    if (userId) {
      await followUser(userId);
      await fetchOtherUserData(id);
    }
  };


  const handleUnfollowUser = async (userId) => {
    if (userId) {
      await unfollowUser(userId);
      await fetchOtherUserData(id);
    }
  }

  return (
    <div className="flex relative min-h-screen bg-base-200 font-sans">
      {/* Sidebar */}
      <div className="flex-shrink-0">
        <SideBar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 bg-base-200 overflow-y-auto max-w-3xl h-screen no-scrollbar">
        {/* Profile Header */}
        <div className="bg-base-100 p-6 rounded-lg shadow-lg">
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="relative">
              <img
                src={
                  otherUserData?.user?.profileImg ||
                  "https://i.pinimg.com/236x/de/59/6d/de596de8fd7df0b424fd6d9f300623d9.jpg"
                }
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover ring-4 ring-primary ring-opacity-25"
              />
             
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-2xl font-bold text-base-content">
                {otherUserData?.user?.fullName || "Unknown User"}
              </h1>
              <p className="text-gray-500">
                @{otherUserData?.user?.username || "username"}
              </p>
              <p className="mt-2 text-base-content">
                {otherUserData?.user?.bio || "No bio available"}
              </p>
            </div>
          </div>
          <div className="mt-4 flex justify-center md:justify-start space-x-6">
            <div>
              <span className="font-bold text-base-content">
                {otherUserData?.user?.followers?.length || 0}
              </span>
              <span className="text-gray-500"> Followers</span>
            </div>
            <div>
              <span className="font-bold text-base-content">
                {otherUserData?.user?.followings?.length || 0}
              </span>
              <span className="text-gray-500"> Following</span>
            </div>
          </div>

          {/* Follow/Unfollow Button */}
          {loggedInUserDetails?.user?.followings.includes(
            otherUserData?.user?._id
          ) ? (
            <button
              onClick={() => handleUnfollowUser(otherUserData?.user?._id)}
              className="mt-4 btn btn-outline border-primary text-primary font-bold py-2 px-6 rounded-full
             hover:bg-primary hover:text-white transition-all duration-300"
            >
              {" "}
              Unfollow
            </button>
          ) : (
            <button
              onClick={() => handleFollowUser(otherUserData?.user?._id)}
              className="mt-4 btn btn-outline border-primary text-primary font-bold py-2 px-6 rounded-full
             hover:bg-primary hover:text-white transition-all duration-300"
            >
              Follow
            </button>
          )}
        </div>

        {/* Posts Section */}
        {otherUserData?.posts?.length > 0 ? (
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-4 text-base-content border-b pt-2">
              <span className="border-b-2 border-primary">Posts</span>
            </h2>
            <div className="space-y-6">
              {otherUserData.posts.map((post) => (
                <div
                  key={post._id}
                  className="bg-base-100 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
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
              ))}
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-6">No posts available.</p>
        )}
      </div>

      {/* Suggested Users Section */}
      <div className="hidden lg:block flex-shrink-0 w-1/4 p-8 border-l border-base-300">
        <SuggestedUser />
      </div>
    </div>
  );
};

export default SearchUserProfile;

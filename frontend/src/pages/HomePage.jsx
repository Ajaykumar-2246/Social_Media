import React from "react";
import SideBar from "../components/SideBar";
import SuggestedUser from "../components/SuggestedUser";
import CreateAndDisplayPost from "../components/CreateAndDisplayPost";

const HomePage = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar (Fixed) */}
      <div className="flex-shrink-0">
        <SideBar />
      </div>

      {/* Main Content (Scrollable) */}
      <div className="flex-1 max-w-3xl ">
        <CreateAndDisplayPost />
      </div>

      {/* Suggested Users Section (Fixed) */}
      <div className="hidden lg:block flex-shrink-0 w-1/4 p-8 border-l border-base-300">
        <SuggestedUser />
      </div>
    </div>
  );
};

export default HomePage;

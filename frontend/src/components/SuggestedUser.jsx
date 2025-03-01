import React, { useEffect } from "react";
import { useUserStore } from "../zustandStore/userStore";
import { Link } from "react-router-dom";

const SuggestedUser = () => {
  const { suggestedUsers, suggestedUsersList} = useUserStore();

  useEffect(() => {
    suggestedUsers();
  }, []);
  const limitSuggestedUsers = () => suggestedUsersList.slice(0, 4);

 

  return (
    <div className="bg-base-300 p-6 rounded-lg shadow-md w-full">
      <h2 className="text-xl font-bold mb-4 text-base-content">
        Suggested Users
      </h2>
      {limitSuggestedUsers().length > 0 ? (
        <ul className="space-y-4">
          {limitSuggestedUsers().map((suggestedUser) => (
            <li
              className="flex items-center space-x-4 justify-between"
              key={suggestedUser._id}
            >
              <Link to={`/searchedProfile/${suggestedUser._id}`}>
                <div className="flex items-center space-x-3">
                  <img
                    src={suggestedUser.profileImg || "https://via.placeholder.com/150"}
                    alt="User"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-base-content">
                      {suggestedUser.fullName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {suggestedUser.username}
                    </p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-base-content">No suggested users found.</p>
      )}
    </div>
  );
};

export default SuggestedUser;

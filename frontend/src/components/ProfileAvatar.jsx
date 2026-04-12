import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCurrentUser, isLoggedIn } from "../lib/session";
import DefaultProfile from "../assets/Profile.png";

export default function ProfileAvatar({ className = "w-10 h-10 rounded-full cursor-pointer hover:opacity-80 transition object-cover" }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (isLoggedIn()) {
      fetchCurrentUser()
        .then((data) => {
          if (data) setUser(data);
        })
        .catch(() => {});
    }
  }, []);

  const handleClick = () => {
    navigate(isLoggedIn() ? "/profile" : "/login");
  };

  if (user && user.picture) {
    return (
      <img
        src={user.picture}
        alt="Profile"
        onClick={handleClick}
        className={className}
        referrerPolicy="no-referrer"
      />
    );
  }

  if (user && user.name) {
    return (
      <div
        onClick={handleClick}
        className={`${className} bg-[#295f4e] text-white flex items-center justify-center font-semibold`}
      >
        {user.name.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <img
      src={DefaultProfile}
      alt="Profile"
      onClick={handleClick}
      className={className}
    />
  );
}

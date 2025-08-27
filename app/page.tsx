"use client";
import { MdDarkMode, MdLightMode } from 'react-icons/md';
import { FaTrophy, FaUser, FaMoon, FaSun } from 'react-icons/fa';
import { useState, useEffect, useRef } from "react";
import { User, Trophy, TrendingUp } from 'lucide-react';
import axios from "axios";
import { useSocket } from "./context/socketContext";
import { URL } from "./config/url";

export default function Home() {
  const { socket } = useSocket();
  const [darkMode, setDarkMode] = useState(false);
  const [username, setUsername] = useState<null | string>(null);
  const nameRef = useRef<null | HTMLInputElement>(null);
  const [isNameAdded, setIsNamedAdded] = useState<boolean>(false);


  type userType = {
    global_count: number;
    users: { username: string; user_count: number }[];
  }

  const [leaderboard, setLeaderboard] = useState<{
    global_count: number;
    users: { username: string; user_count: number }[];
  }>({
    global_count: 0,
    users: []
  });

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Get red shade based on ranking - more clicks = darker red
  const getRedShade = (userCount: number, maxCount: number, rank: number) => {
    // Special colors for top 3 users
    if (rank === 0) return 'from-yellow-400 to-yellow-500'; // Gold for 1st place
    else if (rank === 1) return 'from-gray-400 to-gray-500'; // Silver for 2nd place  
    else if (rank === 2) return 'from-amber-600 to-amber-700'; // Bronze for 3rd place

    // Regular red shades for everyone else
    const ratio = maxCount > 0 ? userCount / maxCount : 0;
    if (ratio >= 0.8) return 'from-red-700 to-red-800'; // Darkest red for top performers
    else if (ratio >= 0.6) return 'from-red-600 to-red-700';
    else if (ratio >= 0.4) return 'from-red-500 to-red-600';
    else if (ratio >= 0.2) return 'from-red-400 to-red-500';
    else return 'from-red-300 to-red-400'; // Lightest red for lowest counts
  };

  //Getting all the Users
  useEffect(() => {
    async function get() {
      const res = await axios.get(URL)
      // console.log(res.data)
      if (res) {
        setLeaderboard(res.data)
      }
    }
    get()
  }, [])

  // 🔌 Socket handling
  useEffect(() => {
    if (!socket) return;

    console.log("Socket ID:", socket.id);

    socket.on("connected", () => {
      console.log("Socket connection established");
    });

    socket.on("leaderboard-update", (data: userType) => {
      setLeaderboard(data);
    });

    return () => {
      socket.off("connected");
      socket.off("leaderboard-update");
    };
  }, [socket]);

  // 📦 Load username from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("username");
    if (stored) {
      const name = JSON.parse(stored) as string;
      setUsername(name);
      setIsNamedAdded(true);
    }
  }, []);

  // ✏️ Submit username
  const handleSubmitName = async () => {
    const name: string | undefined = nameRef?.current?.value;
    const safeName: string = name ?? "DefaultName";

    if (!name?.trim()) {
      alert("Please enter a name");
      return;
    }

    const res = await axios.post(`${URL}/addUser`, { username: safeName });

    if (res.data.user_existed) {
      alert("User existed");
    } else {
      setIsNamedAdded(true);
      setUsername(safeName);
      localStorage.setItem("username", JSON.stringify(safeName));
    }
  };

  // 🔼 Increase click count
  const handleIncrease = () => {
    if (username) {
      socket?.emit("increase", username);
    }
  };

  // Calculate width percentage with log scale
  const getWidthPercent = (count: number) => {
    const maxCount = Math.max(...leaderboard.users.map(u => u.user_count), 1);
    const width = (Math.log(count + 1) / Math.log(maxCount + 1)) * 100;
    return Math.max(width, 10); // minimum width 10%
  };


  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-white'
      }`}>
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${darkMode ? '#374151' : '#f1f5f9'};
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #ef4444, #dc2626);
          border-radius: 10px;
          border: 1px solid #fca5a5;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #dc2626, #b91c1c);
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #ef4444 ${darkMode ? '#374151' : '#f1f5f9'};
        }
      `}</style>

      {/* Dark Mode Toggle */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={toggleDarkMode}
          className={`p-3 rounded-full shadow-lg transition-all duration-300 ${darkMode
              ? 'bg-yellow-500 hover:bg-yellow-400 text-gray-900'
              : 'bg-gray-800 hover:bg-gray-700 text-yellow-500'
            }`}
        >
          {darkMode ? <MdLightMode size={20} /> : <MdDarkMode size={20} />}
        </button>
      </div>

      {/* TOP SEGMENT - Leaderboard */}
      <div className="flex flex-col items-center p-6 h-[calc(100vh-120px)]">
        <div className="flex items-center gap-2 mb-6">
          <FaTrophy className="text-red-500 w-8 h-8" />
          <h1 className={`text-3xl md:text-4xl font-bold transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'
            }`}>
            Click Leaderboard
          </h1>
        </div>

        {/* Global Count */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 text-2xl font-semibold">
            <TrendingUp className="text-red-600 w-6 h-6" />
            <span className={`transition-colors duration-300 ${darkMode ? 'text-gray-200' : 'text-gray-900'
              }`}>
              Global Count:
            </span>
            <span className="text-red-600">{leaderboard.global_count.toLocaleString()}</span>
          </div>
        </div>

        {/* Leaderboard - Responsive Width */}
        <div className={`w-full max-w-2xl lg:max-w-xl flex-1 overflow-y-auto overflow-x-hidden border rounded-lg p-4 min-h-0 custom-scrollbar transition-colors duration-300 ${darkMode
            ? 'border-gray-700 bg-gray-800'
            : 'border-gray-200 bg-gray-50'
          }`}>
          <div className="space-y-3">
            {leaderboard.users.map((user, index) => (
              <div
                key={user.username}
                className={`w-full pb-3 border-b border-dotted last:border-b-0 transition-colors duration-300 ${user.username === username
                    ? darkMode
                      ? 'bg-gray-700 rounded-lg p-3 border-red-400'
                      : 'bg-gray-200 rounded-lg p-3 border-red-200'
                    : darkMode
                      ? 'border-gray-600'
                      : 'border-gray-300'
                  }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-3">
                    <span className={`text-lg font-bold w-6 transition-colors duration-300 ${darkMode ? 'text-gray-200' : 'text-gray-800'
                      }`}>
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                    </span>
                    <div className="flex items-center gap-2">
                      <FaUser className={`w-4 h-4 transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`} />
                      <span className={`font-semibold transition-colors duration-300 ${darkMode ? 'text-gray-100' : 'text-gray-900'
                        }`}>
                        {user.username}
                      </span>
                    </div>
                  </div>
                  <span className={`text-sm font-semibold transition-colors duration-300 ${darkMode ? 'text-gray-200' : 'text-gray-800'
                    }`}>
                    {user.user_count.toLocaleString()} clicks
                  </span>
                </div>

                {/* Progress Bar */}
                <div className={`w-full h-4 relative overflow-hidden rounded-sm ${darkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
                  <div
                    className={`h-full bg-gradient-to-r ${getRedShade(user.user_count,
                      Math.max(...leaderboard.users.map(u => u.user_count), 1), index)} 
                    transition-all duration-700 ease-out relative rounded-sm ${darkMode ? 'border border-gray-600' : 'border border-gray-200'
                      }`}
                    style={{ width: `${getWidthPercent(user.user_count)}%` }}
                  >
                    {/* Subtle gradient overlay for depth */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black opacity-10"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM SEGMENT - Input/Button - Fixed at bottom */}
      <div className={`shadow-lg border-t-4 border-red-500 p-6 h-[120px] flex-shrink-0 transition-colors duration-300 ${darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
        <div className="max-w-md mx-auto">
          {isNameAdded ? (
            <div className="text-center">
              <button
                onClick={handleIncrease}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-4 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105 font-bold text-lg shadow-lg flex items-center justify-center gap-2"
              >
                <TrendingUp className="w-5 h-5" />
                Click to Grow!
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <FaUser className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-400'
                  }`} />
                <input
                  ref={nameRef}
                  type="text"
                  placeholder="Enter your name to join the competition"
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 focus:outline-none text-lg transition-colors duration-300 ${darkMode
                      ? 'border-gray-600 focus:border-red-500 bg-gray-700 text-white placeholder-gray-400'
                      : 'border-gray-200 focus:border-red-500 bg-white text-gray-900 placeholder-gray-500'
                    }`}
                />
              </div>
              <button
                onClick={handleSubmitName}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-4 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105 font-bold text-lg shadow-lg flex items-center justify-center gap-2"
              >
                <FaTrophy className="w-5 h-5" />
                Join the Competition!
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

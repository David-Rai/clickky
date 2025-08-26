"use client";
import { useState, useEffect, useRef } from "react";
import { User, Trophy, TrendingUp } from 'lucide-react';
import axios from "axios";
import { useSocket } from "./context/socketContext";
import { URL } from "./config/url";

export default function Home() {
  const { socket } = useSocket();
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


  // Get red shade based on ranking - more clicks = darker red
  const getRedShade = (userCount: number, maxCount: number) => {
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
      // console.log("Leaderboard update:", data);
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

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* TOP SEGMENT - Leaderboard */}
      <div className="flex-1 flex flex-col items-center p-6">
        <div className="flex items-center gap-2 mb-6">
          <Trophy className="text-red-500 w-8 h-8" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 ">Click Leaderboard</h1>
        </div>

        {/* Global Count */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 text-2xl font-semibold">
            <TrendingUp className="text-red-600 w-6 h-6" />
            <span className="text-gray-900">Global Count: </span>
            <span className="text-red-600">{leaderboard.global_count.toLocaleString()}</span>
          </div>
        </div>

        {/* Leaderboard with Stack Overflow Style Chart */}
        <div className="w-full space-y-3">
          {leaderboard.users.map((user, index) => (
            <div key={user.username} className="w-full pb-3 border-b border-dotted border-gray-300 last:border-b-0">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-gray-800 w-6">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                  </span>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-600" />
                    <span className="font-semibold text-gray-900">{user.username}</span>
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-800">
                  {user.user_count.toLocaleString()} clicks
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-4 relative overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${getRedShade(user.user_count, Math.max(...leaderboard.users.map(u => u.user_count)))} transition-all duration-700 ease-out relative rounded-sm border border-gray-200`}
                  style={{ width: `${Math.max((user.user_count / Math.max(...leaderboard.users.map(u => u.user_count), 1)) * 100, 10)}%` }}
                >
                  {/* Subtle gradient overlay for depth */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black opacity-10"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BOTTOM SEGMENT - Input/Button */}
      <div className="bg-white shadow-lg border-t-4 border-red-500 p-6">
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
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  ref={nameRef}
                  type="text"
                  placeholder="Enter your name to join the competition"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-red-500 focus:outline-none text-lg"
                />
              </div>
              <button
                onClick={handleSubmitName}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-4 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105 font-bold text-lg shadow-lg flex items-center justify-center gap-2"
              >
                <Trophy className="w-5 h-5" />
                Join the Competition!
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

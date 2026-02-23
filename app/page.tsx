
"use client";
// import { MdDarkMode, MdLightMode } from 'react-icons/md';
import LeaderboardUser from './components/LeaderBoardUser';
import LeaderboardLoader from './components/LeaderBoardLoader';
import GlobalCount from './components/GlobalCount';
import GlobalCountLoader from './components/GlobalCountLoader';
import Header from './components/Header'
import { FaUser} from 'react-icons/fa';
import { MdPersonAdd } from 'react-icons/md';
import { useState, useEffect, useRef } from "react";
import {TrendingUp } from 'lucide-react';
import axios from "axios";
import { useSocket } from "./context/socketContext";
import { URL } from "./config/url";

// Types
type UserType = {
  username: string;
  user_count: number;
};

type LeaderboardType = {
  global_count: number;
  users: UserType[];
};

// Leaderboard Component
const Leaderboard = ({ 
  leaderboard, 
  currentUsername, 
  isLoading 
}: { 
  leaderboard: LeaderboardType; 
  currentUsername: string | null;
  isLoading: boolean;
}) => {
  const getRedShade = (userCount: number, maxCount: number, rank: number) => {
    if (rank === 0) return 'from-yellow-400 to-yellow-500';
    else if (rank === 1) return 'from-gray-400 to-gray-500';
    else if (rank === 2) return 'from-amber-600 to-amber-700';

    const ratio = maxCount > 0 ? userCount / maxCount : 0;
    if (ratio >= 0.8) return 'from-red-700 to-red-800';
    else if (ratio >= 0.6) return 'from-red-600 to-red-700';
    else if (ratio >= 0.4) return 'from-red-500 to-red-600';
    else if (ratio >= 0.2) return 'from-red-400 to-red-500';
    else return 'from-red-300 to-red-400';
  };

  const getWidthPercent = (count: number) => {
    const maxCount = Math.max(...leaderboard.users.map(u => u.user_count), 1);
    const width = (Math.log(count + 1) / Math.log(maxCount + 1)) * 100;
    return Math.max(width, 10);
  };

  const maxCount = Math.max(...leaderboard.users.map(u => u.user_count), 1);

  if (isLoading) {
    return <LeaderboardLoader />;
  }

  return (
    <div className="w-full max-w-2xl lg:max-w-xl flex-1 overflow-y-auto overflow-x-hidden border border-gray-700 bg-gray-800 rounded-lg p-3 md:p-4 min-h-0 custom-scrollbar">
      <div className="space-y-3">
        {leaderboard.users.map((user, index) => (
          <LeaderboardUser
            key={user.username}
            user={user}
            index={index}
            currentUsername={currentUsername}
            getRedShade={getRedShade}
            getWidthPercent={getWidthPercent}
            maxCount={maxCount}
          />
        ))}
      </div>
    </div>
  );
};

// Username Input Component
const UsernameInput = ({ 
  nameRef, 
  onSubmit, 
  isSubmitting 
}: { 
  nameRef: React.RefObject<HTMLInputElement | null>; 
  onSubmit: () => void;
  isSubmitting: boolean;
}) => (
  <div className="space-y-3 md:space-y-4">
    <div className="relative">
      <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
      <input
        ref={nameRef}
        type="text"
        placeholder="Enter your name to join"
        className="w-full pl-10 md:pl-12 pr-4 py-3 md:py-4 rounded-lg border-2 border-gray-600 focus:border-red-500 bg-gray-700 text-white placeholder-gray-400 focus:outline-none text-base md:text-lg transition-colors duration-300"
        disabled={isSubmitting}
      />
    </div>
    <button
      onClick={onSubmit}
      disabled={isSubmitting}
      className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105 font-bold text-base md:text-lg shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
    >
      {isSubmitting ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span className="hidden md:inline">Joining...</span>
          <span className="md:hidden">Joining...</span>
        </div>
      ) : (
        <>
          <MdPersonAdd className="w-5 h-5 md:w-6 md:h-6" />
          <span className="hidden md:inline">Join the Competition!</span>
          <span className="md:hidden">Join Competition</span>
        </>
      )}
    </button>
  </div>
);

// Click Button Component
const ClickButton = ({ onIncrease}: { onIncrease: () => void;}) => (
  <div className="text-center">
    <button
      onClick={onIncrease}
      className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105 font-bold text-base md:text-lg shadow-lg flex items-center justify-center gap-2 disabled:opacity-75"
    >

        <>
          <TrendingUp className="w-5 h-5 md:w-6 md:h-6" />
          <span className="hidden md:inline">Click to Grow!</span>
          <span className="md:hidden">Click to Grow!</span>
        </>
    </button>
  </div>
);


// Main Home Component
export default function Home() {
  const { socket } = useSocket();
  const [username, setUsername] = useState<null | string>(null);
  const nameRef = useRef<null | HTMLInputElement>(null);
  const [isNameAdded, setIsNamedAdded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [leaderboard, setLeaderboard] = useState<LeaderboardType>({
    global_count: 0,
    users: []
  });

  // Getting all the Users
  useEffect(() => {
    async function get() {
      try {
        if (!URL) {
          throw new Error("NEXT_PUBLIC_SERVER_URL is not defined");
          
        }
        setIsLoading(true);
        const res = await axios.get(URL);
        if (res) {
          setLeaderboard(res.data);
        }
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setIsLoading(false);
      }
    }
    get();
  }, []);

  // Socket handling
  useEffect(() => {
    if (!socket) return;

    console.log("Socket ID:", socket.id);

    socket.on("connected", () => {
      console.log("Socket connection established");
    });

    socket.on("leaderboard-update", (data: LeaderboardType) => {
      setLeaderboard(data);
    });

    return () => {
      socket.off("connected");
      socket.off("leaderboard-update");
    };
  }, [socket]);

  // Load username from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("username");
    if (stored) {
      const name = JSON.parse(stored) as string;
      setUsername(name);
      setIsNamedAdded(true);
    }
  }, []);

  // Submit username
  const handleSubmitName = async () => {
    const name: string | undefined = nameRef?.current?.value;
    const safeName: string = name ?? "DefaultName";

    if (!name?.trim()) {
      alert("Please enter a name");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await axios.post(`${URL}/addUser`, { username: safeName });

      if (res.data.user_existed) {
        alert("User existed");
      } else {
        setIsNamedAdded(true);
        setUsername(safeName);
        localStorage.setItem("username", JSON.stringify(safeName));
      }
    } catch (error) {
      console.error("Error adding user:", error);
      alert("Error joining competition. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Increase click count
  const handleIncrease = () => {
    if (username) {
      socket?.emit("increase", username);
      
    }
  };

  const getRedShade = (userCount: number, maxCount: number, rank: number) => {
    if (rank === 0) return 'from-yellow-400 to-yellow-500';
    else if (rank === 1) return 'from-gray-400 to-gray-500';
    else if (rank === 2) return 'from-amber-600 to-amber-700';

    const ratio = maxCount > 0 ? userCount / maxCount : 0;
    if (ratio >= 0.8) return 'from-red-700 to-red-800';
    else if (ratio >= 0.6) return 'from-red-600 to-red-700';
    else if (ratio >= 0.4) return 'from-red-500 to-red-600';
    else if (ratio >= 0.2) return 'from-red-400 to-red-500';
    else return 'from-red-300 to-red-400';
  };

  const getWidthPercent = (count: number) => {
    const maxCount = Math.max(...leaderboard.users.map(u => u.user_count), 1);
    const width = (Math.log(count + 1) / Math.log(maxCount + 1)) * 100;
    return Math.max(width, 10);
  };

  const maxCount = Math.max(...leaderboard.users.map(u => u.user_count), 1);

  return (
    <div className="min-h-screen max-h-screen flex flex-col bg-gray-900 overflow-hidden">
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #374151;
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
          scrollbar-color: #ef4444 #374151;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }

        /* Ensure mobile viewport units work correctly */
        @supports (-webkit-touch-callout: none) {
          .min-h-screen {
            min-height: -webkit-fill-available;
          }
          .max-h-screen {
            max-height: -webkit-fill-available;
          }
        }
      `}</style>

      {/* TOP SEGMENT - Header, Global Count, and Leaderboard */}
      <div className="flex-1 flex flex-col p-4 md:p-6 min-h-0">
        <Header />

        {/* Global Count */}
        {isLoading ? <GlobalCountLoader /> : <GlobalCount count={leaderboard.global_count} />}

        {/* Leaderboard - Takes remaining space */}
        {isLoading ? (
          <LeaderboardLoader />
        ) : (
          <div className="w-full max-w-2xl lg:max-w-xl mx-auto flex-1 overflow-y-auto overflow-x-hidden border border-gray-700 bg-gray-800 rounded-lg p-3 md:p-4 min-h-0 custom-scrollbar">
            <div className="space-y-3">
              {leaderboard.users.map((user, index) => (
                <LeaderboardUser
                  key={user.username}
                  user={user}
                  index={index}
                  currentUsername={username}
                  getRedShade={getRedShade}
                  getWidthPercent={getWidthPercent}
                  maxCount={maxCount}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM SEGMENT - Action Area - Fixed at bottom */}
      <div className="shadow-lg border-t-4 border-red-500 p-4 md:p-6 bg-gray-800 flex-shrink-0">
        <div className="max-w-md mx-auto">
          {isNameAdded ? (
            <ClickButton onIncrease={handleIncrease} />
          ) : (
            <UsernameInput 
              nameRef={nameRef} 
              onSubmit={handleSubmitName}
              isSubmitting={isSubmitting}
            />
          )}
        </div>
      </div>
    </div>
  );
}
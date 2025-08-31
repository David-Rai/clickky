
import { FaUser } from "react-icons/fa";

// Types
type UserType = {
    username: string;
    user_count: number;
  };
  
  type LeaderboardType = {
    global_count: number;
    users: UserType[];
  };

// Individual User Component
const LeaderboardUser = ({ 
  user, 
  index, 
  currentUsername, 
  getRedShade, 
  getWidthPercent,
  maxCount 
}: { 
  user: UserType; 
  index: number; 
  currentUsername: string | null;
  getRedShade: (userCount: number, maxCount: number, rank: number) => string;
  getWidthPercent: (count: number) => number;
  maxCount: number;
}) => (
  <div
    className={`w-full pb-3 border-b border-dotted last:border-b-0 transition-all duration-500 animate-fadeIn ${
      user.username === currentUsername
        ? 'bg-gray-700 rounded-lg p-3 border-red-400'
        : 'border-gray-600'
    }`}
    style={{ animationDelay: `${index * 100}ms` }}
  >
    <div className="flex items-center justify-between mb-1">
      <div className="flex items-center gap-2 md:gap-3">
        <span className="text-base md:text-lg font-bold w-5 md:w-6 text-gray-200">
          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
        </span>
        <div className="flex items-center gap-2">
          <FaUser className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
          <span className="font-semibold text-sm md:text-base text-gray-100 truncate max-w-[120px] md:max-w-none">
            {user.username}
          </span>
        </div>
      </div>
      <span className="text-xs md:text-sm font-semibold text-gray-200 flex-shrink-0">
        {user.user_count.toLocaleString()}
      </span>
    </div>

    {/* Progress Bar */}
    <div className="w-full h-3 md:h-4 relative overflow-hidden rounded-sm bg-gray-700">
      <div
        className={`h-full bg-gradient-to-r ${getRedShade(user.user_count, maxCount, index)} 
        transition-all duration-700 ease-out relative rounded-sm border border-gray-600`}
        style={{ width: `${getWidthPercent(user.user_count)}%` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black opacity-10"></div>
      </div>
    </div>
  </div>
);


export default LeaderboardUser
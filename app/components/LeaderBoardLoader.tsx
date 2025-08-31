
import UserSkeleton from "./UserSkeleton";

// Leaderboard Loading Component
const LeaderboardLoader = () => (
  <div className="w-full max-w-2xl lg:max-w-xl flex-1 overflow-y-auto overflow-x-hidden border border-gray-700 bg-gray-800 rounded-lg p-3 md:p-4 min-h-0 custom-scrollbar">
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <UserSkeleton key={index} />
      ))}
    </div>
  </div>
);

export default LeaderboardLoader
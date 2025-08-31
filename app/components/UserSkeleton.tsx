
// Leaderboard User Skeleton
const UserSkeleton = () => (
    <div className="w-full pb-3 border-b border-dotted border-gray-600">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-gray-700 rounded animate-pulse"></div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-700 rounded animate-pulse"></div>
            <div className="h-5 w-20 md:w-24 bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="h-5 w-12 md:w-16 bg-gray-700 rounded animate-pulse"></div>
      </div>
      <div className="w-full h-3 md:h-4 bg-gray-700 relative overflow-hidden rounded-sm">
        <div className="h-full bg-gradient-to-r from-gray-400 to-gray-500 w-1/3 animate-pulse rounded-sm"></div>
      </div>
    </div>
  );

  
  export default UserSkeleton

import { FaTrophy, FaUser, FaMoon, FaSun } from 'react-icons/fa';

// Header Component
 const Header = () => (
  <div className="flex items-center justify-center gap-2 mb-4 md:mb-6">
    <FaTrophy className="text-red-500 w-6 h-6 md:w-8 md:h-8" />
    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white text-center">
      Click Leaderboard
    </h1>
  </div>
);

export default Header
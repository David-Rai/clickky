import {TrendingUp } from 'lucide-react';

// Loading Animation Components
const GlobalCountLoader = () => (
    <div className="mb-6 text-center">
      <div className="flex items-center justify-center gap-2 text-xl md:text-2xl font-semibold">
        <TrendingUp className="text-red-600 w-5 h-5 md:w-6 md:h-6 animate-pulse" />
        <span className="text-gray-200">Global Count:</span>
        <div className="flex items-center gap-1">
          <div className="h-6 md:h-8 w-16 md:w-20 bg-gray-700 rounded animate-pulse"></div>
          <div className="flex gap-1">
            <div className="w-1 h-1 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-1 h-1 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-1 h-1 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  );

  export default GlobalCountLoader
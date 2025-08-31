import { TrendingUp } from "lucide-react";

interface GlobalCountProps {
  count: number;
}

const GlobalCount = ({ count }: GlobalCountProps) => (
  <div className="mb-6 text-center">
    <div className="flex items-center justify-center gap-2 text-xl md:text-2xl font-semibold">
      <TrendingUp className="text-red-600 w-5 h-5 md:w-6 md:h-6" />
      <span className="text-gray-200">Global Count:</span>
      <span className="text-red-600 animate-pulse">{count.toLocaleString()}</span>
    </div>
  </div>
);

export default GlobalCount;

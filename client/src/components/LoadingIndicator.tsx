import { cn } from "@/lib/utils";

export default function LoadingIndicator() {
  return (
    <div className="flex items-start">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-light to-primary flex items-center justify-center text-white font-bold text-sm mr-2 mt-1 flex-shrink-0">
        A
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg rounded-tl-none p-4 shadow-sm">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={cn(
                "h-1.5 w-1.5 rounded-full bg-primary/60 animate-bounce",
                i === 1 && "animation-delay-200",
                i === 2 && "animation-delay-400"
              )}
              style={{
                animationDelay: `${i * 0.2}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

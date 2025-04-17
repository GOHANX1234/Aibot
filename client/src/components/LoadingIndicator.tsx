import { Loader2 } from "lucide-react";

export default function LoadingIndicator() {
  return (
    <div className="flex items-center justify-center w-full py-6">
      <div className="flex items-center text-primary">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        <span className="text-sm font-medium animate-pulse">
          AuraAi is thinking...
        </span>
      </div>
    </div>
  );
}
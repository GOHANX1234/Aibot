import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { AI_MODELS } from "@shared/schema";
import { Sparkles } from "lucide-react";

type ModelSelectorProps = {
  selectedModel: string;
  onSelect: (model: string) => void;
  className?: string;
}

const modelInfo = {
  [AI_MODELS.X1]: {
    name: "X1",
    description: "Balanced model with good performance"
  },
  [AI_MODELS.X2]: {
    name: "X2",
    description: "Creative responses with detailed explanations"
  },
  [AI_MODELS.X3]: {
    name: "X3",
    description: "Fast responses optimized for efficiency"
  }
};

export default function ModelSelector({ selectedModel, onSelect, className = "" }: ModelSelectorProps) {
  return (
    <Select value={selectedModel} onValueChange={onSelect}>
      <SelectTrigger className={`h-9 px-3 py-1 text-xs rounded-full border-primary/50 bg-black/50 hover:bg-primary/10 transition-colors shadow-lg shadow-primary/5 backdrop-blur-md ${className}`}>
        <Sparkles className="h-3.5 w-3.5 mr-1.5 text-primary animate-pulse" />
        <SelectValue placeholder="Select Model">
          <span className="font-medium">{modelInfo[selectedModel as keyof typeof modelInfo]?.name || "Model"}</span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-[#0A0C1A] border border-primary/30 rounded-xl shadow-xl shadow-purple-900/20 backdrop-blur-xl p-1 text-sm">
        <SelectItem value={AI_MODELS.X1} className="hover:bg-primary/10 cursor-pointer rounded-lg py-3 px-3 my-1 transition-colors">
          <div className="flex flex-col items-start gap-1">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-blue-400 mr-2"></div>
              <span className="font-semibold">Model X1</span>
            </div>
            <span className="text-xs text-muted-foreground/80">{modelInfo[AI_MODELS.X1].description}</span>
          </div>
        </SelectItem>
        <SelectItem value={AI_MODELS.X2} className="hover:bg-primary/10 cursor-pointer rounded-lg py-3 px-3 my-1 transition-colors">
          <div className="flex flex-col items-start gap-1">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-purple-400 mr-2"></div>
              <span className="font-semibold">Model X2</span>
            </div>
            <span className="text-xs text-muted-foreground/80">{modelInfo[AI_MODELS.X2].description}</span>
          </div>
        </SelectItem>
        <SelectItem value={AI_MODELS.X3} className="hover:bg-primary/10 cursor-pointer rounded-lg py-3 px-3 my-1 transition-colors">
          <div className="flex flex-col items-start gap-1">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-violet-400 mr-2"></div>
              <span className="font-semibold">Model X3</span>
            </div>
            <span className="text-xs text-muted-foreground/80">{modelInfo[AI_MODELS.X3].description}</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}

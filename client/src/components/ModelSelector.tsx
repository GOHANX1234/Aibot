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
      <SelectTrigger className={`h-9 px-3 py-1 text-xs rounded-full border-primary/50 bg-background/80 hover:bg-primary/10 transition-colors ${className}`}>
        <Sparkles className="h-3.5 w-3.5 mr-1.5 text-primary" />
        <SelectValue placeholder="Select Model">
          {modelInfo[selectedModel as keyof typeof modelInfo]?.name || "Model"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-[#0D0F1E] border border-primary/20 text-sm">
        <SelectItem value={AI_MODELS.X1} className="hover:bg-primary/10 cursor-pointer">
          <div className="flex flex-col items-start">
            <span className="font-semibold">Model X1</span>
            <span className="text-xs text-muted-foreground">{modelInfo[AI_MODELS.X1].description}</span>
          </div>
        </SelectItem>
        <SelectItem value={AI_MODELS.X2} className="hover:bg-primary/10 cursor-pointer">
          <div className="flex flex-col items-start">
            <span className="font-semibold">Model X2</span>
            <span className="text-xs text-muted-foreground">{modelInfo[AI_MODELS.X2].description}</span>
          </div>
        </SelectItem>
        <SelectItem value={AI_MODELS.X3} className="hover:bg-primary/10 cursor-pointer">
          <div className="flex flex-col items-start">
            <span className="font-semibold">Model X3</span>
            <span className="text-xs text-muted-foreground">{modelInfo[AI_MODELS.X3].description}</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}

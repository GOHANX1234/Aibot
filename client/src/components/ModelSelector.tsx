import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { AI_MODELS } from "@shared/schema";

type ModelSelectorProps = {
  selectedModel: string;
  onSelect: (model: string) => void;
}

export default function ModelSelector({ selectedModel, onSelect }: ModelSelectorProps) {
  return (
    <Select value={selectedModel} onValueChange={onSelect}>
      <SelectTrigger className="w-[140px]">
        <SelectValue placeholder="Select Model" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={AI_MODELS.X1}>Model X1</SelectItem>
        <SelectItem value={AI_MODELS.X2}>Model X2</SelectItem>
        <SelectItem value={AI_MODELS.X3}>Model X3</SelectItem>
      </SelectContent>
    </Select>
  );
}

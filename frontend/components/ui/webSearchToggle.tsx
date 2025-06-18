import { Switch } from "@/frontend/components/ui/switch";
import { Label } from "@/frontend/components/ui/label";
import { Globe } from "lucide-react";

interface WebSearchToggleProps {
   enabled: boolean;
   onToggle: (enabled: boolean) => void;
}

export function WebSearchToggle({ enabled, onToggle }: WebSearchToggleProps) {
   return (
      <div className="flex items-center space-x-2 text-pink-text">
         <Globe className="h-4 w-4" />
         <Label htmlFor="web-search" className="text-sm font-medium">
            Search
         </Label>
         <Switch
            id="web-search"
            checked={enabled}
            onCheckedChange={onToggle}
         />
      </div>
   );
}
import { Label } from "@/frontend/components/ui/label";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { memo, useRef, useState } from "react";

interface BaseCapabilityToggleProps {
   enabled: boolean;
   onToggle: (enabled: boolean) => void;
   Icon: typeof Globe;
   labelText?: string
}

interface FileCapabilityToggleProps extends BaseCapabilityToggleProps {
   type: 'file';
   onFileSelect?: (files: FileList | null) => void;
   accept?: string;
   multiple?: boolean;
}

interface RegularCapabilityToggleProps extends BaseCapabilityToggleProps {
   type?: 'toggle'
}

type CapabilityToggleProps = FileCapabilityToggleProps | RegularCapabilityToggleProps;

const PureCapabiltyToggle = (props: CapabilityToggleProps) => {
   const { enabled, onToggle, Icon, labelText } = props;
   const [files, setFiles] = useState<FileList | undefined>(undefined);
   const fileInputRef = useRef<HTMLInputElement>(null);

   const handleClick = () => {
      if (props.type === 'file') {
         fileInputRef.current?.click();
      } else {
         onToggle(!enabled);
      }
   }

   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (props.type === 'file' && props.onFileSelect) {
         props.onFileSelect(event.target.files);
         // Enable the toggle when files are selected
         if (event.target.files && event.target.files.length > 0) {
            onToggle(true);
         }
      }
   };

   return (
      <div
         className={cn(
            "flex items-center gap-2 px-2.5 py-1 rounded-full cursor-pointer transition-all duration-200 select-none",
            "scale-90 border-zinc-700 border text-sidebar-foreground hover:bg-zinc-500/5",
            enabled
               ? "bg-zinc-400/15 border border-primary/20"
               : "hover:text-foreground"
         )}
         onClick={handleClick}
      >
         <Icon className={cn(
            "h-4 w-4 transition-colors duration-200",
         )} />
         {labelText &&
            <Label
               htmlFor="web-search"
               className={cn(
                  "text-sm font-medium cursor-pointer transition-colors duration-200",
               )}
            >
               {labelText}
            </Label>}

         {props.type === 'file' && (
            <input
               type="file"
               id="file-input"
               onChange={handleFileChange}
               multiple={props.multiple}
               ref={fileInputRef}
               accept={props.accept}
               className="hidden"
            />
         )}
      </div>
   );
};
const CapabilityToggle = memo(PureCapabiltyToggle);

CapabilityToggle.displayName = "CapabilityToggle";


export default CapabilityToggle;
import { Badge } from '@/frontend/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/frontend/components/ui/tooltip';
import { CAPABILITY_META, type CapabilityMeta } from '@/lib/capabilities';
import { type Capability } from '@/lib/models';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface CapabilityBadgeProps {
   capability: Capability;
   size?: 'sm' | 'default';
   showIcon?: boolean;
   showTooltip?: boolean;
   className?: string;
}

export function CapabilityBadge({
   capability,
   size = 'default',
   showIcon = true,
   showTooltip = true,
   className
}: CapabilityBadgeProps) {
   const meta = CAPABILITY_META[capability];
   const Icon = meta.icon;

   const badge = (
      <Badge
         variant="default"
         className={cn(
            "scale-110",
            "gap-1.5 whitespace-nowrap",
            size === 'sm' && "text-xs px-1 py-1",
            className
         )}
         style={{
            backgroundColor: `${meta.color}20`
         }}
      >
         {showIcon && <Icon className={cn("size-3", `text-[${meta.color}]`)} />}
      </Badge>
   );

   if (!showTooltip) return badge;

   return (
      <Tooltip>
         <TooltipTrigger asChild>
            {badge}
         </TooltipTrigger>
         <TooltipContent>
            <p>{meta.description}</p>
         </TooltipContent>
      </Tooltip>
   );
}

interface CapabilityListProps {
   capabilities: Capability[];
   maxVisible?: number;
   size?: 'sm' | 'default';
   className?: string;
}

export function CapabilityList({
   capabilities,
   maxVisible = 3,
   size = 'default',
   className
}: CapabilityListProps) {
   const [isClient, setIsClient] = useState(false);

   useEffect(() => {
      setIsClient(true);
   }, []);

   // Don't render during SSR to avoid hydration mismatch
   if (!isClient) {
      return <div className={cn("flex flex-wrap gap-1", className)} />;
   }

   const visible = capabilities.slice(0, maxVisible);
   const hidden = capabilities.slice(maxVisible);

   return (
      <div className={cn("flex flex-wrap gap-2", className)}>
         {visible.map((capability) => (
            <CapabilityBadge
               key={capability}
               capability={capability}
               size={size}
            />
         ))}
         {hidden.length > 0 && (
            <Tooltip>
               <TooltipTrigger asChild>
                  <Badge variant="outline" className="text-xs">
                     +{hidden.length} more
                  </Badge>
               </TooltipTrigger>
               <TooltipContent>
                  <div className="space-y-1">
                     {hidden.map((capability) => (
                        <div key={capability} className="text-sm">
                           {CAPABILITY_META[capability].label}
                        </div>
                     ))}
                  </div>
               </TooltipContent>
            </Tooltip>
         )}
      </div>
   );
}
import { Capability } from './models';
import {
   Globe,
   PaperclipIcon,
   EyeIcon,
   BrainIcon
} from 'lucide-react';

export interface CapabilityMeta {
   id: Capability;
   label: string;
   description: string;
   icon: typeof Globe;
   color: string;
   category: 'input' | 'output' | 'processing';
}

export const CAPABILITY_META: Record<Capability, CapabilityMeta> = {
   web_search: {
      id: 'web_search',
      label: 'Web Search',
      description: 'Uses Search to Access information',
      icon: Globe,
      color: '#98bfe2',
      category: 'input',
   },
   file_attachment: {
      id: 'file_attachment',
      label: 'File Upload',
      description: 'Supports PDF uploads and analysis',
      icon: PaperclipIcon,
      color: '#6e6ea8',
      category: 'input',
   },
   vision: {
      id: 'vision',
      label: 'Vision',
      description: 'Supports Image uploads and analysis',
      icon: EyeIcon,
      color: '#90d3c6',
      category: 'input',
   },
   reasoning: {
      id: 'reasoning',
      label: 'Advanced Reasoning',
      description: 'Has reasoning capabilities',
      icon: BrainIcon,
      color: '#b79ae4',
      category: 'processing',
   },
};
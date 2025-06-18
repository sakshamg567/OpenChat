import { useMemo } from 'react';
import {
   type AIModel,
   type Capability,
   getModelCapabilities,
   hasCapability
} from '@/lib/models';
import { CAPABILITY_META } from '@/lib/capabilities';

export function useModelCapabilities(model: AIModel) {
   return useMemo(() => {
      const capabilities = getModelCapabilities(model);

      return {
         capabilities,
         hasCapability: (capability: Capability) => hasCapability(model, capability),
         getCapabilityMeta: (capability: Capability) => CAPABILITY_META[capability],
         canAttachFiles: hasCapability(model, 'file_attachment'),
         canSearchWeb: hasCapability(model, 'web_search'),
         hasVision: hasCapability(model, 'vision'),
         hasReasoning: hasCapability(model, 'reasoning'),

         // Grouped capabilities
         inputCapabilities: capabilities.filter(cap =>
            CAPABILITY_META[cap].category === 'input'
         ),
         outputCapabilities: capabilities.filter(cap =>
            CAPABILITY_META[cap].category === 'output'
         ),
         processingCapabilities: capabilities.filter(cap =>
            CAPABILITY_META[cap].category === 'processing'
         ),
      };
   }, [model]);
}
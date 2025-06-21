import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CapabilityState {
   webSearchEnabled: boolean;
   setWebSearchEnabled: (enabled: boolean) => void;
   toggleWebSearch: () => void;

   // Add other capabilities here as needed
   imageGenerationEnabled: boolean;
   setImageGenerationEnabled: (enabled: boolean) => void;
   toggleImageGeneration: () => void;

   isReasoningEnabled: boolean;
   setIsReasoningEnabled: (enabled: boolean) => void;
   toggleReasoningEnabled: () => void;
}

export const useCapabilityStore = create<CapabilityState>()(
   persist(
      (set, get) => ({
         webSearchEnabled: false,
         setWebSearchEnabled: (enabled: boolean) => set({ webSearchEnabled: enabled }),
         toggleWebSearch: () => set((state) => ({ webSearchEnabled: !state.webSearchEnabled })),

         imageGenerationEnabled: false,
         setImageGenerationEnabled: (enabled: boolean) => set({ imageGenerationEnabled: enabled }),
         toggleImageGeneration: () => set((state) => ({ imageGenerationEnabled: !state.imageGenerationEnabled })),

         isReasoningEnabled: false,
         setIsReasoningEnabled: (enabled: boolean) => set({ isReasoningEnabled: enabled }), toggleReasoningEnabled: () => set((state) => ({ isReasoningEnabled: !state.isReasoningEnabled }))
      }),
      {
         name: 'capability-store',
      }
   )
);
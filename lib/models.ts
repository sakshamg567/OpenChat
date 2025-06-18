import { Provider } from '@/frontend/stores/APIKeyStore';

// Define all possible capabilities
export const CAPABILITIES = [
   'web_search',
   'file_attachment',
   'vision',
   'reasoning',
] as const;

export type Capability = (typeof CAPABILITIES)[number];

export const AI_MODELS = [
   'Deepseek R1 0528',
   'Deepseek V3',
   'Gemini 2.5 Pro',
   'Gemini 2.5 Flash',
   'GPT-4o',
   'GPT-4.1-mini',
] as const;

export type AIModel = (typeof AI_MODELS)[number];

export type ModelConfig = {
   modelId: string;
   provider: Provider;
   headerKey: string;
   capabilities: Capability[];
};

export const MODEL_CONFIGS: Record<AIModel, ModelConfig> = {
   'Deepseek R1 0528': {
      modelId: 'deepseek/deepseek-r1-0528:free',
      provider: 'openrouter',
      headerKey: 'X-OpenRouter-API-Key',
      capabilities: ['reasoning'],
   },
   'Deepseek V3': {
      modelId: 'deepseek/deepseek-chat-v3-0324:free',
      provider: 'openrouter',
      headerKey: 'X-OpenRouter-API-Key',
      capabilities: [],
   },
   'Gemini 2.5 Pro': {
      modelId: 'gemini-2.5-pro-preview-05-06',
      provider: 'google',
      headerKey: 'X-Google-API-Key',
      capabilities: ['web_search', 'file_attachment', 'vision', 'reasoning'],
   },
   'Gemini 2.5 Flash': {
      modelId: 'gemini-2.5-flash-preview-04-17',
      provider: 'google',
      headerKey: 'X-Google-API-Key',
      capabilities: ['web_search', 'vision', 'file_attachment'],
   },
   'GPT-4o': {
      modelId: 'gpt-4o',
      provider: 'openai',
      headerKey: 'X-OpenAI-API-Key',
      capabilities: ['vision'],
   },
   'GPT-4.1-mini': {
      modelId: 'gpt-4.1-mini',
      provider: 'openai',
      headerKey: 'X-OpenAI-API-Key',
      capabilities: ['vision'],
   },
};

export const getModelConfig = (modelName: AIModel): ModelConfig => {
   return MODEL_CONFIGS[modelName];
};

// Helper functions
export const hasCapability = (modelName: AIModel, capability: Capability): boolean => {
   return MODEL_CONFIGS[modelName].capabilities.includes(capability);
};

export const getModelCapabilities = (modelName: AIModel): Capability[] => {
   return MODEL_CONFIGS[modelName].capabilities;
};
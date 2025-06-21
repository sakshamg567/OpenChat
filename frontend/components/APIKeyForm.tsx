import React, { useCallback, useEffect, useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldError, useForm, UseFormRegister } from 'react-hook-form';
import { Link, useSearchParams } from 'react-router';
import {
   ArrowLeftIcon,
   Key
} from 'lucide-react';

import { Button, buttonVariants } from '@/frontend/components/ui/button';
import { Input } from '@/frontend/components/ui/input';
import { Badge } from '@/frontend/components/ui/badge';
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle
} from '@/frontend/components/ui/card';
import { toast } from 'sonner';
import { useAPIKeyStore } from '@/frontend/stores/APIKeyStore';
import Image, { StaticImageData } from 'next/image';
import Gemini from '@/public/gemini.png'
import OpenAi from '@/public/openai.png'
import OpenRouter from '@/public/open-router.png'


const formSchema = z.object({
   google: z.string().trim().min(1, {
      message: 'Google API key is required for Title Generation',
   }),
   openrouter: z.string().trim().optional(),
   openai: z.string().trim().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function Settings() {
   const [searchParams] = useSearchParams();
   const chatId = searchParams.get('from');
   const [activeTab, setActiveTab] = useState('api-keys');

   return (
      <div className="min-h-screen bg-sidebar">
         {/* Header */}
         <div className="sticky top-0 z-50 w-full backdrop-blur-2xl">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
               <div className="flex h-16 items-center justify-between">
                  <div className="flex items-center gap-4">
                     <Link
                        to={{
                           pathname: `/chat${chatId ? `/${chatId}` : ''}`,
                        }}
                        className={buttonVariants({
                           variant: 'ghost',
                           size: 'sm',
                        })}
                     >
                        <ArrowLeftIcon className="w-4 h-4 mr-2" />
                        Back to Chat
                     </Link>
                  </div>
               </div>
            </div>
         </div>

         <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
               {/* Sidebar Navigation */}
               <nav className="w-full lg:w-64 space-y-2">
                  <div className="sticky top-24">
                     {[
                        { id: 'api-keys', label: 'API Keys', icon: Key },
                     ].map((tab) => (
                        <button
                           key={tab.id}
                           onClick={() => setActiveTab(tab.id)}
                           className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-all ${activeTab === tab.id
                              ? 'bg-primary text-primary-foreground shadow-md'
                              : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                              }`}
                        >
                           <tab.icon className="w-4 h-4" />
                           <span className="font-medium">{tab.label}</span>
                        </button>
                     ))}
                  </div>
               </nav>

               {/* Main Content */}
               <div className="flex-1 space-y-6">
                  {activeTab === 'api-keys' && <APIKeysSection />}
               </div>
            </div>
         </div>
      </div>
   );
}

const APIKeysSection = () => {
   const { keys, setKeys } = useAPIKeyStore();

   const {
      register,
      handleSubmit,
      formState: { errors, isDirty },
      reset,
   } = useForm<FormValues>({
      resolver: zodResolver(formSchema),
      defaultValues: keys,
   });

   useEffect(() => {
      reset(keys);
   }, [keys, reset]);

   const onSubmit = useCallback(
      (values: FormValues) => {
         setKeys(values);
         toast.success('API keys saved successfully');
      },
      [setKeys]
   );

   return (
      <div className="space-y-6">
         <div>
            <h2 className="text-2xl font-bold tracking-tight">API Keys</h2>
            <p className="text-muted-foreground mt-2">
               Configure your API keys to enable chat functionality. All keys are stored locally in your browser.
            </p>
         </div>

         <Card className="shadow-lg border-0 bg-card/50 backdrop-blur">
            <CardHeader className="pb-4">
               <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                     <Key className="h-5 w-5 text-pink-text" />
                  </div>
                  <div>
                     <CardTitle>API Configuration</CardTitle>
                     <CardDescription>
                        Add your API keys to start chatting with AI models
                     </CardDescription>
                  </div>
               </div>
            </CardHeader>
            <CardContent>
               <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                  <ApiKeyField
                     id="google"
                     label="Google AI API Key"
                     models={['Gemini 2.5 Flash', 'Gemini 2.5 Pro']}
                     linkUrl="https://aistudio.google.com/apikey"
                     placeholder="AIza..."
                     register={register}
                     error={errors.google}
                     image={Gemini}
                     required
                  />

                  <ApiKeyField
                     id="openrouter"
                     label="OpenRouter API Key"
                     models={['DeepSeek R1 0538', 'DeepSeek-V3']}
                     linkUrl="https://openrouter.ai/settings/keys"
                     placeholder="sk-or-..."
                     register={register}
                     error={errors.openrouter}
                     image={OpenRouter}
                  />

                  <ApiKeyField
                     id="openai"
                     label="OpenAI API Key"
                     models={['GPT-4o', 'GPT-4.1-mini']}
                     linkUrl="https://platform.openai.com/settings/organization/api-keys"
                     placeholder="sk-..."
                     register={register}
                     error={errors.openai}
                     image={OpenAi}
                  />

                  <div className="pt-4">
                     <Button
                        type="submit"
                        className="w-full sm:w-auto px-8"
                        disabled={!isDirty}
                        size="lg"
                     >
                        Save API Keys
                     </Button>
                  </div>
               </form>
            </CardContent>
         </Card>
      </div>
   );
};

interface ApiKeyFieldProps {
   id: string;
   label: string;
   linkUrl: string;
   models: string[];
   placeholder: string;
   error?: FieldError | undefined;
   required?: boolean;
   register: UseFormRegister<FormValues>;
   image: StaticImageData
}

const ApiKeyField = ({
   id,
   label,
   linkUrl,
   placeholder,
   models,
   error,
   required,
   register,
   image
}: ApiKeyFieldProps) => (
   <div className="space-y-4 p-6 rounded-lg border bg-card/30">
      <div className="space-y-2">
         <label
            htmlFor={id}
            className="text-pink-text font-semibold flex items-center gap-2"
         >
            {label}
            {required && (
               <Badge variant="secondary" className="text-xs">
                  Required
               </Badge>
            )}
         </label>

         <div className="flex flex-wrap gap-2">
            {models.map((model) => (
               <Badge key={model} variant="outline" className="text-xs">
                  {model}
               </Badge>
            ))}
         </div>
      </div>

      <div className="space-y-3">
         <Input
            id={id}
            placeholder={placeholder}
            {...register(id as keyof FormValues)}
            className={`h-11 ${error ? 'border-destructive' : ''}`}
         />

         <a
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-pink-200 hover:underline"
         >
            <Image src={image} alt='' width={15} height={15} />
            Get your {label.split(' ')[0]} API Key
         </a>

         {error && (
            <p className="text-sm font-medium text-destructive flex items-center gap-2">
               <span className="w-1 h-1 bg-destructive rounded-full" />
               {error.message}
            </p>
         )}
      </div>
   </div>
);
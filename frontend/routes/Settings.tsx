import APIKeyForm from '@/frontend/components/APIKeyForm';
import { Link, useSearchParams } from 'react-router';
import { buttonVariants } from '../components/ui/button';
import { ArrowLeftIcon } from 'lucide-react';

export default function Settings() {
   const [searchParams] = useSearchParams();
   const chatId = searchParams.get('from');

   return (
      <APIKeyForm />
   );
}
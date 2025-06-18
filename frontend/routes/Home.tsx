import React from 'react'
import Chat from '../components/Chat'
import { v4 } from 'uuid'
export default function Home() {
   const threadId = v4();
   console.log("redirecting from home");

   return (
      <Chat key={threadId} threadId={threadId} initialMessages={[]} />
   )
}


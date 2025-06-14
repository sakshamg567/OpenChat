import React from 'react'
import Chat from '../components/Chat'
import { v4 } from 'uuid'
export default function Home() {
   return (
      <Chat threadId={v4()} initialMessages={[]} />
   )
}


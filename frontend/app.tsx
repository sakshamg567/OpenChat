import { BrowserRouter, Route, Routes } from 'react-router';
import ChatLayout from './layout';
import Home from './routes/Home';
import Index from './routes/Index';
import Thread from './routes/Thread';
import Settings from './routes/Settings';

export default function App() {
   return (
      <BrowserRouter>
         <Routes>
            <Route path="/" element={<Index />} />
            <Route path="chat" element={<ChatLayout />}>
               <Route index element={<Home />} />
               <Route path=":id" element={<Thread />} />
            </Route>
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<p> Not found </p>} />
         </Routes>
      </BrowserRouter>
   );
}

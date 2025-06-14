import { BrowserRouter, Route, Routes } from 'react-router';
import Home from './routes/Home';
import Index from './routes/Index';
import Thread from './routes/Thread';
import Layout from './layout';

export default function App() {
   return (
      <BrowserRouter>
         <Routes>
            <Route path="/" element={<Layout />}>
               <Route index element={<Home />} />
               <Route path="/chat/:id" element={<Thread />} />
            </Route>
            <Route path="*" element={<p> Not found </p>} />
         </Routes>
      </BrowserRouter>
   );
}
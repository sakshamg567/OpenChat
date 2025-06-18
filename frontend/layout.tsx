import { Outlet } from "react-router";
import { SidebarProvider } from "./components/ui/sidebar";
import AppSidebar from "./components/app-sidebar";
// import { AppSidebar } from "./components/app-sidebar";
// import { SidebarProvider } from "./components/ui/sidebar";

export default function Layout() {
   return (
      <SidebarProvider
         style={
            {
               "--sidebar-width": "calc(var(--spacing) * 72)",
               "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties
         }
      >
         <div className="flex h-screen w-full">
            <AppSidebar />
            <main className="flex-1 overflow-hidden">
               <Outlet />
            </main>
         </div>
      </SidebarProvider>
   )
}


import { Outlet } from "react-router";
// import { AppSidebar } from "./components/app-sidebar";
// import { SidebarProvider } from "./components/ui/sidebar";

export default function Layout() {
   return (
      <div className="flex-1 relative">
         <Outlet />
      </div>
   )
}


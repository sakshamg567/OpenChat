import { SidebarTrigger } from "@/frontend/components/ui/sidebar"

export function SiteHeader() {
  return (
    <div className="items-center w-fit gap-1 px-4 lg:gap-2 lg:px-6">
      <SidebarTrigger className="-ml-1" />
    </div>
  )
}

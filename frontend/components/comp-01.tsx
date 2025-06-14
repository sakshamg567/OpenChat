import { Input } from "@/frontend/components/ui/input"
import { Search } from "lucide-react"

export default function Component() {
  return (
    <div className="flex flex-row items-center border-b">
      <Search className="h-5" />
      <div className="*:not-first:mt-2">
        <Input placeholder="Search your Threads..." type="search" className="border-0 focus-visible:ring-0 focus:ring-0 text-white placeholder:text-[#80717B]" />
      </div>
    </div>
  )
}

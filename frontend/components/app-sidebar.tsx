"use client"

import * as React from "react"
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"

import { NavDocuments } from "@/frontend/components/nav-documents"
import { NavMain } from "@/frontend/components/nav-main"
import { NavSecondary } from "@/frontend/components/nav-secondary"
import { NavUser } from "@/frontend/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/frontend/components/ui/sidebar"
import Link from "next/link"
import { Input } from "./ui/input"
import Component from "./comp-01"



export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href={"/"}>
              T4.chat
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Component />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>

      </SidebarContent>
      {/* <SidebarFooter> */}
      {/* <NavUser user={data.user} /> */}
      {/* </SidebarFooter> */}
    </Sidebar>
  )
}

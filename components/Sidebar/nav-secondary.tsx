import React from "react"
import { type LucideIcon } from "lucide-react"

import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuBadge,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavSecondary({
    items,
    ...props
  }: {
    items: {
      title: string
      url: string
      icon: LucideIcon
      badge?: React.ReactNode
    }[]
  } & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
    return (
      <SidebarGroup {...props} className="text-[#383838]">
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a
                    href={item.url}
                    className="flex items-center gap-2 hover:bg-[#F3F6FF] text-[#383838] hover:text-[#0264FA] rounded-md px-2 py-1 transition-colors"
                  >
                    <item.icon className="text-[#383838]" />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
                {item.badge && (
                  <SidebarMenuBadge className="bg-[#EAECED] text-[#383838]">
                    {item.badge}
                  </SidebarMenuBadge>
                )}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    )
  }

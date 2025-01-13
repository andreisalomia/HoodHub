"use client";

import { type LucideIcon } from "lucide-react";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";

export function NavMain({
  items,
}: {
  items: { title: string; url: string; icon: LucideIcon; isActive?: boolean }[];
}) {
  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild isActive={item.isActive}>
            <a
              href={item.url}
              className={`flex gap-3 items-center rounded-lg p-2 ${
                item.isActive ? "bg-[#0264FA] text-white" : "hover:bg-[#EAEDED]"
              }`}
            >
              <item.icon className={item.isActive ? "text-white" : "text-[#383838]"} />
              <span>{item.title}</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}

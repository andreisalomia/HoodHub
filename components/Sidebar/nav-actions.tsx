"use client";

import * as React from "react";
import { MoreHorizontal, Star, Settings2, FileText, Copy, CornerUpRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sidebar, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";

const data = [
  [{ label: "Customize Page", icon: Settings2 }, { label: "Turn into wiki", icon: FileText }],
  [{ label: "Copy Link", icon: Copy }, { label: "Move to", icon: CornerUpRight }, { label: "Move to Trash", icon: Trash2 }],
];

export function NavActions() {
  return (
    <div className="flex items-center gap-2 text-sm">
      <Button variant="ghost" size="icon" className="text-[#383838] hover:text-[#0264FA]">
        <Star />
      </Button>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="hover:bg-[#EAEDED]">
            <MoreHorizontal />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="p-0 bg-white shadow-md border border-[#EAEDED]">
          <Sidebar collapsible="none">
            <SidebarContent>
              {data.map((group, index) => (
                <SidebarMenu key={index} className="border-b last:border-none border-[#EAEDED]">
                  {group.map((item) => (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton>
                        <item.icon className="text-[#383838] mr-2" />
                        {item.label}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              ))}
            </SidebarContent>
          </Sidebar>
        </PopoverContent>
      </Popover>
    </div>
  );
}

"use client"

import * as React from "react"
import {
    AudioWaveform,
    Blocks,
    Calendar,
    Command,
    Home,
    icons,
    Inbox,
    MessageCircleQuestion,
    Search,
    Settings2,
    Sparkles,
    Users,
    Trash2,
} from "lucide-react"
import HoodHubLogo from "@/components/hoodhub-logo"

import { NavYourCommunities } from "@/components/Sidebar/nav-yourcommunities"
import { NavMain } from "@/components/Sidebar/nav-main"
import { NavSecondary } from "@/components/Sidebar/nav-secondary"
import { NavUser } from "@/components/Sidebar/nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarRail,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarFooter,
} from "@/components/ui/sidebar"
import { createClient } from "@/utils/supabase/client"
import { usePathname } from 'next/navigation'

// This is sample data.
const sampleData = {
    navSecondary: [
        {
            title: "Help",
            url: "/dashboard/help",
            icon: MessageCircleQuestion,
        },
    ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const [user, setUser] = React.useState<{ name: string; email: string, isAdmin: boolean } | null>(null);
    const pathname = usePathname();
    const [active, setActive] = React.useState(pathname)
    React.useEffect(() => {
        const fetchUser = async () => {
            const supabase = createClient()
            const { data, error } = await supabase.auth.getUser()

            console.log("data", data);

            if (error) {
                console.error("Error fetching user:", error)
                return
            }

            if (data.user) {
                const { data: userData, error: userError } = await supabase
                    .from("users")
                    .select("username, isAdmin")
                    .eq("id", data.user.id)
                    .single()

                if (userError) {
                    console.error("Error fetching user data:", userError)
                    return
                }

                setUser({ name: userData.username, email: data.user.email ?? "", isAdmin: userData.isAdmin })
            }
        }

        fetchUser()
    }, [])

    return (
        <Sidebar className="border-r-0" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="/dashboard">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                                    <HoodHubLogo />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">HoodHub</span>
                                    <span className="truncate text-xs">{user?.isAdmin ? "Administrator" : "Resident"}</span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                <SidebarMenu>
                    <SidebarMenuItem key="Home">
                        <SidebarMenuButton asChild isActive={active === "/dashboard"} onClick={() => setActive("/dashboard")}>
                            <a href="/dashboard">
                                <Home />
                                <span>Home</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem key="Communities">
                        <SidebarMenuButton asChild isActive={active === "/dashboard/communities"} onClick={() => setActive("/dashboard/communities")}>
                            <a href="/dashboard/communities">
                                <Users />
                                <span>Communities</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem key="Events">
                        <SidebarMenuButton asChild isActive={active === "/dashboard/events"} onClick={() => setActive("/dashboard/events")}>
                            <a href="/dashboard/events">
                                <Calendar />
                                <span>Events</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent className="flex flex-col justify-between flex-1">
                <NavYourCommunities active={active} setActive={setActive} />
                <NavSecondary items={sampleData.navSecondary} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={user ?? { name: "", email: "" }} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}

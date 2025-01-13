"use client"

import {
    ArrowUpRight,
    Link,
    MoreHorizontal,
    StarOff,
    Trash2,
    Plus,
} from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    useSidebar,
} from "@/components/ui/sidebar"

import { ChevronRight, type LucideIcon } from "lucide-react"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { createClient } from "@/utils/supabase/client"
import * as React from "react"

interface NavYourCommunitiesProps {
    active: string;
    setActive: (active: string) => void;
}

export function NavYourCommunities({ active, setActive }: NavYourCommunitiesProps) {
    const { isMobile } = useSidebar()
    const [user, setUser] = React.useState<{ id: string; isAdmin: boolean; communities: string[] } | null>(null)
    const [yourCommunities, setYourCommunities] = React.useState<
        { name: string; id: string; url: string; emoji: string; isActive: boolean }[]
    >([])

    React.useEffect(() => {
        const fetchUser = async () => {
            const supabase = createClient()
            const { data, error } = await supabase.auth.getUser()

            if (error) {
                console.error("Error fetching user:", error)
                return
            }

            if (data.user) {
                const { data: userData, error: userError } = await supabase
                    .from("users")
                    .select("id, isAdmin, communities")
                    .eq("id", data.user.id)
                    .single()

                if (userError) {
                    console.error("Error fetching user data:", userError)
                    return
                }

                setUser({ id: userData.id, isAdmin: userData.isAdmin, communities: userData.communities })
            }
        }

        fetchUser()
    }, [])

    React.useEffect(() => {
        const fetchCommunities = async () => {
            if (!user || !user.communities.length) return

            const supabase = createClient()
            const communitiesData = []

            for (const communityId of user.communities) {
                const { data, error } = await supabase
                    .from("communities")
                    .select("name, id, icon")
                    .eq("id", communityId)
                    .single()

                if (error) {
                    console.error(`Error fetching community with id ${communityId}:`, error)
                    continue
                }

                communitiesData.push({
                    name: data.name,
                    url: `/dashboard/communities/${data.id}`,
                    id: data.id,
                    emoji: data.icon,
                    isActive: false,
                })
            }

            setYourCommunities(communitiesData)
        }

        fetchCommunities()
    }, [user])

    console.log("yourCommunities", yourCommunities)

    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>Your Communities</SidebarGroupLabel>
            <SidebarMenu>
                {yourCommunities.map((item) => (
                    <Collapsible key={item.name} asChild defaultOpen={active === `/dashboard/communities/${item.id}/chat` || active === `/dashboard/communities/${item.id}/threads`}>
                        <SidebarMenuItem key={item.name}>
                            <SidebarMenuButton asChild isActive={active === item.url} onClick={() => setActive(item.url)}>
                                <a href={item.url} title={item.name}>
                                    <span>{item.emoji}</span>
                                    <span>{item.name}</span>
                                </a>
                            </SidebarMenuButton>
                            <CollapsibleTrigger asChild>
                                <SidebarMenuAction className="data-[state=open]:rotate-90">
                                    <ChevronRight />
                                    <span className="sr-only">Toggle</span>
                                </SidebarMenuAction>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <SidebarMenuSub>
                                    <SidebarMenuSubItem key={item.id + "Chat"}>
                                        <SidebarMenuSubButton asChild isActive={active === `/dashboard/communities/${item.id}/chat`} onClick={() => setActive(`/dashboard/communities/${item.id}/chat`)}>
                                            <a href={"/dashboard/communities/" + item.id + "/chat"}>
                                                <span>Chat</span>
                                            </a>
                                        </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                    <SidebarMenuSubItem key={item.id + "Threads"}>
                                        <SidebarMenuSubButton asChild isActive={active === `/dashboard/communities/${item.id}/threads`} onClick={() => setActive(`/dashboard/communities/${item.id}/threads`)}>
                                            <a href={"/dashboard/communities/" + item.id + "/threads"}>
                                                <span>Threads</span>
                                            </a>
                                        </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                </SidebarMenuSub>
                            </CollapsibleContent>
                        </SidebarMenuItem>
                    </Collapsible>
                ))}
                {user?.isAdmin && (
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <a href="/dashboard/communities/new" title="Create a new community">
                                <Plus />
                                <span>Create a new community</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                )}
            </SidebarMenu>
        </SidebarGroup>
    )
}
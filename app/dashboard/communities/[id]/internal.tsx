'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from 'lucide-react'
import { notFound } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import Link from 'next/link'
import { Users, MapPin, MessageCircle, GitCommitHorizontal } from 'lucide-react'
import Location from "./location"

interface CommunityPageProps {
    id: string
}

async function getCommunityData(id: string) {
    console.log("id", id)
    const supabase = createClient()
    const { data, error } = await supabase
        .from('communities')
        .select('name, icon, created_at, description, members, country, city, street, building, owner')
        .eq('id', id)
        .single()

    if (error) {
        console.error("Error fetching community data:", error)
        return null
    }

    const { data: ownerData, error: ownerError } = await supabase
        .from("users")
        .select("first_name, last_name")
        .eq("id", data.owner)
        .single()

    if (ownerError) {
        console.error("Error fetching owner data:", ownerError)
        return null
    }

    data.owner = ownerData.first_name + " " + ownerData.last_name

    // for each uuid inside members, find his first_name last_name and username inside users table
    const members = data.members

    for (let i = 0; i < members.length; i++) {
        const { data: memberData, error: memberError } = await supabase
            .from("users")
            .select("first_name, last_name, username")
            .eq("id", members[i])
            .single()

        if (memberError) {
            console.error("Error fetching member data:", memberError)
            return null
        }

        members[i] = { fullName: memberData.first_name + " " + memberData.last_name, username: memberData.username, avatar: "/placeholder.svg?height=32&width=32" }
    }


    const resultData = {
        name: data.name, icon: data.icon, created_at: data.created_at, description: data.description, membersList: members, country: data.country, city: data.city, street: data.street, building: data.building, owner: data.owner
    }

    return resultData
}

async function getMessageCommunityId(id: string) {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('communities')
        .select('messages_communities')
        .eq('id', id)
        .single()

    if (error) {
        console.error("Error fetching community data:", error)
        return null
    }

    return data
}


const communityData = {
    name: "TechEnthusiasts",
    description: "A vibrant community for tech lovers to share ideas, discuss latest trends, and collaborate on projects.",
    members: 1500,
    location: "Global (Online)",
    memberList: [
        { fullName: "Alice Johnson", username: "@alice_j", avatar: "/placeholder.svg?height=32&width=32" },
        { fullName: "Bob Smith", username: "@bobsmith", avatar: "/placeholder.svg?height=32&width=32" },
        { fullName: "Charlie Brown", username: "@charlieb", avatar: "/placeholder.svg?height=32&width=32" },
        { fullName: "Diana Prince", username: "@wonder_di", avatar: "/placeholder.svg?height=32&width=32" },
        { fullName: "Ethan Hunt", username: "@mission_ethan", avatar: "/placeholder.svg?height=32&width=32" },
        { fullName: "Fiona Gallagher", username: "@fiona_g", avatar: "/placeholder.svg?height=32&width=32" },
        { fullName: "George Costanza", username: "@georgiec", avatar: "/placeholder.svg?height=32&width=32" },
        { fullName: "Hannah Montana", username: "@hannahm", avatar: "/placeholder.svg?height=32&width=32" },
        { fullName: "Ian Malcolm", username: "@chaos_ian", avatar: "/placeholder.svg?height=32&width=32" },
        { fullName: "Julia Child", username: "@chef_julia", avatar: "/placeholder.svg?height=32&width=32" },
        // ... add more members as needed
    ]
}


export default function Internal(props: CommunityPageProps) {
    const { id } = props
    const [communityData, setCommunityData] = useState<{ name: string, icon: string, created_at: string, description: string, membersList: any[], country: string, city: string, street: string, building: string, owner: string } | null>(null)
    const [user, setUser] = React.useState<{ id: string; isAdmin: boolean, username: string, first_name: string, last_name: string } | null>(null)
    const [messagesCommunityId, setMessagesCommunityId] = useState<string | null>(null)
    const [latitude, setLatitude] = useState<number>()
    const [longitude, setLongitude] = useState<number>()

    useEffect(() => {
        async function fetchCommunityData() {
            const data = await getCommunityData(id)
            if (data) {
                setCommunityData(data)
                const query = `${data.street}, ${data.city}, ${data.country}`;
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
                );

                console.log("query", query)

                const dataT = await response.json();
                if (dataT && dataT.length > 0) {
                    setLatitude(dataT[0].lat);
                    setLongitude(dataT[0].lon);
                }
            } else {
                notFound()
            }
        }
        async function fetchMessagesCommunityId() {
            const data = await getMessageCommunityId(id)
            if (data) {
                setMessagesCommunityId(data.messages_communities)
            } else {
                notFound()
            }
        }
        async function getUser() {
            const supabase = createClient()
            const { data, error } = await supabase.auth.getUser()

            if (error) {
                console.error("Error fetching user:", error)
                return
            }

            setUser({ id: data.user.id, isAdmin: false, username: "", first_name: data.user.user_metadata.full_name, last_name: "" })
            const { data: userData, error: userError } = await supabase
                .from("users")
                .select("id, isAdmin, username, first_name, last_name")
                .eq("id", data.user.id)
                .single()

            if (userError) {
                console.error("Error fetching user data:", userError)
                return
            }

            setUser({ id: userData.id, isAdmin: userData.isAdmin, username: userData.username, first_name: userData.first_name, last_name: userData.last_name })

        }


        fetchCommunityData()
        fetchMessagesCommunityId()
        getUser()

    }, [id])

    if (!communityData) {
        return <div>Loading...</div>
    }

    console.log("latitude", latitude)
    console.log("longitude", longitude)

    return (
        <div className="flex min-h-screen w-full">
            <main className="flex-1 p-8 bg-gradient-to-br from-blue-100 to-white">
                <h1 className="text-4xl font-bold text-blue-600 mb-4">{communityData.name}</h1>
                <p className="text-xl text-gray-600 mb-8">{communityData.description}</p>

                <div className="flex items-center space-x-8 mb-8">
                    <div className="flex items-center">
                        <Users className="w-6 h-6 mr-2 text-blue-500" />
                        <span className="text-lg font-semibold">{communityData.membersList.length} Members</span>
                    </div>
                    <div className="flex items-center">
                        <MapPin className="w-6 h-6 mr-2 text-blue-500" />
                        <span className="text-lg font-semibold">{communityData.country + ", " + communityData.city + ", " + communityData.street + ", " + communityData.building}</span>
                    </div>
                </div>

                <div className="flex space-x-4 mb-8">
                    <Button asChild className="bg-blue-500 hover:bg-blue-600">
                        <Link href={"/dashboard/communities/" + id + "/chat"}>
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Chat
                        </Link>
                    </Button>
                    <Button asChild variant="outline" className="border-blue-500 text-blue-500 hover:bg-blue-50">
                        <Link href={"/dashboard/communities/" + id + "/threads"}>
                            <GitCommitHorizontal className="w-4 h-4 mr-2" />
                            Threads
                        </Link>
                    </Button>
                </div>
                <Location latitude={latitude ?? 0} longitude={longitude ?? 0} />
            </main>

            <aside className="w-96 bg-white shadow-lg p-6">
                <h2 className="text-2xl font-semibold text-blue-600 mb-4">Members</h2>
                <ScrollArea className="h-[calc(100vh-8rem)]">
                    <ul className="space-y-4">
                        {communityData.membersList.map((member, index) => (
                            <li key={index} className="flex items-center space-x-4 p-2 hover:bg-blue-50 rounded-lg transition-colors">
                                <Avatar>
                                    <AvatarImage src={member.avatar} alt={member.fullName} />
                                    <AvatarFallback>{member.fullName.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold text-gray-800">{member.fullName}</p>
                                    <p className="text-sm text-gray-500">{member.username}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </ScrollArea>
            </aside>
        </div>
    )
}
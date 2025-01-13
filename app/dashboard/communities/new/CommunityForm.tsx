'use client'

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { createClient } from "@/utils/supabase/client"
import { validate as validateUUID } from "uuid"
import { EmojiBrowser } from "./emoji-browser"

export default function CommunityForm() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState<{
        name: string;
        description: string;
        country: string;
        city: string;
        street: string;
        building: string;
        icon: string;
        owner: string;
        messages_communities: string;
        members: string[];
    }>({
        name: "",
        description: "",
        country: "",
        city: "",
        street: "",
        building: "",
        icon: "",
        owner: "",
        messages_communities: "",
        members: []
    })
    const [userCommunities, setUserCommunities] = useState<string[]>([])

    useEffect(() => {
        const fetchUser = async () => {
            const supabase = createClient()
            const { data, error } = await supabase.auth.getUser()

            if (error) {
                console.error("Error fetching user:", error)
                return
            }

            if (data.user) {
                if (validateUUID(data.user.id)) {
                    setFormData(prevData => ({
                        ...prevData,
                        owner: data.user.id,
                        members: [...prevData.members, data.user.id]
                    }));
                } else {
                    console.error("Invalid UUID:", data.user.id);
                }
            }
        }

        fetchUser()
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }))
    }

    const handleEmojiSelect = (icon: string) => {
        setFormData((prevData) => ({
            ...prevData,
            icon: icon,
        }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const supabase = createClient()

            const { data: messagesData, error: messagesError } = await supabase
                .from('messages_communities')
                .insert(
                    {
                        name: formData.name,
                        messages: []
                    })
                .select('id')

            if (messagesError) {
                throw messagesError
            }

            // add community id to formData
            formData.messages_communities = messagesData[0].id;


            const { data: communityData, error: communityError } = await supabase
                .from('communities')
                .insert([formData])
                .select('id') // Select the id of the inserted row

            if (communityError) {
                throw communityError
            }

            const communityId = communityData[0].id;

            const { data: dd, error: ddd } = await supabase
                .from('users')
                .select('communities')
                .eq('id', formData.owner)

            if (ddd) {
                throw ddd
            }

            setUserCommunities(dd[0].communities)

            const v = dd[0].communities
            v.push(communityId)

            console.log("v", v)

            const { data: userCommunitiesData, error: userCommunitiesError } = await supabase
                .from('users')
                .update({ communities: v })
                .eq('id', formData.owner)

            if (userCommunitiesError) {
                throw userCommunitiesError
            }

            router.push(`/dashboard/communities/${communityId}`)
        } catch (error) {
            console.error("Error creating community:", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} required />

            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required />

            <Label htmlFor="country">Country</Label>
            <Input id="country" name="country" value={formData.country} onChange={handleChange} required />

            <Label htmlFor="city">City</Label>
            <Input id="city" name="city" value={formData.city} onChange={handleChange} required />

            <Label htmlFor="street">Street</Label>
            <Input id="street" name="street" value={formData.street} onChange={handleChange} required />

            <Label htmlFor="building">Building</Label>
            <Input id="building" name="building" value={formData.building} onChange={handleChange} required />

            <div>
                <Label htmlFor="emoji">Emoji</Label>
                <div className="flex items-center space-x-2">
                    <Input
                        id="emoji"
                        name="emoji"
                        value={formData.icon}
                        onChange={handleChange}
                        required
                        readOnly
                    />
                    <EmojiBrowser onSelectEmoji={handleEmojiSelect} />
                </div>
            </div>

            <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Loading...' : 'Create Community'}
            </Button>
        </form>
    )
}
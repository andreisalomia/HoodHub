import { createClient } from "@/utils/supabase/client"
import { notFound } from "next/navigation"
import ChatPage from './internal'

interface ChatPageProps {
    params: {
        id: string
    }
}

async function getCommunityData(id: string) {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('communities')
        .select('name, icon')
        .eq('id', id)
        .single()

    if (error) {
        console.error("Error fetching community data:", error)
        return null
    }

    return data
}

export default async function Page({ params }: ChatPageProps) {
    const communityData = await getCommunityData(params.id)
    if (!communityData) {
        notFound()
    }

    return <ChatPage id={params.id} />
}
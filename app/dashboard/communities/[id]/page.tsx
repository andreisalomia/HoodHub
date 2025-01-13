import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CommunityHeader } from './community-header'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import Internal from './internal'

interface CommunityPageProps {
    params: { id: string }
}


async function getCommunityData(id: string) {
    const supabase = createClient()
    console.log("id", id)
    const { data, error } = await supabase
        .from('communities')
        .select('name, description, icon')
        .eq('id', id)
        .single()

    if (error) {
        console.error("Error fetching community data:", error)
        return null
    }

    return data
}

export default async function CommunityPage({ params }: CommunityPageProps) {
    const communityData = await getCommunityData(params.id)

    if (!communityData) {
        notFound()
    }

    return (
        <div className="flex flex-col w-full">
            <Internal id={params.id} />
        </div>
    )
}
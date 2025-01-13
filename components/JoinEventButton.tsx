'use client'

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";

interface JoinEventButtonProps {
    eventId: number;
    userId: string;
    isRegistered: boolean;
}

export default function JoinEventButton({ eventId, userId, isRegistered: initialIsRegistered }: JoinEventButtonProps) {
    const [isRegistered, setIsRegistered] = useState(initialIsRegistered);
    const [isLoading, setIsLoading] = useState(false);
    const supabase = createClient();

    const handleJoin = async () => {
        if (isRegistered) return;

        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('events')
                .select('participants')
                .eq('id', eventId)
                .single();

            if (error) throw error;

            const currentParticipants = data.participants || [];
            
            if (!currentParticipants.includes(userId)) {
                const { error: updateError } = await supabase
                    .from('events')
                    .update({ participants: [...currentParticipants, userId] })
                    .eq('id', eventId);

                if (updateError) throw updateError;
                setIsRegistered(true);
            }
        } catch (error) {
            console.error('Error joining event:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button 
            onClick={handleJoin} 
            disabled={isRegistered || isLoading}
            className="w-full text-lg py-6 bg-[#0264FA] text-[#FFFFFF] hover:bg-[#0057D4] transition duration-200"
            size="lg"
        >
            {isRegistered ? 'Already Joined' : (isLoading ? 'Joining...' : 'Join Event')}
        </Button>
    );
}


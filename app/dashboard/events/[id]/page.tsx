import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { CalendarIcon, UsersIcon, MapPinIcon, ClockIcon, InfoIcon, UserIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import JoinEventButton from "@/components/JoinEventButton";
import DeleteEventButton from "@/components/DeleteEventButton";
import { redirect } from "next/navigation";
import Link from 'next/link';

export default async function EventPage({ params }: { params: { id: string } }) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    const { id: eventId } = await params;

    if (!user) {
        return redirect("/sign-in");
    }

    const { data: event, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", eventId)
        .single();

    if (error || !event) {
        notFound();
    }

    const { data: organizer } = await supabase
        .from("users")
        .select("id, username")
        .eq("id", event.created_by)
        .single();

    const participants = event.participants || [];
    const isUserRegistered = participants.includes(user.id);
    const isEventCreator = user.id === event.created_by;

    const startDate = new Date(event.start_date);
    const endDate = new Date(event.end_date);
    const duration = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60));

    return (
        <div className="container mx-auto p-8 bg-gradient-to-br min-h-screen">
            <div className="mb-6 flex justify-between items-center">
                <Link href="/dashboard/events" className="inline-flex items-center px-4 py-2 text-blue-600 border-blue-600 hover:bg-blue-50">
                    ← Back to list
                </Link>
                {isEventCreator && (
                    <DeleteEventButton eventId={event.id} />
                )}
            </div>
            <h1 className="text-4xl font-bold mb-6 text-center">
                {event.title}
            </h1>

            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                    <div className="flex flex-col items-center text-center mb-4">
                        <UserIcon className="w-6 h-6 text-blue-500 mb-2" />
                        <p className="font-semibold">Organizer</p>
                        <div className="flex items-center space-x-2 mt-2">
                            <Avatar>
                                <AvatarImage src="/placeholder-avatar.png" alt={organizer?.username} />
                                <AvatarFallback>{organizer?.username?.charAt(0) || 'O'}</AvatarFallback>
                            </Avatar>
                            <span>{organizer?.username || 'Unknown Organizer'}</span>
                        </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col items-center text-center">
                            <CalendarIcon className="w-6 h-6 text-blue-500 mb-2" />
                            <p className="font-semibold">Date & Time</p>
                            <p>{startDate.toLocaleDateString()} at {startDate.toLocaleTimeString()}</p>
                        </div>

                        <div className="flex flex-col items-center text-center">
                            <MapPinIcon className="w-6 h-6 text-blue-500 mb-2" />
                            <p className="font-semibold">Location</p>
                            <p>{event.street}</p>
                        </div>

                        <div className="flex flex-col items-center text-center">
                            <ClockIcon className="w-6 h-6 text-blue-500 mb-2" />
                            <p className="font-semibold">Duration</p>
                            <p>{duration} hours</p>
                        </div>

                        <div className="flex flex-col items-center text-center">
                            <UsersIcon className="w-6 h-6 text-blue-500 mb-2" />
                            <p className="font-semibold">Participants</p>
                            <p>{participants.length} registered</p>
                        </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="text-center">
                        <h2 className="text-2xl font-semibold mb-4 flex items-center justify-center">
                            <InfoIcon className="w-6 h-6 mr-2 text-blue-500" />
                            Description
                        </h2>
                        <p className="text-lg leading-relaxed">{event.description}</p>
                    </div>
                </div>

                <div className="p-6">
                    <JoinEventButton
                        eventId={event.id}
                        userId={user.id}
                        isRegistered={isUserRegistered}
                    />
                </div>
            </div>
        </div>
    );
}


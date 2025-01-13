"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AddEventButton from "@/components/AddEventButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from '@/components/ui/skeleton'
import { CalendarIcon } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { Users } from "lucide-react";

interface Event {
  id: number;
  title: string;
  description: string;
  participants: number[];
  start_date: string;
  end_date: string;
}

export default function EventList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase.from("events").select("*");
        if (error) throw error;

        setEvents(data || []);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleAddEvent = (newEvent: Event) => {
    setEvents((prevEvents) => [...prevEvents, newEvent]);
    router.refresh();
  };

  return (
    <div className="flex-1 w-full flex flex-col gap-8 bg-gradient-to-b px-6 py-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">Local Events</h1>
          <p className="text-gray-600 mt-2">Discover and join exciting happenings in your area</p>
        </div>
        <AddEventButton onAddEvent={handleAddEvent} />
      </div>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-8 w-1/3" />
              </CardContent>
            </Card>
          ))
        ) : events.length > 0 ? (
          events.map((event) => (
            <Card
              key={event.id}
              className="bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-blue-600">
                  {event.title}
                </CardTitle>
                <CardDescription className="text-gray-600 line-clamp-2">
                  {event.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-2 text-sm text-gray-700">
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="w-4 h-4 text-blue-500" />
                    <span>
                      {new Date(event.start_date).toLocaleDateString()} - {new Date(event.end_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span>{event.participants.length} participants</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/dashboard/events/${event.id}`)}
                  className="mt-4 w-full text-blue-600 border-blue-600 hover:bg-blue-50"
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="col-span-full p-6 bg-white shadow-sm">
            <p className="text-center text-gray-600">No events found. Be the first to create an event!</p>
          </Card>
        )}
      </div>
    </div>
  )
}
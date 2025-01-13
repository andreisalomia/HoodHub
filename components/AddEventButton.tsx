"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { addEventAction } from "@/app/actions";
import { createClient } from "@/utils/supabase/client";

interface AddEventButtonProps {
  onAddEvent: (newEvent: any) => void;
}

export default function AddEventButton({ onAddEvent }: AddEventButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [address, setAddress] = useState({ street: "", city: "", country: "" });
  const [user, setUser] = useState<{ id: string; events_count: number } | null>(null)
  const supabase = createClient();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
  });

  const fetchCoordinates = async () => {
    const query = `${address.street}, ${address.city}, ${address.country}`;
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
    );

    const data = await response.json();
    if (data && data.length > 0) {
      setLatitude(data[0].lat);
      setLongitude(data[0].lon);
    }
  };

  useEffect(() => {
    if (address.street && address.city && address.country) {
      fetchCoordinates();
    }
  }, [address]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const newEvent = {
      id: Date.now(),
      title: formData.title,
      description: formData.description,
      start_date: formData.start_date,
      end_date: formData.end_date,
      latitude,
      longitude,
      street: address.street
    };

    try {
      const formDataToSend = new FormData();
      Object.entries(newEvent).forEach(([key, value]) => {
        formDataToSend.append(key, value.toString());
      });

      await addEventAction(formDataToSend);

      onAddEvent(newEvent);
    } catch (error) {
      console.error("Error adding event:", error);
    } finally {
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Trigger Button */}
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-[#0264FA] border-[#0264FA] hover:bg-[#0264FA] hover:text-white transition"
        >
          Create New Event
        </Button>
      </DialogTrigger>

      {/* Dialog Content */}
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-[#F3F6FF] border border-[#EAEDED]">
        <DialogHeader>
          <DialogTitle className="text-[#0264FA] font-bold">Create New Event</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-[#0264FA]">Title</Label>
            <Input
              id="title"
              className="bg-white border-[#EAEDED] focus:ring-2 focus:ring-[#0264FA] focus:border-[#0264FA] transition"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-[#0264FA]">Description</Label>
            <Textarea
              id="description"
              className="bg-white border-[#EAEDED] focus:ring-2 focus:ring-[#0264FA] focus:border-[#0264FA] transition"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_date" className="text-[#0264FA]">Start Date</Label>
              <Input
                id="start_date"
                type="date"
                className="bg-white border-[#EAEDED] focus:ring-2 focus:ring-[#0264FA] focus:border-[#0264FA] transition"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="end_date" className="text-[#0264FA]">End Date</Label>
              <Input
                id="end_date"
                type="date"
                className="bg-white border-[#EAEDED] focus:ring-2 focus:ring-[#0264FA] focus:border-[#0264FA] transition"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="street" className="text-[#0264FA]">Street</Label>
            <Input
              id="street"
              className="bg-white border-[#EAEDED] focus:ring-2 focus:ring-[#0264FA] focus:border-[#0264FA] transition"
              onChange={(e) => setAddress({ ...address, street: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city" className="text-[#0264FA]">City</Label>
              <Input
                id="city"
                className="bg-white border-[#EAEDED] focus:ring-2 focus:ring-[#0264FA] focus:border-[#0264FA] transition"
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="country" className="text-[#0264FA]">Country</Label>
              <Input
                id="country"
                className="bg-white border-[#EAEDED] focus:ring-2 focus:ring-[#0264FA] focus:border-[#0264FA] transition"
                onChange={(e) => setAddress({ ...address, country: e.target.value })}
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full text-white bg-[#0264FA] hover:bg-[#0248C5] transition"
          >
            Submit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

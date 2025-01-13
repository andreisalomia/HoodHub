"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users } from "lucide-react";

type User = {
  id: string;
  first_name: string;
  last_name: string;
  street: string;
  city: string;
  country: string;
  sector: string;
  username: string;
};

type Community = {
  id: string;
  name: string;
  members: string[];
};

type Event = {
  id: string;
  title: string;
  start_date: string;
  duration: number;
};

export default function AccountPage() {
  const supabase = createClient();
  const router = useRouter();

  const [user, setUser] = useState<User>({
    id: "",
    first_name: "",
    last_name: "",
    street: "",
    city: "",
    country: "",
    sector: "",
    username: "",
  });
  const [communities, setCommunities] = useState<Community[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

  // States for password update
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    fetchUserData();
    fetchUserCommunities();
    fetchUserEvents();
  }, []);

  const fetchUserData = async () => {
    const { data: authUser } = await supabase.auth.getUser();
    if (authUser.user) {
      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("id", authUser.user.id)
        .single();
      if (data) setUser(data);
    }
  };

  const fetchUserCommunities = async () => {
    const { data: authUser } = await supabase.auth.getUser();
    if (authUser.user) {
      const { data } = await supabase
        .from("users")
        .select("communities")
        .eq("id", authUser.user.id)
        .single();
      if (data && data.communities) {
        const { data: communitiesData } = await supabase
          .from("communities")
          .select("*")
          .in("id", data.communities);
        setCommunities(communitiesData || []);
      }
    }
  };

  const fetchUserEvents = async () => {
    const { data: authUser } = await supabase.auth.getUser();
    if (authUser.user) {
      const { data } = await supabase
        .from("events")
        .select("*")
        .contains("participants", [authUser.user.id]);
      setEvents(data || []);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async () => {
    const { error } = await supabase
      .from("users")
      .update({
        first_name: user.first_name,
        last_name: user.last_name,
        street: user.street,
        city: user.city,
        country: user.country,
        sector: user.sector,
      })
      .eq("id", user.id);

    if (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    } else {
      alert("Profile updated successfully!");
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      console.error("Password update error:", error.message);
      alert("Failed to update password.");
    } else {
      alert("Password updated successfully!");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  const handleViewEvent = (eventId: string) => {
    router.push(`/dashboard/events/${eventId}`);
  };

  return (
    <div className="bg-[#F3F6FF] min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <h1 className="text-4xl font-bold text-[#0264FA] text-center mb-6">
          Account Settings
        </h1>

        {/* Personal Information */}
        <Card className="shadow-md border border-[#EAEDED]">
          <CardHeader>
            <CardTitle className="text-[#0264FA] text-lg font-semibold">
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-[#383838]">Username</Label>
              <Input
                value={user.username}
                disabled
                className="bg-gray-100 text-gray-500 cursor-not-allowed border-[#EAEDED]"
              />
            </div>
            <div>
              <Label className="text-[#383838]">First Name</Label>
              <Input
                name="first_name"
                value={user.first_name}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label className="text-[#383838]">Last Name</Label>
              <Input
                name="last_name"
                value={user.last_name}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label className="text-[#383838]">Street</Label>
              <Input
                name="street"
                value={user.street}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label className="text-[#383838]">City</Label>
              <Input
                name="city"
                value={user.city}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label className="text-[#383838]">Country</Label>
              <Input
                name="country"
                value={user.country}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label className="text-[#383838]">Sector</Label>
              <Input
                name="sector"
                value={user.sector}
                onChange={handleInputChange}
              />
            </div>
          </CardContent>
          <div className="p-4 border-t border-[#EAEDED] text-right">
            <Button
              onClick={handleUpdateProfile}
              className="bg-[#0264FA] text-white hover:bg-[#0248C5] transition"
            >
              Save Changes
            </Button>
          </div>
        </Card>

        {/* Change Password Section */}
        <Card className="shadow-md border border-[#EAEDED]">
          <CardHeader>
            <CardTitle className="text-[#0264FA] text-lg font-semibold">
              Change Password
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-[#383838]">New Password</Label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div>
              <Label className="text-[#383838]">Confirm Password</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <Button
              onClick={handleUpdatePassword}
              className="bg-[#0264FA] text-white hover:bg-[#0248C5] transition"
            >
              Update Password
            </Button>
          </CardContent>
        </Card>

        {/* Communities and Events Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* My Communities */}
          <Card className="shadow-md border border-[#EAEDED]">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-[#0264FA]">My Communities</CardTitle>
              <Users className="text-[#383838]" />
            </CardHeader>
            <CardContent className="space-y-4">
              {communities.map((community) => (
                <div
                  key={community.id}
                  className="flex justify-between items-center"
                >
                  <p className="text-[#383838] font-medium">{community.name}</p>
                  <Button
                    variant="outline"
                    className="text-[#0264FA] border-[#0264FA] hover:bg-[#0264FA] hover:text-white"
                  >
                    View
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card className="shadow-md border border-[#EAEDED]">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-[#0264FA]">Upcoming Events</CardTitle>
              <Calendar className="text-[#383838]" />
            </CardHeader>
            <CardContent className="space-y-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="flex justify-between items-center"
                >
                  <p className="text-[#383838] font-medium">{event.title}</p>
                  <Button
                    variant="outline"
                    onClick={() => handleViewEvent(event.id)}
                    className="text-[#0264FA] border-[#0264FA] hover:bg-[#0264FA] hover:text-white"
                  >
                    View Event
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="p-4 text-right">
        <Button
          onClick={() => router.push("/dashboard")}
          className="bg-[#0264FA] text-white hover:bg-[#0248C5] transition"
        >
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
}

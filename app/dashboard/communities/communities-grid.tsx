"use client";

import { Building, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { joinCommunity } from "@/app/actions";
import { useState } from "react";

interface Community {
  id: string;
  name: string;
  description: string;
  city: string;
  members: string[];
  building: string;
}

interface CommunitiesGridProps {
  communities: Community[];
  userId: string;
}

export function CommunitiesGrid({ communities, userId }: CommunitiesGridProps) {
  const [joiningId, setJoiningId] = useState<string | null>(null);

  const handleJoin = async (communityId: string) => {
    try {
      setJoiningId(communityId);
      console.log("Joining community:", communityId);
      await joinCommunity(communityId);
    } catch (error) {
      console.error("Failed to join community:", error);
    } finally {
      setJoiningId(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {communities.map((community) => (
        <Card
          key={community.id}
          className="shadow-lg border-none hover:shadow-xl transition-shadow duration-300"
          style={{ backgroundColor: "#FFFFFF", color: "#383838" }}
        >
          <CardHeader>
            <CardTitle className="text-[#0264FA]">{community.name}</CardTitle>
            <CardDescription className="text-[#383838]">
              {community.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-3 text-sm text-[#383838]">
              <div className="flex items-center space-x-2">
                <Building className="h-5 w-5 text-[#0264FA]" />
                <span>
                  {community.building}, {community.city}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-[#0264FA]" />
                <span>{community.members.length} members</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-[#0264FA] text-[#FFFFFF] hover:bg-[#0057D4] transition duration-200"
              onClick={() => handleJoin(community.id)}
              disabled={
                joiningId === community.id ||
                community.members.includes(userId)
              }
            >
              {community.members.includes(userId)
                ? "Joined"
                : joiningId === community.id
                  ? "Joining..."
                  : "Join Community"}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

import { createClient } from "@/utils/supabase/server";
import { InfoIcon } from 'lucide-react';
import { redirect } from "next/navigation";
import React from "react";
import CommunityForm from "./CommunityForm";

export default async function DashboardPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/sign-in");
    }

    const { data: userData, error } = await supabase
        .from("users")
        .select("isAdmin")
        .eq("id", user.id)
        .single();

    if (error || !userData.isAdmin) {
        return redirect("/404");
    }

    return (
        <div className="flex-1 w-full flex flex-col gap-12 p-4 md:p-8">
            <div className="w-full">
                <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center mb-8">
                    <InfoIcon size="16" strokeWidth={2} />
                    This is a protected page that you can only see as an authenticated user
                </div>
            </div>
            <div className="max-w-2xl mx-auto w-full">
                <h1 className="text-2xl font-bold mb-6">Create a New Community</h1>
                <CommunityForm />
            </div>
        </div>
    );
}


"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache"

export async function joinCommunity(communityId: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error("Authentication error:", authError?.message);
    throw new Error("User not authenticated");
  }

  // Fetch current community members
  const { data: communityData, error: fetchCommunityError } = await supabase
    .from("communities")
    .select("members")
    .eq("id", communityId)
    .single();

  if (fetchCommunityError) {
    console.error("Error fetching community members:", fetchCommunityError.message);
    throw new Error("Failed to fetch community data");
  }

  const updatedMembers = [...(communityData.members || []), user.id];

  // Update the community with the new members array
  const { error: communityError } = await supabase
    .from("communities")
    .update({ members: updatedMembers })
    .eq("id", communityId);

  if (communityError) {
    console.error("Error updating community members:", communityError.message);
    throw new Error("Failed to update community members");
  }

  // Fetch current user communities
  const { data: userData, error: fetchUserError } = await supabase
    .from("users")
    .select("communities")
    .eq("id", user.id)
    .single();

  if (fetchUserError) {
    console.error("Error fetching user communities:", fetchUserError.message);
    throw new Error("Failed to fetch user data");
  }

  const updatedCommunities = [...(userData.communities || []), communityId];

  // Update the user with the new communities array
  const { error: userError } = await supabase
    .from("users")
    .update({ communities: updatedCommunities })
    .eq("id", user.id);

  if (userError) {
    console.error("Error updating user communities:", userError.message);
    throw new Error("Failed to update user communities");
  }

  revalidatePath("/communities");
  return { success: true };
}


export const addEventAction = async (formData: FormData) => {
  const supabase = await createClient();
  console.log("IN ADDEVENTACTION");

  // Extract fields dynamically (removed "participants")
  const fields = [
    "title",
    "description",
    "tags",
    "latitude",
    "longitude",
    "start_date",
    "end_date",
    "duration",
    "organizer_username",
    "capacity",
    "ticket_price",
    "building",
    "apartment",
    "street",
    "city",
    "country",
    "sector",
  ];

  const eventData: Record<string, any> = {};

  // Dynamically construct the eventData object
  fields.forEach((field) => {
    const value = formData.get(field)?.toString();
    if (value !== undefined && value !== "") {
      if (field === "tags") {
        eventData[field] = value.split(",").map((tag) => tag.trim()); // Split tags into an array
      } else if (
        ["latitude", "longitude", "capacity", "ticket_price", "duration", "apartment", "sector"].includes(field)
      ) {
        eventData[field] = parseFloat(value) || null; // Convert to numbers where applicable
      } else {
        eventData[field] = value;
      }
    }
  });

  // Required field validation
  if (!eventData.title || !eventData.description || !eventData.start_date || !eventData.end_date) {
    return encodedRedirect("error", "/events", "Title, description, start date, and end date are required fields.");
  }

  // Fetch the user auth
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError) {
    console.error("Error fetching user auth:", authError.message);
    return encodedRedirect("error", "/events", "Failed to add event.");
  }

  const { data: user, error: userError } = await supabase.from("users").select("events_count").eq("id", authData.user.id).single();

  if (userError) {
    console.error("Error fetching user data:", userError.message);
    return encodedRedirect("error", "/dashboard/events", "Failed to add event.");
  }

  // Increment the user's event count
  const { error: updateError } = await supabase
    .from("users")
    .update({ events_count: user.events_count + 1 })
    .eq("id", authData.user.id);

  if (updateError) {
    console.error("Error updating user data:", updateError.message);
    return encodedRedirect("error", "/dashboard/events", "Failed to add event.");
  }

  if (user.events_count >= 10) {
    return encodedRedirect("error", "/dashboard/pricing", "You have reached the maximum number of events.");
  }

  // Insert the event data into the database
  const { error } = await supabase.from("events").insert([eventData]);

  if (error) {
    console.error("Error inserting event:", error.message);
    return encodedRedirect("error", "/dashboard/events", "Failed to add event.");
  }

  return encodedRedirect("success", "/dashboard/events", "Event successfully added!");
};

export const addThreadAction = async (formData: FormData, communityId: number | undefined) => {
  const supabase = await createClient();
  console.log("IN ADDTHREADACTION");

  // Extract fields dynamically
  const fields = ["title", "content", "community_uuid"];

  const threadData: Record<string, any> = {};

  // Dynamically construct the threadData object
  fields.forEach((field) => {
    const value = formData.get(field)?.toString();
    if (value !== undefined && value !== "") {
      threadData[field] = value;
    }
  });

  // Required field validation
  if (!threadData.title || !threadData.content) {
    return encodedRedirect("error", "/dashboard/communities/" + communityId + "/threads", "Title, description, start date, and end date are required fields.");
  }

  // Insert the event data into the database
  const { error } = await supabase.from("threads_communities").insert([threadData]);

  if (error) {
    console.error("Error inserting event:", error.message);
    return encodedRedirect("error", "/dashboard/communities/" + communityId + "/threads", "Failed to add event.");
  }

  return encodedRedirect("success", "/dashboard/communities/" + communityId + "/threads", "Event successfully added!");
};

export const addThreadReplyAction = async (formData: FormData, communityId : number | undefined, threadId: number | undefined) => {
  const supabase = await createClient();

  const fields = ["id", "sender", "content", "timestamp"]

  const messageData: Record<string, any> = {};

  fields.forEach((field) => {
    const value = formData.get(field)?.toString();
    if (value !== undefined && value !== "") {
      messageData[field] = value;
    }
  });

  if (!messageData.content) {
    return encodedRedirect("error", "/dashboard/communities/" + communityId + "/threads/" + threadId, "Content is required.");
  }

  const { } = await supabase
    .channel("threads_communities")
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'messages_communities' }, () => {})

  return encodedRedirect("success", "/dashboard/communities/" + communityId + "/threads/" + threadId, "Reply successfully added!");
}

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const sector = formData.get("sector")?.toString();
  const street = formData.get("street")?.toString();
  const building = formData.get("building")?.toString();
  const city = formData.get("city")?.toString();
  const country = formData.get("country")?.toString();
  let apartment = formData.get("apartment")?.toString() || "N/A"; // Default value
  const isAdmin = formData.get("isAdmin") === "on";
  const firstName = formData.get("first_name")?.toString();
  const lastName = formData.get("last_name")?.toString();

  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !firstName || !lastName || !password || !sector || !street || !building || !city || !country) {
    return { error: "All fields are required except apartment" };
  }

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (authError) {
    console.error(authError.code + " " + authError.message);
    return encodedRedirect("error", "/sign-up", authError.message);
  }

  const user = authData.user;
  if (user) {
    const { error: insertError } = await supabase
      .from("users")
      .insert([
        {
          id: user.id,
          username: email.split("@")[0],
          sector,
          street,
          building,
          apartment, // This will be "N/A" if left empty
          first_name: firstName,
          last_name: lastName,
          communities: [],
          country,
          city,
          isAdmin,
        },
      ]);

    if (insertError) {
      console.error("User insert error:", insertError.message);
      return encodedRedirect("error", "/sign-up", "Failed to create user");
    }
  }

  return encodedRedirect(
    "success",
    "/dashboard", // de modificat aici daca facem cu mail in /sign-up
    "Thanks for signing up! Please check your email for a verification link."
  );
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/dashboard");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { CommunitiesGrid } from "./communities-grid";

export default async function CommunitiesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Fetch all communities
  const { data: communities, error } = await supabase
    .from("communities")
    .select("id, name, description, city, building, members");

  if (error) {
    console.error("Error fetching communities:", error);
    return <div>Failed to load communities</div>;
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-12 bg-[#F3F6FF] px-6 py-8">
      {/* Title Section */}
      <div className="w-full text-center mb-8">
        <h1 className="text-5xl font-extrabold tracking-wide text-[#0264FA] drop-shadow-md">
          <span className="text-[#383838]">Discover </span>
          <span className="underline decoration-4 decoration-[#EAECED]">
            Communities
          </span>
        </h1>
        <p className="text-[#383838] mt-4 text-lg">
          Connect with others and explore vibrant communities in your city.
        </p>
      </div>

      {/* Communities Grid */}
      <CommunitiesGrid communities={communities} userId={user.id} />
    </div>
  );
}

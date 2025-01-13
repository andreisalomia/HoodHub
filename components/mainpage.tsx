import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SocialLinks } from "@/components/SocialLinks"; // Adjust the path if necessary

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F3F6FF] text-[#383838]">
      <main className="flex-grow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#0264FA] mb-4">
              Welcome to HoodHub
            </h1>
            <p className="text-xl sm:text-2xl text-[#383838] mb-8 max-w-2xl mx-auto">
              Connect with your neighbors, start local events, and build a stronger community right where you live.
            </p>

            {/* Buttons for Signup and Login */}
            <div className="flex justify-center gap-4">
              <Button
                size="lg"
                className="bg-[#0264FA] text-white hover:bg-[#0264FA]/90"
                asChild
              >
                <Link href="/sign-up">Sign Up</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-[#0264FA] text-[#0264FA] hover:bg-[#EAECED] hover:text-[#0264FA]"
                asChild
              >
                <Link href="/sign-in">Log In</Link>
              </Button>
            </div>
          </div>

          {/* Why HoodHub Section */}
          <div className="mt-16">
            <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-8 text-[#383838]">
              Why HoodHub?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon="🏠"
                title="Hyperlocal Connections"
                description="Connect with people in your building, street, or neighborhood."
              />
              <FeatureCard
                icon="🎉"
                title="Local Events"
                description="Discover and create events happening right in your community."
              />
              <FeatureCard
                icon="🤝"
                title="Community Support"
                description="Offer or receive help from your neighbors when you need it most."
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#EAECED] py-6 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center text-sm text-[#383838] mb-4">
          &copy; {new Date().getFullYear()} HoodHub. All rights reserved.
        </div>
        <SocialLinks />
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white text-[#383838] rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
      <div className="text-4xl text-[#0264FA] mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-[#383838]/80">{description}</p>
    </div>
  );
}

import { signUpAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  if ("message" in searchParams) {
    return (
      <div className="w-full flex items-center justify-center min-h-screen bg-[#F3F6FF]">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-center min-h-screen bg-[#F3F6FF] px-4">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-md mx-auto p-8 md:p-10">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-[#0264FA]">Sign Up</h1>
          <p className="text-[#383838] mt-2">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="text-[#0264FA] font-semibold hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Form */}
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <div>
            <Label htmlFor="first_name" className="text-[#383838]">
              First Name
            </Label>
            <Input
              name="first_name"
              placeholder="Enter your first name"
              required
              className="bg-[#EAECED] focus:ring-[#0264FA]"
            />
          </div>

          {/* Last Name */}
          <div>
            <Label htmlFor="last_name" className="text-[#383838]">
              Last Name
            </Label>
            <Input
              name="last_name"
              placeholder="Enter your last name"
              required
              className="bg-[#EAECED] focus:ring-[#0264FA]"
            />
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email" className="text-[#383838]">
              Email
            </Label>
            <Input
              name="email"
              placeholder="you@example.com"
              required
              className="bg-[#EAECED] focus:ring-[#0264FA]"
            />
          </div>

          {/* Password */}
          <div>
            <Label htmlFor="password" className="text-[#383838]">
              Password
            </Label>
            <Input
              type="password"
              name="password"
              placeholder="Your password"
              minLength={6}
              required
              className="bg-[#EAECED] focus:ring-[#0264FA]"
            />
          </div>

          {/* Sector */}
          <div>
            <Label htmlFor="sector" className="text-[#383838]">
              Sector
            </Label>
            <Input
              name="sector"
              placeholder="Enter your sector"
              required
              className="bg-[#EAECED] focus:ring-[#0264FA]"
            />
          </div>

          {/* Street */}
          <div>
            <Label htmlFor="street" className="text-[#383838]">
              Street
            </Label>
            <Input
              name="street"
              placeholder="Enter your street"
              required
              className="bg-[#EAECED] focus:ring-[#0264FA]"
            />
          </div>

          {/* City */}
          <div>
            <Label htmlFor="city" className="text-[#383838]">
              City
            </Label>
            <Input
              name="city"
              placeholder="Enter your city"
              required
              className="bg-[#EAECED] focus:ring-[#0264FA]"
            />
          </div>

          {/* Building */}
          <div>
            <Label htmlFor="building" className="text-[#383838]">
              Building Number
            </Label>
            <Input
              name="building"
              placeholder="Enter building number"
              required
              className="bg-[#EAECED] focus:ring-[#0264FA]"
            />
          </div>

          {/* Apartment */}
          <div>
            <Label htmlFor="apartment" className="text-[#383838]">
              Apartment
            </Label>
            <Input
              name="apartment"
              placeholder="Enter your apartment"
              className="bg-[#EAECED] focus:ring-[#0264FA]"
            />
          </div>

          {/* Country */}
          <div>
            <Label htmlFor="country" className="text-[#383838]">
              Country
            </Label>
            <Input
              name="country"
              placeholder="Enter your country"
              required
              className="bg-[#EAECED] focus:ring-[#0264FA]"
            />
          </div>

          {/* Administrator Checkbox */}
          <div className="col-span-2 flex items-center gap-2">
            <input
              type="checkbox"
              id="isAdmin"
              name="isAdmin"
              className="h-5 w-5 text-[#0264FA] focus:ring-[#0264FA] rounded"
            />
            <Label htmlFor="isAdmin" className="text-[#383838]">
              Administrator?
            </Label>
          </div>

          {/* Submit Button */}
          <div className="col-span-2">
            <SubmitButton
              formAction={signUpAction}
              pendingText="Signing up..."
              className="w-full bg-[#0264FA] hover:bg-[#0264FA]/90 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition"
            >
              Sign up
            </SubmitButton>
          </div>
        </form>
      </div>
    </div>
  );
}

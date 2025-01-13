import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;

  return (
    <div className="w-full flex items-center justify-center min-h-screen bg-[#F3F6FF] px-4">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-8 md:p-10">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-[#0264FA]">Welcome Back</h1>
          <p className="text-[#383838] mt-2">
            Don’t have an account?{" "}
            <Link
              href="/sign-up"
              className="text-[#0264FA] font-semibold hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>

        {/* Form */}
        <form className="space-y-6">
          {/* Email */}
          <div>
            <Label htmlFor="email" className="text-[#383838]">
              Email
            </Label>
            <Input
              name="email"
              placeholder="you@example.com"
              required
              className="bg-[#EAECED] focus:ring-[#0264FA] rounded-lg p-3"
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center">
              <Label htmlFor="password" className="text-[#383838]">
                Password
              </Label>
              <Link
                href="/forgot-password"
                className="text-sm text-[#0264FA] font-medium hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <Input
              type="password"
              name="password"
              placeholder="Your password"
              required
              className="bg-[#EAECED] focus:ring-[#0264FA] rounded-lg p-3"
            />
          </div>

          {/* Submit Button */}
          <SubmitButton
            pendingText="Signing In..."
            formAction={signInAction}
            className="w-full bg-[#0264FA] hover:bg-[#0056E0] text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
          >
            Sign in
          </SubmitButton>

          {/* Form Message */}
          <FormMessage message={searchParams} />
        </form>
      </div>
    </div>
  );
}

import Hero from "@/components/hero";
import MainPage from "@/components/mainpage";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";

export default async function Index() {
  return (
    <>
      {/* <Hero /> */}
      <MainPage />
    </>
  );
}
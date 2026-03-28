"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AuthCallback() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const handleInvite = async () => {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);

      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");

      // 🧪 Debug (optional)
      console.log({ access_token, refresh_token });

      if (!access_token || !refresh_token) {
        console.error("Missing tokens in URL");
        return;
      }

      const { error } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      });

      if (error) {
        console.error("Session error:", error);
        return;
      }

      router.replace("/complete-profile");
    };

    handleInvite();
  }, []);

  return <p>Signing you in...</p>;
}

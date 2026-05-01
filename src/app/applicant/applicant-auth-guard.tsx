"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function ApplicantAuthGuard({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;
    const supabase = createSupabaseBrowserClient();

    async function verifyUser() {
      const { data, error } = await supabase.auth.getUser();

      if (!isMounted) {
        return;
      }

      if (error || !data.user) {
        router.replace("/");
        return;
      }

      setIsCheckingAuth(false);
    }

    void verifyUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      if (event === "SIGNED_OUT" || !session?.user) {
        router.replace("/");
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [router]);

  if (isCheckingAuth) {
    return (
      <div className="app-shell grid min-h-screen place-items-center px-4 text-center">
        <p className="text-sm font-semibold text-secondary">Checking your session...</p>
      </div>
    );
  }

  return children;
}

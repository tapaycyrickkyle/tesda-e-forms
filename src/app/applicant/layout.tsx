import { redirect } from "next/navigation";
import { ApplicantAuthGuard } from "./applicant-auth-guard";
import { ApplicantSidebar } from "./applicant-sidebar";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function ApplicantLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims?.sub) {
    redirect("/");
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/");
  }

  return (
    <ApplicantAuthGuard>
      <div className="app-shell">
        <ApplicantSidebar />

        <main className="min-h-screen md:pl-64">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 p-4 sm:p-5 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </ApplicantAuthGuard>
  );
}

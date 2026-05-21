import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { serverFetch } from "@/lib/server-api";
import { AppShell } from "@/components/app-shell";
import type { User } from "@/lib/types";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  if (!cookieStore.has("access_token")) {
    redirect("/login");
  }

  const res = await serverFetch<User>("/auth/me");
  if (!res.success || !res.data) {
    redirect("/login");
  }

  return <AppShell user={res.data}>{children}</AppShell>;
}

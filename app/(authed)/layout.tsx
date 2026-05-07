import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { SignOut } from "@/components/auth-components";

export default async function AuthedLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect("/sign-in");

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-end gap-3 px-6 py-3 border-b border-gray-100 bg-white">
        <span className="text-sm text-gray-500">{user.email}</span>
        <SignOut />
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}

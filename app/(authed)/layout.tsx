// AUTH BYPASS — re-enable when login root cause is fixed (see prd/bypass-auth-login.md)
// const user = await getSessionUser();
// if (!user) redirect("/sign-in");

export default async function AuthedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">{children}</main>
    </div>
  );
}

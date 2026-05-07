import { redirect } from "next/navigation";
import { SignIn } from "@/components/auth-components";
import { auth } from "@/lib/auth";
import { env } from "@/lib/env";

type SignInPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const session = await auth();
  if (session?.user) redirect("/");

  const { error } = await searchParams;
  const showDomainError = error === "AccessDenied";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-10 max-w-sm w-full text-center shadow-sm border border-gray-100">
        <header className="mb-8">
          <h1 className="text-xl font-semibold text-gray-900">Revenue Meeting</h1>
          <p className="text-sm text-gray-500 mt-2">
            Mindvalley employees only — sign in with your{" "}
            <span className="text-gray-800 font-medium">@{env.AUTH_ALLOWED_EMAIL_DOMAIN}</span>{" "}
            account.
          </p>
        </header>

        {showDomainError && (
          <div className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-3 border border-red-100 mb-6">
            That account isn&apos;t a Mindvalley account. Please sign in with your
            @{env.AUTH_ALLOWED_EMAIL_DOMAIN} email.
          </div>
        )}

        <SignIn />
      </div>
    </div>
  );
}

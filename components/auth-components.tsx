import { signIn, signOut } from "@/lib/auth";

export function SignIn() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google", { redirectTo: "/" });
      }}
    >
      <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-full transition-colors text-sm">
        Sign in with Google
      </button>
    </form>
  );
}

export function SignOut() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/sign-in" });
      }}
    >
      <button className="text-xs text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-md border border-gray-200 hover:border-gray-300 transition-colors">
        Sign out
      </button>
    </form>
  );
}

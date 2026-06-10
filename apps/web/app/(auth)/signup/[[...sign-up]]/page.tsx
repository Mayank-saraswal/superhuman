import { SignUp } from "@clerk/nextjs";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0d1117]">
      <SignUp path="/signup" routing="path" signInUrl="/login" fallbackRedirectUrl="/onboarding/connect" />
    </div>
  );
}

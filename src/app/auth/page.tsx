import { Suspense } from "react";
import AuthClient from "./AuthClient";

export default function AuthPage({
  searchParams,
}: {
  searchParams?: { redirect?: string };
}) {
  const redirect = searchParams?.redirect || "/";

  return (
    <div className="max-w-[480px] mx-auto w-full">
      <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
        <AuthClient redirect={redirect} />
      </Suspense>
    </div>
  );
}

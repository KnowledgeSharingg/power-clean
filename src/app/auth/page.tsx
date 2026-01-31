export default async function AuthPage({ searchParams }: { searchParams?: Promise<any> }) {
  const sp = (await searchParams) ?? {};
  const redirectParam = (sp as Record<string, string | string[] | undefined>)["redirect"];
  const redirect = Array.isArray(redirectParam)
    ? redirectParam[0] || "/"
    : redirectParam || "/";
  const AuthClient = (await import("./AuthClient")).default;
  return <AuthClient redirect={redirect} />;
}

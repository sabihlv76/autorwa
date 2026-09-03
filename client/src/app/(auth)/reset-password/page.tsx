import { ResetPasswordForm } from "./ResetPasswordForm";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string | string[] }>;
}) {
  const resolved = await searchParams;
  const token = Array.isArray(resolved.token) ? resolved.token[0] : resolved.token;

  return <ResetPasswordForm token={token ?? ""} />;
}

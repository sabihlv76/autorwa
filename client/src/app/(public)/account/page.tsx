import { redirect } from "next/navigation";
import { AccountView } from "@/components/account/AccountView";
import { auth } from "@/lib/auth/auth";
import * as userRepository from "@/repositories/userRepository";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/signin");
  }

  const user = await userRepository.findByEmail(session.user.email);
  if (!user) {
    redirect("/signin");
  }

  return (
    <AccountView
      name={user.name}
      email={user.email}
      role={user.role}
      accountStatus={user.accountStatus}
      image={user.image}
      createdAt={user.createdAt}
      hasPassword={Boolean(user.passwordHash)}
    />
  );
}

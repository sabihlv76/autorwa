"use client";

import { useLocale } from "@/components/providers/LocaleProvider";
import type { AccountStatus, Role } from "@/types/user";
import { AvatarUploadField } from "./AvatarUploadField";
import { ChangePasswordForm } from "./ChangePasswordForm";
import { SignOutButton } from "./SignOutButton";

export function AccountView({
  name,
  email,
  role,
  accountStatus,
  image,
  createdAt,
  hasPassword,
}: {
  name: string;
  email: string;
  role: Role;
  accountStatus: AccountStatus;
  image?: string;
  createdAt: string;
  hasPassword: boolean;
}) {
  const { dictionary } = useLocale();
  const memberSince = new Date(createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-xl font-semibold text-black">{dictionary.account.title}</h1>

      <section className="mb-8 rounded-lg border border-zinc-200 p-5">
        <AvatarUploadField
          initialImage={image}
          label={dictionary.account.uploadPhoto}
          changeLabel={dictionary.account.changePhoto}
        />
      </section>

      <section className="mb-8 space-y-3 rounded-lg border border-zinc-200 p-5">
        <h2 className="text-base font-semibold text-black">{dictionary.account.details}</h2>
        <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-zinc-500">{dictionary.auth.name}</dt>
            <dd className="text-black">{name}</dd>
          </div>
          <div>
            <dt className="text-zinc-500">{dictionary.auth.email}</dt>
            <dd className="text-black">{email}</dd>
          </div>
          <div>
            <dt className="text-zinc-500">{dictionary.account.role}</dt>
            <dd className="capitalize text-black">{role}</dd>
          </div>
          <div>
            <dt className="text-zinc-500">{dictionary.account.accountStatus}</dt>
            <dd className="capitalize text-black">{accountStatus}</dd>
          </div>
          <div>
            <dt className="text-zinc-500">{dictionary.account.memberSince}</dt>
            <dd className="text-black">{memberSince}</dd>
          </div>
        </dl>
      </section>

      <section className="mb-8 rounded-lg border border-zinc-200 p-5">
        <ChangePasswordForm hasPassword={hasPassword} />
      </section>

      <SignOutButton />
    </div>
  );
}

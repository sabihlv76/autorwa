"use client";

import Link from "next/link";
import { PhoneIcon, WhatsAppIcon } from "@/components/layout/ContactWidget";
import { useLocale } from "@/components/providers/LocaleProvider";

function EmailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M4 7l8 6 8-6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ContactMethodCard({
  icon,
  iconClassName,
  title,
  description,
  href,
}: {
  icon: React.ReactNode;
  iconClassName: string;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      className="flex flex-col items-center gap-3 rounded-lg border border-zinc-200 bg-white p-6 text-center transition-shadow hover:shadow-md"
    >
      <span className={`flex h-12 w-12 items-center justify-center rounded-full text-white ${iconClassName}`}>
        {icon}
      </span>
      <span className="text-sm font-semibold text-black">{title}</span>
      <span className="text-xs text-zinc-500">{description}</span>
    </a>
  );
}

export function ContactView() {
  const { dictionary } = useLocale();

  const whatsappRaw = process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP;
  const phoneRaw = process.env.NEXT_PUBLIC_SUPPORT_PHONE || whatsappRaw;
  const emailRaw = process.env.NEXT_PUBLIC_SUPPORT_EMAIL;

  const whatsappDigits = whatsappRaw?.replace(/\D/g, "");
  const phoneDigits = phoneRaw?.replace(/\D/g, "");

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight text-black sm:text-3xl">
          {dictionary.contact.pageTitle}
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-sm text-zinc-500">
          {dictionary.contact.pageSubtitle}
        </p>
      </div>

      <div className="mt-10 grid justify-center gap-4 grid-cols-[repeat(auto-fit,minmax(220px,260px))]">
        {whatsappDigits && (
          <ContactMethodCard
            icon={<WhatsAppIcon />}
            iconClassName="bg-[#25D366]"
            title={dictionary.specs.chatOnWhatsApp}
            description={dictionary.contact.whatsappDesc}
            href={`https://wa.me/${whatsappDigits}`}
          />
        )}
        {phoneDigits && (
          <ContactMethodCard
            icon={<PhoneIcon />}
            iconClassName="bg-accent"
            title={dictionary.contact.callUs}
            description={dictionary.contact.callDesc}
            href={`tel:+${phoneDigits}`}
          />
        )}
        {emailRaw && (
          <ContactMethodCard
            icon={<EmailIcon />}
            iconClassName="bg-zinc-700"
            title={dictionary.contact.emailUs}
            description={dictionary.contact.emailDesc}
            href={`mailto:${emailRaw}`}
          />
        )}
      </div>

      <div className="mt-12 rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-6 text-center">
        <p className="text-sm font-medium text-black">{dictionary.contact.sellCta}</p>
        <Link
          href="/book-call"
          className="mt-3 inline-block rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-dark"
        >
          {dictionary.nav.sellWithUs}
        </Link>
      </div>
    </div>
  );
}

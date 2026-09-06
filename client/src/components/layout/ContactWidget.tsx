"use client";

import { useLocale } from "@/components/providers/LocaleProvider";

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1s-.7.8-.9 1c-.2.2-.3.2-.6.1a6.7 6.7 0 0 1-2-1.2 7.4 7.4 0 0 1-1.4-1.7c-.1-.2 0-.4.1-.5l.4-.4c.1-.1.2-.3.2-.4a.5.5 0 0 0 0-.5c-.1-.1-.6-1.5-.8-2-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3.9 2.6 1.1 2.8.1.2 1.9 2.9 4.6 4a15 15 0 0 0 1.5.6c.6.2 1.2.2 1.6.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.2-.2-.5-.3z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path
        d="M6.6 10.8a15.3 15.3 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.3c1.1.4 2.4.6 3.6.6a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.6 21 3 13.4 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.2.2 2.5.6 3.6a1 1 0 0 1-.3 1z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Two independent floating buttons rather than one opaque card — a solid
// card that size was blocking storefront content behind it, and the user
// asked for the WhatsApp/Call actions visually separated, not grouped.
// Semi-transparent + backdrop-blur so whatever's behind them still reads
// through instead of being fully hidden.
export function ContactWidget() {
  const { dictionary } = useLocale();
  const whatsappRaw = process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP;
  const phoneRaw = process.env.NEXT_PUBLIC_SUPPORT_PHONE || whatsappRaw;

  if (!whatsappRaw && !phoneRaw) return null;

  const whatsappDigits = whatsappRaw?.replace(/\D/g, "");
  const phoneDigits = phoneRaw?.replace(/\D/g, "");

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-3">
      {whatsappDigits && (
        <a
          href={`https://wa.me/${whatsappDigits}`}
          target="_blank"
          rel="noopener noreferrer"
          title={dictionary.specs.chatOnWhatsApp}
          aria-label={dictionary.specs.chatOnWhatsApp}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366]/80 text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-[#25D366]"
        >
          <WhatsAppIcon />
        </a>
      )}
      {phoneDigits && (
        <a
          href={`tel:+${phoneDigits}`}
          title={dictionary.contact.callUs}
          aria-label={dictionary.contact.callUs}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/80 text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-accent-dark"
        >
          <PhoneIcon />
        </a>
      )}
    </div>
  );
}

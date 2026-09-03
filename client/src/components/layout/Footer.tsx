"use client";

import Image from "next/image";
import Link from "next/link";
import { siFacebook, siInstagram, siTiktok, siWhatsapp, siX, type SimpleIcon } from "simple-icons";
import { BrandIcon } from "@/components/marketplace/BrandIcon";
import { useLocale } from "@/components/providers/LocaleProvider";

interface SocialLink {
  name: string;
  href: string;
  icon: SimpleIcon;
}

export function Footer() {
  const { dictionary } = useLocale();

  const whatsappDigits = process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP?.replace(/\D/g, "");

  const socialLinks: SocialLink[] = [
    whatsappDigits && { name: "WhatsApp", href: `https://wa.me/${whatsappDigits}`, icon: siWhatsapp },
    process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK && {
      name: "Facebook",
      href: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK,
      icon: siFacebook,
    },
    process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM && {
      name: "Instagram",
      href: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM,
      icon: siInstagram,
    },
    process.env.NEXT_PUBLIC_SOCIAL_X && {
      name: "X",
      href: process.env.NEXT_PUBLIC_SOCIAL_X,
      icon: siX,
    },
    process.env.NEXT_PUBLIC_SOCIAL_TIKTOK && {
      name: "TikTok",
      href: process.env.NEXT_PUBLIC_SOCIAL_TIKTOK,
      icon: siTiktok,
    },
  ].filter((link): link is SocialLink => Boolean(link));

  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-[2fr_1fr_1fr]">
          <div>
            <Link href="/" className="inline-flex items-center">
              <Image src="/logo.svg" alt="Autorwa" width={266} height={100} className="h-12 w-auto" />
            </Link>
            <p className="mt-3 max-w-xs text-sm text-zinc-500">{dictionary.footer.tagline}</p>
            {socialLinks.length > 0 && (
              <div className="mt-4 flex items-center gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    title={social.name}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 hover:bg-accent hover:text-white"
                  >
                    <BrandIcon icon={social.icon} className="h-4 w-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-sm font-semibold text-black">{dictionary.footer.marketplaceHeading}</h3>
            <ul className="mt-3 space-y-2 text-sm text-zinc-500">
              <li>
                <Link href="/marketplace?type=vehicle" className="hover:text-accent">
                  {dictionary.nav.cars}
                </Link>
              </li>
              <li>
                <Link href="/marketplace?type=spare_part" className="hover:text-accent">
                  {dictionary.nav.spareParts}
                </Link>
              </li>
              <li>
                <Link href="/marketplace?type=vehicle&rentalOption=rent" className="hover:text-accent">
                  {dictionary.nav.rent}
                </Link>
              </li>
              <li>
                <Link href="/book-call" className="hover:text-accent">
                  {dictionary.nav.sellWithUs}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-black">{dictionary.footer.accountHeading}</h3>
            <ul className="mt-3 space-y-2 text-sm text-zinc-500">
              <li>
                <Link href="/cart" className="hover:text-accent">
                  {dictionary.nav.cart}
                </Link>
              </li>
              <li>
                <Link href="/signin" className="hover:text-accent">
                  {dictionary.auth.signIn}
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-accent">
                  {dictionary.auth.signUp}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-zinc-200 pt-6 text-xs text-zinc-400">
          © {new Date().getFullYear()} Autorwa. {dictionary.footer.rightsReserved}
        </div>
      </div>
    </footer>
  );
}

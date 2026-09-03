import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-4 py-12">
      <Link href="/" className="mb-6 flex items-center gap-2">
        <Image
          src="/logo.jpg"
          alt="Autorwa"
          width={36}
          height={36}
          className="h-9 w-9 object-contain"
        />
        <span className="text-lg font-bold tracking-tight text-black">
          AUTO<span className="text-accent">RWA</span>
        </span>
      </Link>
      <div className="w-full max-w-sm rounded-md border border-zinc-200 bg-white p-6 shadow-sm">
        {children}
      </div>
    </div>
  );
}

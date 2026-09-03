import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-4 py-12">
      <div className="w-full max-w-sm rounded-md border border-zinc-200 bg-white p-6 shadow-sm">
        <Link href="/" className="mb-6 flex justify-center">
          <Image
            src="/logo.svg"
            alt="Autorwa"
            width={266}
            height={100}
            className="h-10 w-auto"
          />
        </Link>
        {children}
      </div>
    </div>
  );
}

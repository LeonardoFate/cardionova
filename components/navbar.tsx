"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "@/app/lib/auth-client";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const router = useRouter();
  const { data: session } = useSession();

  const handleSignOut = async () => {
    await signOut();
    router.push("/acceso-medicos");
  };

  return (
    <nav className="border-b border-gray-200 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center space-x-3">
          <Image
            src="/logo.png"
            alt="Cardionova Logo"
            width={40}
            height={40}
            className="rounded"
          />
          <span className="text-xl font-bold text-[#1E3A8A]">Cardionova</span>
        </Link>

        <div className="flex items-center space-x-4">
          {session?.user && (
            <>
              <div className="text-sm">
                <div className="font-medium text-[#1E3A8A]">{session.user.name}</div>
                <div className="text-gray-600">{session.user.email}</div>
              </div>
              <Button
                onClick={handleSignOut}
                size="sm"
                className="border border-[#E11D48] text-[#E11D48] bg-white hover:bg-[#E11D48]/10 shadow-sm cursor-pointer"
              >
                Sign out
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { NotificationDropdown } from "@/components/notifications/NotificationDropdown";

export const dynamic = "force-dynamic";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0a] text-gray-300">
      <header className="w-full flex justify-between items-center px-6 py-3 text-[10px] text-gray-500 font-medium tracking-wide border-b border-[#252525]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[14px]">grid_view</span>
          <Link href="/dashboard" className="hover:text-white transition-colors">
            Life 2.0
          </Link>
          <span className="text-gray-600 material-symbols-outlined text-[10px]">lock</span>
          <span>Secured</span>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/dashboard" className="hover:text-white transition-colors">
            Dashboard
          </Link>
          <Link href="/teams" className="hover:text-white transition-colors">
            Teams
          </Link>
          <Link href="/admin" className="hover:text-white transition-colors">
            Admin
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <NotificationDropdown />
          <Link href="/profile" className="material-symbols-outlined text-[16px] cursor-pointer hover:text-white transition-colors">
            settings
          </Link>
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-6 h-6",
              },
            }}
          />
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Menu, LogOut, ChevronDown, X } from "lucide-react";
import { useState } from "react";
import { UserRole } from "@/lib/types";

type AdminHeaderProps = {
  user: {
    email: string;
    role: string;
  };
};

type NavLink = {
  href: string;
  label: string;
  allowedRoles?: UserRole[];
};

const links: NavLink[] = [
  { href: "/contacts", label: "Contacts", allowedRoles: ["owner", "admin", "editor"] },
  { href: "/users", label: "Users", allowedRoles: ["owner", "admin"] },
  { href: "/content", label: "Content", allowedRoles: ["owner", "admin", "editor"] },
];

export function AdminHeader({ user }: AdminHeaderProps) {
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const visibleLinks = links.filter(
    (link) =>
      !link.allowedRoles || link.allowedRoles.includes(user.role as UserRole),
  );

  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-10">
          <span className="text-lg font-semibold text-emerald-700">
            R&F City Admin
          </span>
          <nav className="hidden gap-6 text-sm font-semibold text-slate-500 md:flex">
            {visibleLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={
                  pathname.startsWith(link.href)
                    ? "text-emerald-700"
                    : "hover:text-slate-900"
                }
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="hidden items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-emerald-200 hover:text-emerald-800 sm:flex"
          >
            <span>{user.email}</span>
            <ChevronDown size={16} />
          </button>
          {dropdownOpen ? (
            <div className="absolute right-6 top-16 w-56 rounded-2xl border border-slate-100 bg-white p-4 shadow-2xl">
              <p className="text-xs uppercase text-slate-400">
                {user.role.toUpperCase()}
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                {user.email}
              </p>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-red-200 hover:text-red-600"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          ) : null}

          <button
            className="md:hidden"
            onClick={() => setMobileNavOpen((prev) => !prev)}
          >
            {mobileNavOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      {mobileNavOpen ? (
        <div className="border-t border-slate-200 bg-white px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-3 text-sm font-semibold text-slate-600">
            {visibleLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileNavOpen(false)}
                className={
                  pathname.startsWith(link.href)
                    ? "text-emerald-700"
                    : "hover:text-slate-900"
                }
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex items-center gap-2 text-left text-red-600"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

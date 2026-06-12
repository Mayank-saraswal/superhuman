"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Navbar as ResizableNavbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
  NavbarButton,
} from "~/components/ui/resizable-navbar";

const navItems = [
  { name: "Features", link: "#features" },
  { name: "Integrations", link: "#integrations" },
  { name: "Pricing", link: "#pricing" },
  { name: "FAQ", link: "#faq" },
];

function Logo() {
  return (
    <Link href="/" className="relative z-20 mr-4 flex items-center gap-2 px-2 py-1">
      <span className="text-xl">☕</span>
      <span className="font-serif text-[17px] font-bold tracking-tight text-text-primary">
        Chai Combinator
      </span>
    </Link>
  );
}

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="relative w-full">
      <ResizableNavbar>
        {/* Desktop */}
        <NavBody>
          <Logo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-3">
            <NavbarButton as={Link} href="/login" variant="secondary">
              Log in
            </NavbarButton>
            <NavbarButton
              as={Link}
              href="/signup"
              variant="primary"
              className="bg-brand text-[#1C1C1C] shadow-none hover:bg-brand/90"
            >
              Get early access
            </NavbarButton>
          </div>
        </NavBody>

        {/* Mobile */}
        <MobileNav>
          <MobileNavHeader>
            <Logo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-text-secondary hover:text-text-primary"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-3 pt-2">
              <NavbarButton as={Link} href="/login" variant="secondary" className="w-full">
                Log in
              </NavbarButton>
              <NavbarButton
                as={Link}
                href="/signup"
                variant="primary"
                className="w-full bg-brand text-[#1C1C1C] hover:bg-brand/90"
              >
                Get early access
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </ResizableNavbar>
    </div>
  );
}

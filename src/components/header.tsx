"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Menu, Code } from 'lucide-react';

const navLinks = [
  { href: '/#about', label: 'About' },
  { href: '/events', label: 'Events' },
  { href: '/#membership', label: 'Membership' },
  { href: '/#team', label: 'Team' },
  { href: '/#contact', label: 'Contact' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled ? 'bg-background/80 backdrop-blur-sm border-b' : 'bg-transparent'}`}>
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg font-headline">
          <div className="p-2">
            <Image src="/acm_logo_trans.png" alt="ACM IIIT Pune Logo" width={80} height={20} className="object-contain" />
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-6 p-6">
                <Link href="/" className="flex items-center gap-2 font-bold text-lg font-headline">
                  <div className="p-2">
                    <Image src="/acm_logo_trans.png" alt="ACM IIIT Pune Logo" width={80} height={20} className="object-contain" />
                  </div>
                </Link>
                <nav className="flex flex-col gap-4 mt-4">
                  {navLinks.map((link) => (
                    <SheetClose asChild key={link.href}>
                      <Link href={link.href} className="text-base font-medium text-foreground/80 hover:text-primary transition-colors py-2">
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

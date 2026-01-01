import Link from 'next/link';
import { Code, Github, Linkedin, Mail, Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-2">
            <Code className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg font-headline">ACM IIIT Pune</span>
          </div>
          <p className="text-sm text-muted-foreground order-last md:order-none">
            &copy; {new Date().getFullYear()} ACM IIIT Pune. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="mailto:acm.chapter@iiitp.ac.in" aria-label="Email">
              <Mail className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
            </Link>
            <Link href="https://www.instagram.com/iiitp.sigchi/" target="_blank" aria-label="Instagram">
              <Instagram className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
            </Link>
            <Link href="https://www.linkedin.com/company/iiitpsigchi" target="_blank" aria-label="LinkedIn">
              <Linkedin className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

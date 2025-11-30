import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import logo from "@assets/C442C7B9-08EE-40E8-9A2E-1D38827FBB5B_1764526673965.jpeg";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const isActive = (path: string) => location === path;

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/browse", label: "Browse Homes" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/for-tenants", label: "Tenants" },
    { href: "/for-providers", label: "Providers" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/">
            <a className="flex items-center hover:opacity-90 transition-opacity">
              <img src={logo} alt="Sober Stay" className="h-28 w-auto" />
            </a>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <a
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    isActive(link.href) ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </a>
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                Log in
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                Sign up
              </Button>
            </Link>
          </div>

          {/* Mobile Nav */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] border-l border-border bg-card">
              <nav className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href}>
                    <a
                      className={`text-lg font-medium transition-colors hover:text-primary ${
                        isActive(link.href) ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {link.label}
                    </a>
                  </Link>
                ))}
                <div className="flex flex-col gap-2 mt-4">
                  <Link href="/login">
                    <Button variant="outline" className="w-full justify-start">Log in</Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="w-full justify-start bg-primary text-primary-foreground">Sign up</Button>
                  </Link>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center">
                <img src={logo} alt="Sober Stay" className="h-20 w-auto" />
              </div>
              <p className="text-sm text-muted-foreground">
                Connecting individuals in recovery with safe, supportive, and verified sober living environments.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Platform</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/browse"><a className="hover:text-primary">Browse Homes</a></Link></li>
                <li><Link href="/how-it-works"><a className="hover:text-primary">How it Works</a></Link></li>
                <li><Link href="/for-tenants"><a className="hover:text-primary">For Tenants</a></Link></li>
                <li><Link href="/for-providers"><a className="hover:text-primary">For Providers</a></Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary">Help Center</a></li>
                <li><a href="#" className="hover:text-primary">Safety & Reporting</a></li>
                <li><a href="#" className="hover:text-primary">Contact Us</a></li>
                <li><a href="#" className="hover:text-primary">Crisis Resources</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary">Terms of Use</a></li>
                <li><a href="#" className="hover:text-primary">Disclaimer</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border/50 text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} Sober Stay. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

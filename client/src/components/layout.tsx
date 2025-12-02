import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import logo from "@assets/C442C7B9-08EE-40E8-9A2E-1D38827FBB5B_1764526673965.jpeg";
import { isAuthenticated, getAuth, clearAuth } from "@/lib/auth";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const user = getAuth();
  const authenticated = isAuthenticated();

  const handleSignOut = () => {
    clearAuth();
    setLocation("/");
    setMenuOpen(false);
  };

  const isActive = (path: string) => location === path;

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/browse", label: "Browse Homes" },
    { href: "/for-tenants", label: "Tenants" },
    { href: "/for-providers", label: "Providers" },
    { href: "/blog", label: "Blog" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
            <img src={logo} alt="Sober Stay" className="h-16 w-auto" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive(link.href) ? "text-primary" : "text-muted-foreground"
              }`}>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {authenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">Welcome, {user?.name}</span>
                <Button onClick={handleSignOut} variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-2">
                  <LogOut className="w-4 h-4" /> Sign Out
                </Button>
              </div>
            ) : (
              <>
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
              </>
            )}
          </div>

          {/* Mobile Nav */}
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] border-l border-border bg-card">
              <nav className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className={`text-lg font-medium transition-colors hover:text-primary ${
                    isActive(link.href) ? "text-primary" : "text-muted-foreground"
                  }`}>
                    {link.label}
                  </Link>
                ))}
                <div className="flex flex-col gap-2 mt-4">
                  {authenticated ? (
                    <Button onClick={handleSignOut} className="w-full justify-start gap-2 bg-red-600/20 text-red-500 hover:bg-red-600/30">
                      <LogOut className="w-4 h-4" /> Sign Out
                    </Button>
                  ) : (
                    <>
                      <Link href="/login">
                        <Button variant="outline" className="w-full justify-start" onClick={() => setMenuOpen(false)}>Log in</Button>
                      </Link>
                      <Link href="/signup">
                        <Button className="w-full justify-start bg-primary text-primary-foreground" onClick={() => setMenuOpen(false)}>Sign up</Button>
                      </Link>
                    </>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-4">
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
                <li><Link href="/browse" className="hover:text-primary">Browse Homes</Link></li>
                <li><Link href="/for-tenants" className="hover:text-primary">For Tenants</Link></li>
                <li><Link href="/for-providers" className="hover:text-primary">For Providers</Link></li>
                <li><Link href="/blog" className="hover:text-primary">Blog</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/help-center" className="hover:text-primary">Help Center</Link></li>
                <li><Link href="/safety-reporting" className="hover:text-primary">Safety & Reporting</Link></li>
                <li><a href="mailto:info@soberstay.com" className="hover:text-primary">Contact Us</a></li>
                <li><Link href="/crisis-resources" className="hover:text-primary">Crisis Resources</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/privacy-policy" className="hover:text-primary">Privacy Policy</Link></li>
                <li><Link href="/terms-of-use" className="hover:text-primary">Terms of Use</Link></li>
                <li><Link href="/disclaimer" className="hover:text-primary">Disclaimer</Link></li>
                <li><Link href="/liability-waiver" className="hover:text-primary">Liability Waiver</Link></li>
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

import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, LogOut, ChevronDown, Lock } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import logo from "@assets/C442C7B9-08EE-40E8-9A2E-1D38827FBB5B_1764526673965.jpeg";
import { isAuthenticated, getAuth, logout } from "@/lib/auth";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const user = getAuth();
  const authenticated = isAuthenticated();

  const handleSignOut = async () => {
    await logout();
    setLocation("/");
    setMenuOpen(false);
  };

  const isActive = (path: string) => location === path;

  const resourceLinks = [
    { href: "/what-is-sober-living", label: "What Is Sober Living?" },
    { href: "/resources", label: "Recovery Resources" },
    { href: "/how-to-choose", label: "How to Choose a Sober Living" },
    { href: "/insurance-info", label: "Insurance Info" },
    { href: "/crisis-resources", label: "Emergency Hotlines" },
    { href: "/partners", label: "Partners Directory" },
    { href: "/blog", label: "Blog" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
            <img src={logo} alt="Sober Stay" className="h-16 w-auto" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/") ? "text-primary font-bold" : "text-muted-foreground"}`}>
              Home
            </Link>
            <Link href="/browse" className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/browse") ? "text-primary font-bold" : "text-muted-foreground"}`}>
              Browse Homes
            </Link>
            <Link href="/mission" className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/mission") ? "text-primary font-bold" : "text-muted-foreground"}`}>
              Our Mission
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary outline-none ${
                resourceLinks.some(l => isActive(l.href)) ? "text-primary font-bold" : "text-muted-foreground"
              }`}>
                Recovery Resources <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {resourceLinks.map((link) => (
                  <DropdownMenuItem key={link.href} asChild>
                    <Link href={link.href} className="w-full cursor-pointer">
                      {link.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {authenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">Welcome, {user?.name}</span>
                {user?.role === "tenant" && (
                  <>
                    <Link href="/tenant-profile">
                      <Button size="sm" variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
                        My Profile
                      </Button>
                    </Link>
                    <Link href="/tenant-dashboard">
                      <Button size="sm" variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
                        Dashboard
                      </Button>
                    </Link>
                  </>
                )}
                {user?.role === "provider" && (
                  <Link href="/provider-dashboard">
                    <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                      Dashboard
                    </Button>
                  </Link>
                )}
                {user?.role === "admin" && (
                  <Link href="/admin-dashboard">
                    <Button size="sm" className="bg-amber-600 text-white hover:bg-amber-700">
                      Admin Portal
                    </Button>
                  </Link>
                )}
                <Button onClick={handleSignOut} variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-2">
                  <LogOut className="w-4 h-4" /> Sign Out
                </Button>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    Sign In
                  </Button>
                </Link>
                <Link href="/for-tenants">
                  <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                    Sign Up
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
            <SheetContent side="right" className="w-[300px] sm:w-[400px] border-l border-border bg-card overflow-y-auto">
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/" onClick={() => setMenuOpen(false)} className={`text-lg font-medium transition-colors hover:text-primary ${isActive("/") ? "text-primary font-bold" : "text-muted-foreground"}`}>
                  Home
                </Link>
                <Link href="/browse" onClick={() => setMenuOpen(false)} className={`text-lg font-medium transition-colors hover:text-primary ${isActive("/browse") ? "text-primary font-bold" : "text-muted-foreground"}`}>
                  Browse Homes
                </Link>
                <Link href="/mission" onClick={() => setMenuOpen(false)} className={`text-lg font-medium transition-colors hover:text-primary ${isActive("/mission") ? "text-primary font-bold" : "text-muted-foreground"}`}>
                  Our Mission
                </Link>
                
                <Collapsible open={isResourcesOpen} onOpenChange={setIsResourcesOpen} className="space-y-2">
                  <CollapsibleTrigger className={`flex items-center justify-between w-full text-lg font-medium transition-colors hover:text-primary ${
                    resourceLinks.some(l => isActive(l.href)) ? "text-primary" : "text-muted-foreground"
                  }`}>
                    Recovery Resources
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isResourcesOpen ? "rotate-180" : ""}`} />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-2">
                    {resourceLinks.map((link) => (
                      <Link 
                        key={link.href} 
                        href={link.href} 
                        onClick={() => setMenuOpen(false)} 
                        className={`block text-base font-medium pl-4 border-l-2 transition-colors hover:text-primary ${isActive(link.href) ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </CollapsibleContent>
                </Collapsible>

                <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border">
                  {authenticated ? (
                    <>
                      {user?.role === "tenant" && (
                        <>
                          <Link href="/tenant-profile" onClick={() => setMenuOpen(false)}>
                            <Button variant="outline" className="w-full justify-start border-primary/50 text-primary">
                              My Profile
                            </Button>
                          </Link>
                          <Link href="/tenant-dashboard" onClick={() => setMenuOpen(false)}>
                            <Button variant="outline" className="w-full justify-start border-primary/50 text-primary">
                              Tenant Dashboard
                            </Button>
                          </Link>
                        </>
                      )}
                      {user?.role === "provider" && (
                        <Link href="/provider-dashboard" onClick={() => setMenuOpen(false)}>
                          <Button className="w-full justify-start bg-primary text-primary-foreground">
                            Provider Dashboard
                          </Button>
                        </Link>
                      )}
                      {user?.role === "admin" && (
                        <Link href="/admin-dashboard" onClick={() => setMenuOpen(false)}>
                          <Button className="w-full justify-start bg-amber-600 text-white hover:bg-amber-700">
                            Admin Portal
                          </Button>
                        </Link>
                      )}
                      <Button onClick={handleSignOut} className="w-full justify-start gap-2 bg-red-600/20 text-red-500 hover:bg-red-600/30">
                        <LogOut className="w-4 h-4" /> Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href="/login">
                        <Button variant="ghost" className="w-full justify-start" onClick={() => setMenuOpen(false)}>Sign In</Button>
                      </Link>
                      <Link href="/for-tenants">
                        <Button className="w-full justify-start bg-primary text-primary-foreground" onClick={() => setMenuOpen(false)}>
                          Sign Up
                        </Button>
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
                Connecting individuals in recovery with safe, supportive sober living environments.
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
                <li><Link href="/contact" className="hover:text-primary">Contact Us</Link></li>
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


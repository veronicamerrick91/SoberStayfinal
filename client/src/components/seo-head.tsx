import { useEffect } from "react";
import { useLocation } from "wouter";

const BASE_URL = "https://www.soberstayhomes.com";

const NOINDEX_ROUTES = [
  "/login",
  "/signup",
  "/register",
  "/auth",
  "/forgot-password",
  "/reset-password",
  "/admin",
  "/admin-dashboard",
  "/provider-dashboard",
  "/tenant-dashboard",
  "/tenant-profile",
  "/provider-profile",
  "/create-listing",
  "/edit-listing",
  "/apply/",
  "/chat/",
  "/analytics",
  "/seo-tools",
  "/provider-support",
  "/safety-reporting",
  "/liability-waiver",
  "/for-tenants",
];

const PAGE_TITLES: Record<string, string> = {
  "/": "Sober Living Homes Near You | Find Recovery Housing | Sober Stay",
  "/browse": "Browse Sober Living Homes | Compare Recovery Housing | Sober Stay",
  "/quiz": "Find Your Perfect Sober Living Home | Quiz | Sober Stay",
  "/what-is-sober-living": "What Is Sober Living? | Complete Guide | Sober Stay",
  "/resources": "Recovery Resources | Sober Stay",
  "/how-to-choose": "How to Choose a Sober Living Home | Sober Stay",
  "/insurance-info": "Sober Living Insurance Information | Sober Stay",
  "/crisis-resources": "Crisis Resources & Emergency Hotlines | Sober Stay",
  "/blog": "Blog | Recovery Tips & Resources | Sober Stay",
  "/contact": "Contact Us | Sober Stay",
  "/for-providers": "For Sober Living Providers | Sober Stay",
  "/for-tenants": "For People Seeking Sober Living | Sober Stay",
  "/mission": "Our Mission | Sober Stay",
  "/privacy-policy": "Privacy Policy | Sober Stay",
  "/terms-of-use": "Terms of Use | Sober Stay",
  "/disclaimer": "Disclaimer | Sober Stay",
  "/help-center": "Help Center | Sober Stay",
  "/partners": "Partners Directory | Sober Stay",
  "/find-sober-living": "Find Sober Living Near You | Sober Stay",
  "/sober-living-near-me": "Sober Living Near Me | Find Local Recovery Homes | Sober Stay",
};

export function SEOHead() {
  const [location] = useLocation();

  useEffect(() => {
    const shouldNoIndex = NOINDEX_ROUTES.some(route => 
      location === route || location.startsWith(route)
    );

    let robotsTag = document.querySelector('meta[name="robots"]');
    if (!robotsTag) {
      robotsTag = document.createElement("meta");
      robotsTag.setAttribute("name", "robots");
      document.head.appendChild(robotsTag);
    }
    robotsTag.setAttribute("content", shouldNoIndex ? "noindex, nofollow" : "index, follow");

    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement("link");
      canonicalTag.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalTag);
    }
    
    const cleanPath = location.endsWith("/") && location !== "/" 
      ? location.slice(0, -1) 
      : location;
    canonicalTag.setAttribute("href", `${BASE_URL}${cleanPath}`);

    const pageTitle = PAGE_TITLES[location];
    if (pageTitle) {
      document.title = pageTitle;
    }

    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute("content", `${BASE_URL}${cleanPath}`);
    }

  }, [location]);

  return null;
}

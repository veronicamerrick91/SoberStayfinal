import type { Listing } from "@shared/schema";

const BASE_URL = "https://soberstay.com";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function generateBrowsePageHtml(listings: Listing[]): string {
  const listingCards = listings.map(listing => `
    <article itemscope itemtype="https://schema.org/LodgingBusiness">
      <h2 itemprop="name"><a href="/property/${listing.id}">${escapeHtml(listing.propertyName)}</a></h2>
      <p itemprop="address" itemscope itemtype="https://schema.org/PostalAddress">
        <span itemprop="addressLocality">${escapeHtml(listing.city)}</span>, 
        <span itemprop="addressRegion">${escapeHtml(listing.state)}</span>
      </p>
      <p>Price: <span itemprop="priceRange">$${listing.monthlyPrice}/month</span></p>
      <p>Type: ${listing.gender === "mens" ? "Men's" : listing.gender === "womens" ? "Women's" : "Co-ed"} sober living</p>
      <p itemprop="description">${escapeHtml((listing.description || "").slice(0, 200))}...</p>
      <a href="/property/${listing.id}">View Details</a>
    </article>
  `).join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Browse Sober Living Homes | Find Recovery Housing | Sober Stay</title>
  <meta name="description" content="Browse ${listings.length}+ verified sober living homes across the US. Filter by location, price, gender, and amenities. Find your recovery housing today.">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${BASE_URL}/browse">
  <meta property="og:title" content="Browse Sober Living Homes | Sober Stay">
  <meta property="og:description" content="Browse ${listings.length}+ verified sober living homes. Find recovery housing that fits your needs.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${BASE_URL}/browse">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Browse Sober Living Homes | Sober Stay">
  <meta name="twitter:description" content="Browse ${listings.length}+ verified sober living homes. Find recovery housing.">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Sober Living Homes Directory",
    "description": "Browse verified sober living homes across the United States",
    "numberOfItems": ${listings.length},
    "itemListElement": [
      ${listings.slice(0, 10).map((l, i) => `{
        "@type": "ListItem",
        "position": ${i + 1},
        "item": {
          "@type": "LodgingBusiness",
          "name": "${escapeHtml(l.propertyName)}",
          "url": "${BASE_URL}/property/${l.id}"
        }
      }`).join(",\n      ")}
    ]
  }
  </script>
</head>
<body>
  <div id="root">
    <header style="padding: 20px; text-align: center;">
      <h1>Browse Sober Living Homes</h1>
      <p>Find safe, verified recovery housing that fits your needs.</p>
      <nav>
        <a href="/">Home</a> | 
        <a href="/browse">Browse</a> | 
        <a href="/locations">Locations</a> |
        <a href="/for-providers">List Your Home</a>
      </nav>
    </header>
    <main style="padding: 20px; max-width: 1200px; margin: 0 auto;">
      <h2>${listings.length} Sober Living Homes Available</h2>
      <section>
        ${listingCards || "<p>No listings available at this time. Check back soon!</p>"}
      </section>
      <section>
        <h2>Find Sober Living by Location</h2>
        <ul>
          <li><a href="/california-sober-living">Sober Living in California</a></li>
          <li><a href="/los-angeles-ca-sober-living">Sober Living in Los Angeles, CA</a></li>
          <li><a href="/florida-sober-living">Sober Living in Florida</a></li>
          <li><a href="/texas-sober-living">Sober Living in Texas</a></li>
          <li><a href="/arizona-sober-living">Sober Living in Arizona</a></li>
        </ul>
      </section>
    </main>
    <noscript>
      <p>Enable JavaScript for the full interactive experience, or continue browsing the listings above.</p>
    </noscript>
  </div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>`;
}

export function generatePropertyPageHtml(listing: Listing): string {
  const genderLabel = listing.gender === "mens" ? "Men's" : listing.gender === "womens" ? "Women's" : "Co-ed";
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(listing.propertyName)} | ${genderLabel} Sober Living in ${escapeHtml(listing.city)}, ${escapeHtml(listing.state)}</title>
  <meta name="description" content="${escapeHtml(listing.propertyName)} - ${genderLabel} sober living home in ${escapeHtml(listing.city)}, ${escapeHtml(listing.state)}. $${listing.monthlyPrice}/month. ${escapeHtml((listing.description || "Safe, supportive recovery housing.").slice(0, 120))}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${BASE_URL}/property/${listing.id}">
  <meta property="og:title" content="${escapeHtml(listing.propertyName)} | Sober Living in ${escapeHtml(listing.city)}">
  <meta property="og:description" content="${genderLabel} sober living home. $${listing.monthlyPrice}/month. ${escapeHtml((listing.description || "").slice(0, 100))}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${BASE_URL}/property/${listing.id}">
  ${listing.photos && listing.photos[0] ? `<meta property="og:image" content="${listing.photos[0]}">` : ""}
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(listing.propertyName)} | Sober Stay">
  <meta name="twitter:description" content="${genderLabel} sober living in ${escapeHtml(listing.city)}. $${listing.monthlyPrice}/month.">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    "name": "${escapeHtml(listing.propertyName)}",
    "description": "${escapeHtml((listing.description || "Sober living home").replace(/"/g, "'"))}",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "${escapeHtml(listing.address)}",
      "addressLocality": "${escapeHtml(listing.city)}",
      "addressRegion": "${escapeHtml(listing.state)}",
      "addressCountry": "US"
    },
    "priceRange": "$${listing.monthlyPrice}/month",
    "url": "${BASE_URL}/property/${listing.id}"
    ${listing.photos && listing.photos[0] ? `,"image": "${listing.photos[0]}"` : ""}
  }
  </script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {"@type": "ListItem", "position": 1, "name": "Home", "item": "${BASE_URL}"},
      {"@type": "ListItem", "position": 2, "name": "Browse Homes", "item": "${BASE_URL}/browse"},
      {"@type": "ListItem", "position": 3, "name": "${escapeHtml(listing.propertyName)}", "item": "${BASE_URL}/property/${listing.id}"}
    ]
  }
  </script>
</head>
<body>
  <div id="root">
    <header style="padding: 20px;">
      <nav>
        <a href="/">Home</a> &gt; 
        <a href="/browse">Browse Homes</a> &gt; 
        <span>${escapeHtml(listing.propertyName)}</span>
      </nav>
    </header>
    <main style="padding: 20px; max-width: 1000px; margin: 0 auto;" itemscope itemtype="https://schema.org/LodgingBusiness">
      <h1 itemprop="name">${escapeHtml(listing.propertyName)}</h1>
      <p itemprop="address" itemscope itemtype="https://schema.org/PostalAddress">
        <span itemprop="streetAddress">${escapeHtml(listing.address)}</span><br>
        <span itemprop="addressLocality">${escapeHtml(listing.city)}</span>, 
        <span itemprop="addressRegion">${escapeHtml(listing.state)}</span>
      </p>
      
      <section>
        <h2>Pricing</h2>
        <p><strong itemprop="priceRange">$${listing.monthlyPrice}/month</strong></p>
        <p>Room Type: ${escapeHtml(listing.roomType)}</p>
        <p>Total Beds: ${listing.totalBeds}</p>
      </section>
      
      <section>
        <h2>About This Home</h2>
        <p itemprop="description">${escapeHtml(listing.description || "No description provided.")}</p>
        <p><strong>Gender:</strong> ${genderLabel}</p>
        <p><strong>Supervision Type:</strong> ${escapeHtml(listing.supervisionType)}</p>
      </section>
      
      ${listing.amenities && listing.amenities.length > 0 ? `
      <section>
        <h2>Amenities</h2>
        <ul>
          ${listing.amenities.map((a: string) => `<li>${escapeHtml(a)}</li>`).join("\n          ")}
        </ul>
      </section>
      ` : ""}
      
      ${listing.inclusions && listing.inclusions.length > 0 ? `
      <section>
        <h2>What's Included</h2>
        <ul>
          ${listing.inclusions.map((r: string) => `<li>${escapeHtml(r)}</li>`).join("\n          ")}
        </ul>
      </section>
      ` : ""}
      
      <section>
        <h2>Contact</h2>
        <p>Interested in this sober living home? <a href="/apply/${listing.id}">Apply Now</a></p>
      </section>
      
      <section>
        <h2>More Sober Living Homes</h2>
        <p><a href="/browse">Browse all sober living homes</a></p>
        <p><a href="/${listing.state.toLowerCase().replace(/\s+/g, "-")}-sober-living">More homes in ${escapeHtml(listing.state)}</a></p>
      </section>
    </main>
    <noscript>
      <p>Enable JavaScript for the full interactive experience with photos, maps, and online applications.</p>
    </noscript>
  </div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>`;
}

export function generateLocationPageHtml(
  locationName: string, 
  locationType: "city" | "state",
  stateCode: string | undefined,
  description: string,
  listings: Listing[]
): string {
  const urlSlug = `${locationName.toLowerCase().replace(/\s+/g, "-")}${stateCode ? `-${stateCode.toLowerCase()}` : ""}-sober-living`;
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sober Living in ${escapeHtml(locationName)}${stateCode ? `, ${stateCode}` : ""} | Recovery Housing | Sober Stay</title>
  <meta name="description" content="Find verified sober living homes in ${escapeHtml(locationName)}. ${escapeHtml(description.slice(0, 120))}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${BASE_URL}/${urlSlug}">
  <meta property="og:title" content="Sober Living in ${escapeHtml(locationName)} | Sober Stay">
  <meta property="og:description" content="Find verified sober living homes in ${escapeHtml(locationName)}. Browse recovery housing options.">
  <meta property="og:type" content="website">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Sober Living in ${escapeHtml(locationName)}",
    "description": "${escapeHtml(description.slice(0, 200))}",
    "url": "${BASE_URL}/${urlSlug}"
  }
  </script>
</head>
<body>
  <div id="root">
    <header style="padding: 20px; text-align: center;">
      <nav>
        <a href="/">Home</a> &gt; 
        <a href="/locations">Locations</a> &gt; 
        <span>${escapeHtml(locationName)}</span>
      </nav>
      <h1>Sober Living in ${escapeHtml(locationName)}${stateCode ? `, ${stateCode}` : ""}</h1>
      <p>Find verified sober living homes and recovery housing in ${escapeHtml(locationName)}.</p>
    </header>
    <main style="padding: 20px; max-width: 1000px; margin: 0 auto;">
      <section>
        <h2>About Sober Living in ${escapeHtml(locationName)}</h2>
        <p>${escapeHtml(description)}</p>
      </section>
      
      ${listings.length > 0 ? `
      <section>
        <h2>Available Homes in ${escapeHtml(locationName)}</h2>
        ${listings.slice(0, 6).map(l => `
        <article>
          <h3><a href="/property/${l.id}">${escapeHtml(l.propertyName)}</a></h3>
          <p>${escapeHtml(l.city)}, ${escapeHtml(l.state)} - $${l.monthlyPrice}/month</p>
        </article>
        `).join("\n")}
        <p><a href="/browse?location=${encodeURIComponent(locationName)}">View all ${escapeHtml(locationName)} listings</a></p>
      </section>
      ` : ""}
      
      <section>
        <h2>Why Choose ${escapeHtml(locationName)} for Recovery?</h2>
        <p>Finding the right sober living environment is crucial for long-term recovery success. ${escapeHtml(locationName)} offers a supportive community with various housing options to match your needs and budget.</p>
      </section>
    </main>
    <noscript>
      <p>Enable JavaScript for the full interactive experience.</p>
    </noscript>
  </div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>`;
}

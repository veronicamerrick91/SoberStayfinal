// SEO Page definitions with full HTML content for server-side rendering
// Each page has unique meta tags and keyword-rich content that Google can crawl

export interface SEOPage {
  path: string;
  title: string;
  description: string;
  h1: string;
  content: string;
  faqs?: { question: string; answer: string }[];
}

export const seoPages: SEOPage[] = [
  {
    path: "/",
    title: "Sober Stay — Find Sober Living Homes & Recovery Housing Near You",
    description: "Find sober living homes and supportive recovery housing with Sober Stay. Browse verified listings, resources, and guides for addiction recovery. Start your journey today.",
    h1: "Find Sober Living Homes Near You",
    content: `
      <p class="lead">Sober Stay connects individuals seeking recovery housing with verified sober living providers across the United States. Whether you're leaving treatment, seeking a fresh start, or supporting a loved one, we're here to help you find safe, structured housing for lasting sobriety.</p>
      
      <section>
        <h2>What Is Sober Living?</h2>
        <p>Sober living homes provide a safe, substance-free environment for individuals in recovery from addiction. These residences bridge the gap between intensive treatment programs and independent living, offering peer support, accountability, and structure during a crucial time in recovery.</p>
        <p>Unlike treatment centers, sober living homes allow residents to work, attend school, and gradually rebuild their lives while maintaining sobriety. Most homes require abstinence from alcohol and drugs, participation in house meetings, and contribution to household responsibilities.</p>
      </section>

      <section>
        <h2>Why Choose Sober Stay?</h2>
        <ul>
          <li><strong>Verified Listings:</strong> Every sober living home on our platform is reviewed for quality and safety standards.</li>
          <li><strong>Nationwide Coverage:</strong> Find recovery housing in any state, from California to New York and everywhere in between.</li>
          <li><strong>Easy Search:</strong> Filter by location, price, amenities, gender, and more to find your perfect match.</li>
          <li><strong>Direct Connection:</strong> Contact providers directly, schedule tours, and submit applications online.</li>
        </ul>
      </section>

      <section>
        <h2>Browse Sober Living Homes</h2>
        <p>Search our directory of verified sober living homes across the United States. Whether you need a men's sober living home in Los Angeles, a women's recovery residence in Florida, or a co-ed house in Texas, Sober Stay helps you find the right fit for your recovery journey.</p>
        <p>Our listings include detailed information about amenities, house rules, costs, and photos so you can make an informed decision about your next home.</p>
      </section>

      <section>
        <h2>Resources for Recovery</h2>
        <p>Beyond housing, Sober Stay offers guides and resources to support your recovery:</p>
        <ul>
          <li>How to choose the right sober living home</li>
          <li>Understanding insurance coverage for recovery housing</li>
          <li>Crisis resources and support hotlines</li>
          <li>Tips for transitioning to independent living</li>
        </ul>
      </section>

      <section>
        <h2>For Sober Living Providers</h2>
        <p>Are you a sober living operator? List your property on Sober Stay to connect with individuals actively seeking recovery housing. Our platform helps you reach qualified residents while showcasing your home's unique features and services.</p>
      </section>
    `
  },
  {
    path: "/sober-living-near-me",
    title: "Sober Living Near Me — Find Local Recovery Housing | Sober Stay",
    description: "Search for sober living homes near you. Find verified, safe recovery housing in your area with peer support, structure, and accountability for lasting sobriety.",
    h1: "Sober Living Near Me",
    content: `
      <p class="lead">Find safe, verified sober living homes in your area. Start your search today and take the next step in your recovery journey.</p>

      <section>
        <h2>Finding the Right Sober Living Home in Your Area</h2>
        <p>When you're searching for "sober living near me," you're taking an important step toward lasting recovery. Sober living homes provide a crucial bridge between intensive treatment and independent living, offering the structure and support you need while rebuilding your life. At Sober Stay, we make it easy to find verified, quality sober living homes in your community.</p>
        <p>The transition from treatment to everyday life can be challenging. Sober living homes offer a safe, substance-free environment where you can practice the skills you've learned while having access to peer support and accountability. Whether you're leaving a residential treatment program, completing outpatient therapy, or simply need a fresh start, finding the right sober living home near you is essential for your continued success.</p>
      </section>

      <section>
        <h2>What to Expect from Sober Living Homes</h2>
        <p>Sober living homes vary in their structure, rules, and amenities, but most share common elements designed to support recovery. Residents typically live together in a house-like setting, sharing responsibilities such as cooking, cleaning, and maintaining the home. This communal living arrangement fosters accountability and helps residents develop life skills essential for independent living.</p>
        <p>Most sober living homes require residents to abstain from alcohol and drugs, participate in regular drug testing, attend house meetings, and contribute to household chores. Many also encourage or require attendance at 12-step meetings or other recovery support groups. Some homes offer additional services such as case management, employment assistance, or connections to outpatient treatment.</p>
      </section>

      <section>
        <h2>Benefits of Sober Living</h2>
        <ul>
          <li><strong>Safe Environment:</strong> Substance-free homes with regular drug testing and clear house rules to maintain a recovery-focused atmosphere.</li>
          <li><strong>Peer Support:</strong> Live alongside others who understand your journey and can offer encouragement and accountability.</li>
          <li><strong>Convenient Locations:</strong> Find homes near work, school, family, or recovery meetings to support your daily routine.</li>
          <li><strong>Structured Support:</strong> House meetings, curfews, and accountability measures help maintain focus on recovery goals.</li>
        </ul>
      </section>

      <section>
        <h2>How to Search for Sober Living Homes</h2>
        <p>Finding the right sober living home requires research and careful consideration. Start by determining your needs: What's your budget? Do you prefer a gender-specific home? What amenities are important to you? Are you looking for a home that accepts pets or allows couples? Once you know what you're looking for, use Sober Stay to search for homes that match your criteria.</p>
        <p>When evaluating potential homes, consider visiting in person if possible. This allows you to meet current residents and staff, see the living conditions, and get a feel for the community atmosphere. Ask questions about house rules, costs, what's included in the rent, and what additional services are available. Trust your instincts – the right home should feel supportive and welcoming.</p>
      </section>

      <section>
        <h2>Benefits of Local Sober Living</h2>
        <p>Choosing a sober living home in your local area offers several advantages. You can maintain connections with family, friends, and existing support networks. You may be able to continue working at your current job or attending your regular recovery meetings. Familiarity with the area can reduce stress and make the transition easier.</p>
        <p>However, some people benefit from relocating to a new area for a fresh start. If your local environment is triggering or lacks adequate recovery resources, moving to a different city might be the right choice. Sober Stay can help you find quality homes regardless of location, whether you're staying close to home or exploring new possibilities.</p>
      </section>
    `,
    faqs: [
      { question: "How do I find sober living homes near me?", answer: "Use Sober Stay's search feature to browse verified sober living homes in your area. Simply enter your city, state, or zip code to see available options. You can filter by price, gender, amenities, and more to find the perfect fit for your recovery journey." },
      { question: "What should I look for in a sober living home?", answer: "Key factors include location, cost, house rules, available amenities, staff qualifications, and the overall community atmosphere. Look for homes that offer structured programs, drug testing policies, and support for your specific recovery needs." },
      { question: "How much does sober living cost?", answer: "Sober living costs vary widely depending on location, amenities, and level of support. Prices typically range from $500 to $2,500 per month. Some homes accept insurance or offer sliding scale fees based on income." },
      { question: "What's the difference between sober living and a halfway house?", answer: "While often used interchangeably, halfway houses are typically government-funded and may be court-mandated, while sober living homes are privately operated and voluntary. Sober living homes often offer more flexibility and amenities but may cost more." },
      { question: "Can I work while living in a sober living home?", answer: "Yes, most sober living homes encourage residents to work or attend school. Employment is often a requirement after an initial adjustment period, as it helps build responsibility and financial independence during recovery." },
      { question: "How long can I stay in a sober living home?", answer: "Length of stay varies by individual needs and house policies. Some residents stay for a few months, while others may stay for a year or longer. There's typically no maximum time limit as long as you follow house rules and pay rent." }
    ]
  },
  {
    path: "/what-is-sober-living",
    title: "What Is Sober Living? Complete Guide to Recovery Housing | Sober Stay",
    description: "Learn what sober living homes are, how they work, and who can benefit. Comprehensive guide to transitional recovery housing, rules, costs, and finding the right fit.",
    h1: "What Is Sober Living?",
    content: `
      <p class="lead">Sober living homes are residential facilities that provide a supportive, substance-free environment for individuals recovering from addiction. Learn everything you need to know about this crucial step in the recovery journey.</p>

      <section>
        <h2>Understanding Sober Living Homes</h2>
        <p>Sober living homes, also known as sober houses or recovery residences, are group living environments for people recovering from substance use disorders. Unlike treatment centers or rehabilitation facilities, sober living homes don't typically provide clinical services. Instead, they offer a structured, supportive living arrangement that bridges the gap between intensive treatment and fully independent living.</p>
        <p>These homes serve as transitional housing where residents can practice the skills they've learned in treatment while gradually reintegrating into society. The primary goal is to provide a safe, alcohol-free and drug-free environment where individuals can focus on their recovery without the triggers and temptations of their previous living situations.</p>
      </section>

      <section>
        <h2>How Sober Living Works</h2>
        <p>Sober living homes operate on a peer-support model. Residents live together in a house-like setting, sharing common spaces and responsibilities. Most homes have house managers or staff who oversee daily operations and enforce house rules, but residents are largely self-governing.</p>
        <p>Daily life in a sober living home typically includes:</p>
        <ul>
          <li>Maintaining sobriety and submitting to regular drug testing</li>
          <li>Attending house meetings (often weekly)</li>
          <li>Participating in household chores and maintenance</li>
          <li>Following curfews and guest policies</li>
          <li>Working, attending school, or actively seeking employment</li>
          <li>Attending 12-step meetings or other recovery support groups</li>
        </ul>
      </section>

      <section>
        <h2>Who Benefits from Sober Living?</h2>
        <p>Sober living homes can benefit anyone in recovery, but they're particularly helpful for:</p>
        <ul>
          <li><strong>People leaving treatment:</strong> Those completing residential treatment or intensive outpatient programs who need continued support</li>
          <li><strong>Individuals without stable housing:</strong> Those whose previous living situation isn't conducive to recovery</li>
          <li><strong>People seeking structure:</strong> Those who need accountability and routine to maintain sobriety</li>
          <li><strong>Those building new connections:</strong> Individuals who want to surround themselves with others committed to recovery</li>
        </ul>
      </section>

      <section>
        <h2>Types of Sober Living Homes</h2>
        <p>Sober living homes vary widely in their structure, rules, and amenities. The National Alliance for Recovery Residences (NARR) classifies them into four levels:</p>
        <ul>
          <li><strong>Level 1 (Peer-run):</strong> Democratically run homes with minimal structure</li>
          <li><strong>Level 2 (Monitored):</strong> Homes with a house manager and more defined rules</li>
          <li><strong>Level 3 (Supervised):</strong> Homes with paid staff and administrative oversight</li>
          <li><strong>Level 4 (Service Provider):</strong> Homes offering clinical services and licensed staff</li>
        </ul>
      </section>

      <section>
        <h2>Sober Living vs. Other Recovery Housing</h2>
        <p>It's important to understand how sober living homes differ from other types of recovery housing:</p>
        <ul>
          <li><strong>Halfway Houses:</strong> Often government-funded and may be mandated by courts; may have stricter rules and shorter stays</li>
          <li><strong>Oxford Houses:</strong> Self-supporting, democratically run homes with no paid staff; residents must be employed</li>
          <li><strong>Treatment Centers:</strong> Provide clinical services and medical supervision; typically more expensive with shorter stays</li>
        </ul>
      </section>

      <section>
        <h2>Cost of Sober Living</h2>
        <p>Sober living costs vary based on location, amenities, and level of support. Monthly costs typically range from $500 to $2,500 or more. Factors affecting price include:</p>
        <ul>
          <li>Geographic location (urban areas tend to be more expensive)</li>
          <li>Amenities (private rooms, fitness facilities, pools)</li>
          <li>Level of support and services provided</li>
          <li>Whether meals are included</li>
        </ul>
        <p>Some sober living homes accept insurance or offer scholarships. Many also offer sliding scale fees based on income.</p>
      </section>
    `,
    faqs: [
      { question: "What is a sober living home?", answer: "A sober living home is a residential facility that provides a safe, substance-free living environment for people in recovery from addiction. Residents live together in a supportive community while working, attending school, or seeking employment." },
      { question: "How is sober living different from rehab?", answer: "Rehab (treatment centers) provide clinical services like therapy and medical care. Sober living homes focus on peer support and independent living skills. Many people transition from rehab to sober living as a next step in recovery." },
      { question: "Do I need to go to treatment before sober living?", answer: "Not necessarily. While many residents come from treatment programs, sober living homes also accept people who haven't been in formal treatment. The key requirement is a commitment to sobriety." },
      { question: "What are the rules in sober living homes?", answer: "Common rules include maintaining sobriety, submitting to drug tests, attending house meetings, doing chores, following curfews, and paying rent on time. Rules vary by home." },
      { question: "Is sober living covered by insurance?", answer: "Some sober living homes accept insurance, particularly those that offer additional services. Many homes are self-pay only. Check with individual homes about payment options and financial assistance." }
    ]
  },
  {
    path: "/apply-for-sober-living",
    title: "Apply for Sober Living — How to Get Into Recovery Housing | Sober Stay",
    description: "Learn how to apply for sober living homes. Step-by-step guide covering applications, requirements, interviews, and what to expect when moving into recovery housing.",
    h1: "Apply for Sober Living",
    content: `
      <p class="lead">Ready to take the next step in your recovery journey? Learn everything you need to know about applying for sober living homes, from requirements to the application process.</p>

      <section>
        <h2>How to Apply for Sober Living</h2>
        <p>Applying for a sober living home is an important step toward building a foundation for lasting recovery. The process varies by home, but typically involves several key steps: researching homes, completing an application, interviewing, and moving in. Understanding what to expect can help you feel prepared and confident as you take this important step.</p>
        <p>At Sober Stay, we simplify the process by connecting you directly with verified sober living providers. You can browse listings, compare options, and submit applications through our platform.</p>
      </section>

      <section>
        <h2>Requirements for Sober Living</h2>
        <p>While requirements vary by home, most sober living residences have common admission criteria:</p>
        <ul>
          <li><strong>Commitment to Sobriety:</strong> You must be willing to abstain from alcohol and drugs</li>
          <li><strong>Recent Treatment or Recovery:</strong> Many homes require recent completion of treatment or demonstrated commitment to recovery</li>
          <li><strong>Ability to Pay:</strong> You'll need to afford monthly rent (typically due at move-in)</li>
          <li><strong>Willingness to Follow Rules:</strong> You must agree to house rules including drug testing, curfews, and chores</li>
          <li><strong>Work or School Commitment:</strong> Most homes require employment, school, or active job search</li>
        </ul>
      </section>

      <section>
        <h2>The Application Process</h2>
        <p>Here's what to expect when applying for sober living:</p>
        <ol>
          <li><strong>Research:</strong> Browse listings on Sober Stay to find homes that match your needs and budget</li>
          <li><strong>Contact:</strong> Reach out to homes you're interested in to ask questions and schedule a tour</li>
          <li><strong>Tour:</strong> Visit the home to meet staff and residents, see the living space, and get a feel for the community</li>
          <li><strong>Apply:</strong> Complete the application, which may include personal information, recovery history, and references</li>
          <li><strong>Interview:</strong> Many homes conduct phone or in-person interviews to ensure you're a good fit</li>
          <li><strong>Move In:</strong> Once accepted, you'll pay deposits and first month's rent, sign agreements, and move in</li>
        </ol>
      </section>

      <section>
        <h2>What to Bring to Sober Living</h2>
        <p>When moving into a sober living home, you'll typically need:</p>
        <ul>
          <li>Valid government ID</li>
          <li>Payment for deposits and first month's rent</li>
          <li>Proof of income or employment (if applicable)</li>
          <li>Personal belongings and clothing</li>
          <li>Toiletries and personal care items</li>
          <li>Any prescribed medications in original containers</li>
        </ul>
        <p>Most homes provide bedding and basic furnishings, but check with your specific home about what's included.</p>
      </section>

      <section>
        <h2>Tips for a Successful Application</h2>
        <ul>
          <li><strong>Be Honest:</strong> Disclose your recovery history and any concerns upfront</li>
          <li><strong>Ask Questions:</strong> Learn about house rules, costs, and expectations before committing</li>
          <li><strong>Have References Ready:</strong> Treatment counselors, sponsors, or employers can vouch for your commitment</li>
          <li><strong>Visit First:</strong> Tour the home to ensure it's the right fit for you</li>
          <li><strong>Prepare Financially:</strong> Have deposits and first month's rent ready</li>
        </ul>
      </section>

      <section>
        <h2>Financial Assistance Options</h2>
        <p>If cost is a barrier, explore these options:</p>
        <ul>
          <li>Sliding scale fees based on income</li>
          <li>Scholarships offered by some sober living homes</li>
          <li>Payment plans for deposits</li>
          <li>Insurance coverage (some homes accept Medicaid or private insurance)</li>
          <li>State or county assistance programs</li>
        </ul>
      </section>
    `,
    faqs: [
      { question: "How do I apply for sober living?", answer: "Search for homes on Sober Stay, contact ones you're interested in, tour the property, complete their application, and interview. Once accepted, pay deposits and move in." },
      { question: "What do I need to get into sober living?", answer: "Typically you need a commitment to sobriety, ability to pay rent, willingness to follow house rules, and often recent treatment or recovery experience. Requirements vary by home." },
      { question: "How long does the application process take?", answer: "The process can take anywhere from a few days to a couple of weeks, depending on the home's availability and your readiness. Some homes can accommodate same-day or next-day move-ins for urgent situations." },
      { question: "Can I apply if I'm still in treatment?", answer: "Yes! Many people apply while still in treatment to ensure a smooth transition. It's a good idea to start your search 2-4 weeks before your expected discharge date." },
      { question: "What if I'm rejected from a sober living home?", answer: "If one home isn't the right fit, don't give up. There are many options available. Ask for feedback, address any concerns, and continue your search with other homes that may be better suited to your situation." }
    ]
  },
  {
    path: "/sober-living-california",
    title: "Sober Living California — Find Recovery Homes in CA | Sober Stay",
    description: "Find sober living homes in California. Browse verified recovery housing in Los Angeles, San Diego, San Francisco, Orange County and throughout CA. Start your search today.",
    h1: "Sober Living California",
    content: `
      <p class="lead">California is home to thousands of sober living homes, from sunny San Diego to the Bay Area. Find your perfect recovery residence in the Golden State with Sober Stay.</p>

      <section>
        <h2>Sober Living Homes in California</h2>
        <p>California has one of the largest networks of sober living homes in the United States. With its year-round pleasant weather, diverse communities, and extensive recovery resources, California is an ideal location for individuals seeking a supportive environment for their recovery journey.</p>
        <p>Whether you're looking for sober living in Los Angeles, San Diego, San Francisco, Orange County, or anywhere else in California, Sober Stay connects you with verified, quality recovery housing throughout the state.</p>
      </section>

      <section>
        <h2>Popular California Sober Living Locations</h2>
        <ul>
          <li><strong>Los Angeles:</strong> The largest city in California offers hundreds of sober living options, from Hollywood to the beach communities</li>
          <li><strong>San Diego:</strong> Known for its beautiful weather and strong recovery community</li>
          <li><strong>Orange County:</strong> Home to many upscale sober living homes with excellent amenities</li>
          <li><strong>San Francisco Bay Area:</strong> Diverse options in a culturally rich environment</li>
          <li><strong>Sacramento:</strong> California's capital offers affordable sober living options</li>
          <li><strong>Inland Empire:</strong> Growing recovery community with budget-friendly housing</li>
        </ul>
      </section>

      <section>
        <h2>Why Choose California for Sober Living?</h2>
        <p>California offers unique advantages for those in recovery:</p>
        <ul>
          <li><strong>Climate:</strong> Year-round mild weather supports outdoor activities and wellness</li>
          <li><strong>Recovery Culture:</strong> Strong AA and NA communities with meetings available 24/7</li>
          <li><strong>Employment:</strong> Diverse job market across multiple industries</li>
          <li><strong>Treatment Options:</strong> Access to world-class treatment centers and outpatient programs</li>
          <li><strong>Lifestyle:</strong> Beach access, hiking, and outdoor recreation support healthy living</li>
        </ul>
      </section>

      <section>
        <h2>California Sober Living Costs</h2>
        <p>Costs for sober living in California vary significantly by location:</p>
        <ul>
          <li><strong>Los Angeles/Orange County:</strong> $1,200 - $3,500/month</li>
          <li><strong>San Diego:</strong> $1,000 - $2,500/month</li>
          <li><strong>San Francisco Bay Area:</strong> $1,500 - $4,000/month</li>
          <li><strong>Inland Empire:</strong> $800 - $1,800/month</li>
          <li><strong>Central Valley:</strong> $600 - $1,500/month</li>
        </ul>
        <p>Prices depend on location, amenities, private vs. shared rooms, and level of support provided.</p>
      </section>

      <section>
        <h2>California Sober Living Regulations</h2>
        <p>California has specific regulations governing sober living homes. The California Department of Health Care Services (DHCS) provides voluntary certification for recovery residences. While certification isn't required, it indicates a home meets quality standards.</p>
        <p>When searching for sober living in California, look for homes that are certified or affiliated with recognized organizations like the California Association of Addiction Recovery Resources (CAARR) or the National Alliance for Recovery Residences (NARR).</p>
      </section>

      <section>
        <h2>Finding the Right California Sober Living Home</h2>
        <p>With so many options in California, finding the right sober living home can feel overwhelming. Consider these factors:</p>
        <ul>
          <li><strong>Location:</strong> Do you want to be near family, work, or start fresh in a new area?</li>
          <li><strong>Budget:</strong> How much can you afford monthly?</li>
          <li><strong>Gender:</strong> Do you prefer men's only, women's only, or co-ed?</li>
          <li><strong>Amenities:</strong> What's important to you (pool, gym, private room)?</li>
          <li><strong>Structure:</strong> How much accountability and support do you need?</li>
        </ul>
        <p>Use Sober Stay to search and compare California sober living homes, read reviews, and connect directly with providers.</p>
      </section>
    `,
    faqs: [
      { question: "How much is sober living in California?", answer: "California sober living costs range from $600 to $4,000+ per month depending on location, amenities, and level of support. Coastal areas like LA and San Francisco tend to be more expensive than inland regions." },
      { question: "Is sober living in California regulated?", answer: "California has voluntary certification through the Department of Health Care Services, but it's not required. Look for homes certified by DHCS or affiliated with organizations like CAARR or NARR for quality assurance." },
      { question: "Where is the best place for sober living in California?", answer: "The 'best' location depends on your needs. Orange County and San Diego are popular for their recovery communities. LA offers the most options. Inland areas provide more affordable housing." },
      { question: "Can I use Medi-Cal for sober living in California?", answer: "Some sober living homes in California accept Medi-Cal, particularly those offering additional services. However, many are self-pay only. Check with individual homes about payment options." },
      { question: "How do I find sober living in Los Angeles?", answer: "Use Sober Stay to search for sober living homes in Los Angeles and surrounding areas. Filter by neighborhood, price, gender, and amenities to find homes that match your needs." }
    ]
  },
  {
    path: "/browse",
    title: "Browse Sober Living Homes — Search Recovery Housing Directory | Sober Stay",
    description: "Search our directory of verified sober living homes. Filter by location, price, gender, and amenities to find the perfect recovery housing for your needs.",
    h1: "Browse Sober Living Homes",
    content: `
      <p class="lead">Search our comprehensive directory of verified sober living homes across the United States. Find safe, supportive recovery housing that fits your needs and budget.</p>
      
      <section>
        <h2>Find Your Recovery Home</h2>
        <p>Sober Stay's directory features sober living homes from coast to coast. Whether you're looking for housing in California, Florida, Texas, or anywhere in between, our search tools help you find the right fit.</p>
        <p>Use our filters to narrow your search by location, monthly cost, gender (men's, women's, or co-ed), amenities, and more. Each listing includes photos, detailed descriptions, house rules, and direct contact information.</p>
      </section>

      <section>
        <h2>What You'll Find</h2>
        <ul>
          <li>Verified sober living homes with quality standards</li>
          <li>Detailed photos and property descriptions</li>
          <li>Pricing and what's included</li>
          <li>Amenities like private rooms, pools, gyms</li>
          <li>House rules and expectations</li>
          <li>Direct contact with providers</li>
        </ul>
      </section>

      <section>
        <h2>Start Your Search</h2>
        <p>Enter your desired location, set your budget, and browse available homes. When you find options you like, reach out directly to schedule a tour and learn more about the community.</p>
      </section>
    `
  }
];

// Generate HTML template for a page
export function generateSEOHtml(page: SEOPage, baseHtml: string): string {
  // Replace title
  let html = baseHtml.replace(
    /<title>.*?<\/title>/,
    `<title>${page.title}</title>`
  );
  
  // Replace meta description
  html = html.replace(
    /<meta name="description" content="[^"]*">/,
    `<meta name="description" content="${page.description}">`
  );
  
  // Replace og:title
  html = html.replace(
    /<meta property="og:title" content="[^"]*"/,
    `<meta property="og:title" content="${page.title}"`
  );
  
  // Replace og:description
  html = html.replace(
    /<meta property="og:description" content="[^"]*"/,
    `<meta property="og:description" content="${page.description}"`
  );
  
  // Replace twitter:title
  html = html.replace(
    /<meta name="twitter:title" content="[^"]*"/,
    `<meta name="twitter:title" content="${page.title}"`
  );
  
  // Replace twitter:description
  html = html.replace(
    /<meta name="twitter:description" content="[^"]*"/,
    `<meta name="twitter:description" content="${page.description}"`
  );

  // Generate FAQ schema if FAQs exist
  let faqSchema = '';
  if (page.faqs && page.faqs.length > 0) {
    const faqItems = page.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }));
    faqSchema = `
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": ${JSON.stringify(faqItems)}
    }
    </script>`;
  }

  // Build the SEO content HTML
  const seoContent = `
    <div id="seo-content" style="font-family: system-ui, -apple-system, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px 20px; color: #e5e7eb; background: #0f172a;">
      <header style="margin-bottom: 32px;">
        <h1 style="font-size: 2.5rem; font-weight: bold; color: white; margin-bottom: 16px; line-height: 1.2;">${page.h1}</h1>
      </header>
      <main style="line-height: 1.8;">
        ${page.content}
      </main>
      ${page.faqs ? `
      <section style="margin-top: 48px;">
        <h2 style="font-size: 1.75rem; font-weight: bold; color: white; margin-bottom: 24px;">Frequently Asked Questions</h2>
        ${page.faqs.map(faq => `
        <div style="margin-bottom: 24px; padding: 20px; background: #1e293b; border-radius: 8px;">
          <h3 style="font-size: 1.125rem; font-weight: 600; color: white; margin-bottom: 8px;">${faq.question}</h3>
          <p style="color: #9ca3af;">${faq.answer}</p>
        </div>
        `).join('')}
      </section>
      ` : ''}
      <noscript>
        <p style="padding: 20px; background: #1e293b; border-radius: 8px; margin-top: 32px;">
          Please enable JavaScript to use the full features of Sober Stay. 
          <a href="/browse" style="color: #10b981;">Browse sober living homes</a> | 
          <a href="/what-is-sober-living" style="color: #10b981;">Learn about sober living</a>
        </p>
      </noscript>
    </div>
    <style>
      #seo-content section { margin-bottom: 32px; }
      #seo-content h2 { font-size: 1.5rem; font-weight: bold; color: white; margin: 32px 0 16px; }
      #seo-content p { margin-bottom: 16px; color: #9ca3af; }
      #seo-content p.lead { font-size: 1.25rem; color: #d1d5db; }
      #seo-content ul, #seo-content ol { margin: 16px 0; padding-left: 24px; color: #9ca3af; }
      #seo-content li { margin-bottom: 8px; }
      #seo-content strong { color: #e5e7eb; }
      #seo-content a { color: #10b981; }
    </style>
  `;

  // Insert SEO content into the root div (React will replace this when it loads)
  html = html.replace(
    /<div id="root">[\s\S]*?<\/div>/,
    `<div id="root">${seoContent}</div>`
  );

  // Add FAQ schema before closing head
  if (faqSchema) {
    html = html.replace('</head>', `${faqSchema}\n  </head>`);
  }

  return html;
}

// Get SEO page by path
export function getSEOPage(path: string): SEOPage | undefined {
  return seoPages.find(page => page.path === path);
}

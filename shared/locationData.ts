export interface LocationInfo {
  slug: string;
  name: string;
  type: "state" | "city";
  stateCode?: string;
  parentState?: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
}

export const US_STATES: LocationInfo[] = [
  {
    slug: "california",
    name: "California",
    type: "state",
    stateCode: "CA",
    description: "California leads the nation in recovery housing options, from beachside communities in Southern California to urban centers in the Bay Area. The Golden State offers year-round sunshine, diverse recovery communities, and world-class treatment resources. With the largest number of sober living homes in the United States, California provides options for every budget and preference.",
    metaTitle: "Sober Living Homes in California | Sober Stay",
    metaDescription: "Find verified sober living homes in California. Browse recovery housing in Los Angeles, San Diego, San Francisco, and more. Start your recovery journey today."
  },
  {
    slug: "florida",
    name: "Florida",
    type: "state",
    stateCode: "FL",
    description: "Florida has earned the nickname 'Recovery Capital of America' due to its extensive network of treatment centers and sober living homes. From South Florida's thriving recovery community in Delray Beach to Tampa Bay and Jacksonville, the Sunshine State offers year-round warm weather and diverse recovery options for everyone.",
    metaTitle: "Sober Living Homes in Florida | Sober Stay",
    metaDescription: "Find verified sober living homes in Florida. Browse recovery housing in Miami, Tampa, Delray Beach, and more. Year-round warm weather for your recovery."
  },
  {
    slug: "texas",
    name: "Texas",
    type: "state",
    stateCode: "TX",
    description: "Texas offers a growing network of sober living homes across its major cities. With a lower cost of living than coastal states and strong community values, Texas provides excellent recovery opportunities. From Houston to Dallas, Austin to San Antonio, find affordable quality recovery housing in the Lone Star State.",
    metaTitle: "Sober Living Homes in Texas | Sober Stay",
    metaDescription: "Find verified sober living homes in Texas. Browse affordable recovery housing in Houston, Dallas, Austin, and more. Strong recovery communities statewide."
  },
  {
    slug: "arizona",
    name: "Arizona",
    type: "state",
    stateCode: "AZ",
    description: "Arizona has become a premier destination for recovery, particularly the Phoenix and Scottsdale areas. The desert landscape and wellness-focused culture create an ideal environment for healing. Year-round sunshine and world-class treatment facilities make Arizona a top choice for those seeking sober living.",
    metaTitle: "Sober Living Homes in Arizona | Sober Stay",
    metaDescription: "Find verified sober living homes in Arizona. Browse recovery housing in Phoenix, Scottsdale, Tucson, and more. Desert wellness for your recovery journey."
  },
  {
    slug: "new-york",
    name: "New York",
    type: "state",
    stateCode: "NY",
    description: "New York offers diverse recovery options from the bustling streets of NYC to peaceful upstate communities. The state has a long history of recovery support with extensive 12-step traditions dating back to the origins of AA. Find sober living homes throughout the Empire State.",
    metaTitle: "Sober Living Homes in New York | Sober Stay",
    metaDescription: "Find verified sober living homes in New York. Browse recovery housing in NYC, Long Island, and upstate. Strong 12-step traditions and diverse communities."
  },
  {
    slug: "colorado",
    name: "Colorado",
    type: "state",
    stateCode: "CO",
    description: "Colorado offers a unique combination of outdoor lifestyle, growing job market, and supportive recovery community. From Denver to Boulder, the state's clean mountain air and active culture naturally support wellness and sobriety. Find sober living homes amid stunning natural beauty.",
    metaTitle: "Sober Living Homes in Colorado | Sober Stay",
    metaDescription: "Find verified sober living homes in Colorado. Browse recovery housing in Denver, Boulder, and more. Mountain lifestyle for your recovery journey."
  },
  {
    slug: "washington",
    name: "Washington",
    type: "state",
    stateCode: "WA",
    description: "Washington offers a progressive recovery community with diverse approaches to sobriety. The Pacific Northwest lifestyle emphasizes wellness, nature, and holistic recovery methods alongside traditional 12-step programs. Seattle and surrounding areas provide quality sober living options.",
    metaTitle: "Sober Living Homes in Washington | Sober Stay",
    metaDescription: "Find verified sober living homes in Washington. Browse recovery housing in Seattle, Tacoma, and more. Pacific Northwest wellness for recovery."
  },
  {
    slug: "illinois",
    name: "Illinois",
    type: "state",
    stateCode: "IL",
    description: "Illinois offers one of the strongest recovery communities in the Midwest, centered around Chicago. With deep roots in 12-step traditions and a diverse range of sober living options, the state provides affordable quality recovery housing with excellent support networks.",
    metaTitle: "Sober Living Homes in Illinois | Sober Stay",
    metaDescription: "Find verified sober living homes in Illinois. Browse recovery housing in Chicago and surrounding areas. Midwest hospitality for your recovery."
  },
  {
    slug: "ohio",
    name: "Ohio",
    type: "state",
    stateCode: "OH",
    description: "Ohio has developed strong recovery resources in response to the opioid crisis, with growing networks of sober living homes across Cleveland, Columbus, and Cincinnati. The state offers affordable housing options and supportive recovery communities throughout.",
    metaTitle: "Sober Living Homes in Ohio | Sober Stay",
    metaDescription: "Find verified sober living homes in Ohio. Browse recovery housing in Columbus, Cleveland, Cincinnati, and more. Affordable Midwest recovery options."
  },
  {
    slug: "pennsylvania",
    name: "Pennsylvania",
    type: "state",
    stateCode: "PA",
    description: "Pennsylvania offers diverse recovery options from Philadelphia's urban recovery community to Pittsburgh and smaller cities throughout the state. With a strong emphasis on community support and accessible treatment, PA provides quality sober living for all backgrounds.",
    metaTitle: "Sober Living Homes in Pennsylvania | Sober Stay",
    metaDescription: "Find verified sober living homes in Pennsylvania. Browse recovery housing in Philadelphia, Pittsburgh, and more. Strong community support for recovery."
  },
  {
    slug: "georgia",
    name: "Georgia",
    type: "state",
    stateCode: "GA",
    description: "Georgia's recovery community is centered around Atlanta, with growing options throughout the state. The South's hospitality extends to recovery housing, offering welcoming environments with affordable costs and strong support networks.",
    metaTitle: "Sober Living Homes in Georgia | Sober Stay",
    metaDescription: "Find verified sober living homes in Georgia. Browse recovery housing in Atlanta and beyond. Southern hospitality for your recovery journey."
  },
  {
    slug: "north-carolina",
    name: "North Carolina",
    type: "state",
    stateCode: "NC",
    description: "North Carolina offers growing recovery resources from Charlotte to Raleigh and the scenic mountain and coastal communities. The state combines Southern hospitality with progressive recovery approaches and affordable living costs.",
    metaTitle: "Sober Living Homes in North Carolina | Sober Stay",
    metaDescription: "Find verified sober living homes in North Carolina. Browse recovery housing in Charlotte, Raleigh, and more. Mountains to coast recovery options."
  },
  {
    slug: "new-jersey",
    name: "New Jersey",
    type: "state",
    stateCode: "NJ",
    description: "New Jersey offers robust recovery resources with proximity to major cities like New York and Philadelphia. The Garden State has strong recovery communities with diverse sober living options from the shore to suburban areas.",
    metaTitle: "Sober Living Homes in New Jersey | Sober Stay",
    metaDescription: "Find verified sober living homes in New Jersey. Browse recovery housing throughout the Garden State. Convenient access to major recovery resources."
  },
  {
    slug: "massachusetts",
    name: "Massachusetts",
    type: "state",
    stateCode: "MA",
    description: "Massachusetts has a long history in recovery, with Boston being home to some of the earliest organized recovery movements. The state offers excellent healthcare resources, strong insurance coverage, and supportive sober living environments.",
    metaTitle: "Sober Living Homes in Massachusetts | Sober Stay",
    metaDescription: "Find verified sober living homes in Massachusetts. Browse recovery housing in Boston and beyond. Historic recovery community with excellent resources."
  },
  {
    slug: "nevada",
    name: "Nevada",
    type: "state",
    stateCode: "NV",
    description: "Nevada offers unique recovery opportunities, particularly in Las Vegas and Reno. Despite the state's reputation for entertainment, strong recovery communities thrive here with sober living homes providing structure and support away from the Strip.",
    metaTitle: "Sober Living Homes in Nevada | Sober Stay",
    metaDescription: "Find verified sober living homes in Nevada. Browse recovery housing in Las Vegas, Reno, and more. Strong recovery amid desert beauty."
  }
];

export const US_CITIES: LocationInfo[] = [
  {
    slug: "los-angeles",
    name: "Los Angeles",
    type: "city",
    stateCode: "CA",
    parentState: "California",
    description: "Los Angeles is home to one of the largest recovery communities in the United States. With year-round sunshine, diverse neighborhoods from West Hollywood to the Valley, and extensive recovery resources, LA offers an ideal environment for those seeking sober living. Hundreds of meetings are available daily across the city.",
    metaTitle: "Sober Living Homes in Los Angeles | Sober Stay",
    metaDescription: "Find verified sober living homes in Los Angeles, CA. Browse recovery housing in West LA, the Valley, and more. Sunshine and support for your recovery."
  },
  {
    slug: "san-diego",
    name: "San Diego",
    type: "city",
    stateCode: "CA",
    parentState: "California",
    description: "San Diego's laid-back atmosphere and beautiful beaches make it a popular destination for recovery. The city boasts a strong sober community with numerous meetings, sober surfing groups, and outdoor activities. From Pacific Beach to North County, find quality recovery housing in America's Finest City.",
    metaTitle: "Sober Living Homes in San Diego | Sober Stay",
    metaDescription: "Find verified sober living homes in San Diego, CA. Browse recovery housing near the beach. Active sober community and year-round perfect weather."
  },
  {
    slug: "san-francisco",
    name: "San Francisco",
    type: "city",
    stateCode: "CA",
    parentState: "California",
    description: "San Francisco offers a diverse and progressive recovery community in one of America's most iconic cities. The Bay Area has strong 12-step traditions, alternative recovery options, and sober living homes throughout the city and East Bay. Tech industry opportunities and cultural richness await.",
    metaTitle: "Sober Living Homes in San Francisco | Sober Stay",
    metaDescription: "Find verified sober living homes in San Francisco, CA. Browse Bay Area recovery housing. Progressive recovery community in an iconic city."
  },
  {
    slug: "miami",
    name: "Miami",
    type: "city",
    stateCode: "FL",
    parentState: "Florida",
    description: "Miami and South Florida are home to one of the largest recovery communities in the world. The tropical climate, diverse population, and extensive treatment infrastructure make it a premier destination. Beautiful beaches, year-round warmth, and meetings in multiple languages support lasting recovery.",
    metaTitle: "Sober Living Homes in Miami | Sober Stay",
    metaDescription: "Find verified sober living homes in Miami, FL. Browse South Florida recovery housing. Tropical climate and massive recovery community."
  },
  {
    slug: "tampa",
    name: "Tampa",
    type: "city",
    stateCode: "FL",
    parentState: "Florida",
    description: "Tampa Bay offers a growing recovery community with more affordable options than South Florida. The area combines Gulf Coast beaches, a strong job market, and supportive sober living homes. From downtown Tampa to St. Petersburg, find quality recovery housing in this vibrant region.",
    metaTitle: "Sober Living Homes in Tampa | Sober Stay",
    metaDescription: "Find verified sober living homes in Tampa, FL. Browse Gulf Coast recovery housing. Affordable Florida living with strong recovery support."
  },
  {
    slug: "houston",
    name: "Houston",
    type: "city",
    stateCode: "TX",
    parentState: "Texas",
    description: "Houston, the largest city in Texas, offers affordable sober living with a strong recovery community. The city's diverse population, major healthcare center, and growing economy provide excellent opportunities for those in recovery. Find quality housing across Houston's many neighborhoods.",
    metaTitle: "Sober Living Homes in Houston | Sober Stay",
    metaDescription: "Find verified sober living homes in Houston, TX. Browse affordable Texas recovery housing. Diverse community and strong job market."
  },
  {
    slug: "dallas",
    name: "Dallas",
    type: "city",
    stateCode: "TX",
    parentState: "Texas",
    description: "Dallas-Fort Worth offers an expanding network of sober living homes with Texas hospitality. The metroplex provides affordable living, strong job opportunities, and welcoming recovery communities. From uptown Dallas to the suburbs, find recovery housing that fits your needs.",
    metaTitle: "Sober Living Homes in Dallas | Sober Stay",
    metaDescription: "Find verified sober living homes in Dallas, TX. Browse DFW recovery housing. Texas hospitality and affordable quality recovery options."
  },
  {
    slug: "austin",
    name: "Austin",
    type: "city",
    stateCode: "TX",
    parentState: "Texas",
    description: "Austin's unique culture, outdoor lifestyle, and growing tech scene make it an increasingly popular destination for recovery. The city's motto 'Keep Austin Weird' extends to a diverse and welcoming recovery community. Enjoy live music, nature, and quality sober living in the Texas capital.",
    metaTitle: "Sober Living Homes in Austin | Sober Stay",
    metaDescription: "Find verified sober living homes in Austin, TX. Browse Texas capital recovery housing. Unique culture and outdoor lifestyle for recovery."
  },
  {
    slug: "phoenix",
    name: "Phoenix",
    type: "city",
    stateCode: "AZ",
    parentState: "Arizona",
    description: "Phoenix has emerged as a major recovery destination with world-renowned treatment centers and extensive sober living options. The desert climate, wellness-focused culture, and year-round outdoor activities support healing. From Scottsdale to Tempe, find quality recovery housing in the Valley of the Sun.",
    metaTitle: "Sober Living Homes in Phoenix | Sober Stay",
    metaDescription: "Find verified sober living homes in Phoenix, AZ. Browse desert recovery housing. World-class treatment resources and wellness culture."
  },
  {
    slug: "denver",
    name: "Denver",
    type: "city",
    stateCode: "CO",
    parentState: "Colorado",
    description: "Denver offers a unique blend of outdoor adventure, career opportunities, and a thriving recovery community. The Mile High City's active lifestyle naturally supports sobriety with sober hiking groups, fitness communities, and social events. Clean mountain air and quality sober living await.",
    metaTitle: "Sober Living Homes in Denver | Sober Stay",
    metaDescription: "Find verified sober living homes in Denver, CO. Browse Colorado recovery housing. Mountain lifestyle and active sober community."
  },
  {
    slug: "seattle",
    name: "Seattle",
    type: "city",
    stateCode: "WA",
    parentState: "Washington",
    description: "Seattle offers a progressive recovery community with diverse approaches to sobriety. The Pacific Northwest lifestyle emphasizes wellness, coffee culture, and outdoor activities. From Capitol Hill to the Eastside, find sober living homes in the Emerald City.",
    metaTitle: "Sober Living Homes in Seattle | Sober Stay",
    metaDescription: "Find verified sober living homes in Seattle, WA. Browse Pacific Northwest recovery housing. Progressive community and nature access."
  },
  {
    slug: "chicago",
    name: "Chicago",
    type: "city",
    stateCode: "IL",
    parentState: "Illinois",
    description: "Chicago offers one of the strongest recovery communities in the Midwest with deep roots in 12-step traditions. The city has meetings around the clock, diverse neighborhoods with sober living options, and excellent public transportation. Find affordable quality recovery housing in the Windy City.",
    metaTitle: "Sober Living Homes in Chicago | Sober Stay",
    metaDescription: "Find verified sober living homes in Chicago, IL. Browse Midwest recovery housing. Strong 12-step traditions and affordable living."
  },
  {
    slug: "atlanta",
    name: "Atlanta",
    type: "city",
    stateCode: "GA",
    parentState: "Georgia",
    description: "Atlanta serves as the hub of recovery in the Southeast, with a growing network of sober living homes and strong community support. The city offers affordable living, warm climate, and Southern hospitality. From Midtown to the suburbs, find welcoming recovery housing in ATL.",
    metaTitle: "Sober Living Homes in Atlanta | Sober Stay",
    metaDescription: "Find verified sober living homes in Atlanta, GA. Browse Southeast recovery housing. Southern hospitality and growing recovery community."
  },
  {
    slug: "las-vegas",
    name: "Las Vegas",
    type: "city",
    stateCode: "NV",
    parentState: "Nevada",
    description: "Las Vegas may be known for entertainment, but a strong recovery community thrives here. Sober living homes provide structure and support away from the Strip, with affordable housing and year-round warm weather. The recovery community has grown significantly, offering diverse meeting options.",
    metaTitle: "Sober Living Homes in Las Vegas | Sober Stay",
    metaDescription: "Find verified sober living homes in Las Vegas, NV. Browse desert recovery housing. Strong recovery community amid affordable living."
  },
  {
    slug: "boston",
    name: "Boston",
    type: "city",
    stateCode: "MA",
    parentState: "Massachusetts",
    description: "Boston has a storied history in recovery, with some of the earliest organized recovery efforts in America. The city offers excellent healthcare resources, strong 12-step presence, and diverse sober living options. From Cambridge to the South Shore, find quality recovery housing in historic Boston.",
    metaTitle: "Sober Living Homes in Boston | Sober Stay",
    metaDescription: "Find verified sober living homes in Boston, MA. Browse New England recovery housing. Historic recovery community with excellent resources."
  },
  {
    slug: "portland",
    name: "Portland",
    type: "city",
    stateCode: "OR",
    parentState: "Oregon",
    description: "Portland offers a progressive and welcoming recovery community with diverse approaches to sobriety. The city's outdoor culture, local focus, and alternative recovery options complement traditional 12-step programs. Find sober living homes in this unique Pacific Northwest city.",
    metaTitle: "Sober Living Homes in Portland | Sober Stay",
    metaDescription: "Find verified sober living homes in Portland, OR. Browse Pacific Northwest recovery housing. Progressive community and outdoor lifestyle."
  },
  {
    slug: "san-antonio",
    name: "San Antonio",
    type: "city",
    stateCode: "TX",
    parentState: "Texas",
    description: "San Antonio offers affordable sober living with strong community values and rich cultural heritage. The city combines Texas hospitality with Hispanic traditions, creating welcoming recovery environments. From the River Walk area to surrounding neighborhoods, find quality recovery housing.",
    metaTitle: "Sober Living Homes in San Antonio | Sober Stay",
    metaDescription: "Find verified sober living homes in San Antonio, TX. Browse affordable Texas recovery housing. Cultural richness and community support."
  },
  {
    slug: "nashville",
    name: "Nashville",
    type: "city",
    stateCode: "TN",
    parentState: "Tennessee",
    description: "Nashville's recovery community has grown alongside the city's popularity. Music City offers unique sober social opportunities, from sober honky-tonks to recovery concerts. Find quality sober living homes in this vibrant city while enjoying Southern charm and cultural richness.",
    metaTitle: "Sober Living Homes in Nashville | Sober Stay",
    metaDescription: "Find verified sober living homes in Nashville, TN. Browse Music City recovery housing. Vibrant culture and growing recovery community."
  },
  {
    slug: "charlotte",
    name: "Charlotte",
    type: "city",
    stateCode: "NC",
    parentState: "North Carolina",
    description: "Charlotte offers a growing recovery community with affordable living and Southern hospitality. The Queen City provides quality sober living options with strong meeting networks and supportive environments. From uptown to the suburbs, find recovery housing in this banking hub.",
    metaTitle: "Sober Living Homes in Charlotte | Sober Stay",
    metaDescription: "Find verified sober living homes in Charlotte, NC. Browse Carolina recovery housing. Affordable living and strong community support."
  },
  {
    slug: "new-york-city",
    name: "New York City",
    type: "city",
    stateCode: "NY",
    parentState: "New York",
    description: "New York City offers unparalleled recovery resources with meetings available 24/7 across all five boroughs. The city that never sleeps has a recovery community that never stops supporting its members. From Brooklyn to Manhattan, find sober living homes in the world's greatest city.",
    metaTitle: "Sober Living Homes in New York City | Sober Stay",
    metaDescription: "Find verified sober living homes in NYC. Browse recovery housing in all five boroughs. 24/7 meetings and endless recovery resources."
  }
];

export const ALL_LOCATIONS: LocationInfo[] = [...US_STATES, ...US_CITIES];

export function getLocationBySlug(slug: string): LocationInfo | undefined {
  return ALL_LOCATIONS.find(loc => loc.slug === slug);
}

export function isValidLocationSlug(slug: string): boolean {
  return ALL_LOCATIONS.some(loc => loc.slug === slug);
}

export function getStateByCode(code: string): LocationInfo | undefined {
  return US_STATES.find(state => state.stateCode === code);
}

export function getCitiesByState(stateCode: string): LocationInfo[] {
  return US_CITIES.filter(city => city.stateCode === stateCode);
}

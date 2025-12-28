export interface CityHighlight {
  icon: "users" | "building" | "heart" | "shield";
  title: string;
  description: string;
}

export interface CityFAQ {
  question: string;
  answer: string;
}

export interface CityData {
  slug: string;
  name: string;
  stateCode: string;
  stateName: string;
  stateSlug: string;
  metaTitle: string;
  metaDescription: string;
  openingParagraph: string;
  whyThisCity: string;
  highlights: CityHighlight[];
  faqs: CityFAQ[];
}

export const CITY_DATA: CityData[] = [
  {
    slug: "los-angeles",
    name: "Los Angeles",
    stateCode: "CA",
    stateName: "California",
    stateSlug: "california",
    metaTitle: "Sober Living Homes in Los Angeles, CA | Recovery Housing | Sober Stay",
    metaDescription: "Find sober living homes in Los Angeles, California. Browse verified recovery housing in LA neighborhoods. Support your recovery journey with Sober Stay.",
    openingParagraph: "Los Angeles, California offers one of the largest networks of sober living homes in the United States. Whether you're transitioning from treatment, seeking a fresh start, or looking for structured sober housing in LA, the city's diverse neighborhoods provide recovery environments for every need. From West Hollywood to the San Fernando Valley, Los Angeles combines year-round sunshine with a thriving recovery community. Sober Stay connects you with verified sober living homes throughout Los Angeles, helping you find the right fit for your recovery journey.",
    whyThisCity: "Los Angeles has earned its reputation as a recovery destination for good reason. The city hosts thousands of 12-step meetings daily, from intimate gatherings in coffee shops to large speaker meetings that draw hundreds. LA's wellness culture naturally supports recovery, with abundant yoga studios, hiking trails, and healthy restaurants. Many people relocate to Los Angeles specifically for recovery, drawn by the established sober community, employment opportunities in diverse industries, and the chance for a fresh start in a city where reinvention is embraced.",
    highlights: [
      {
        icon: "users",
        title: "Massive Recovery Community",
        description: "Thousands of AA, NA, and other recovery meetings happen daily across LA neighborhoods, providing 24/7 support."
      },
      {
        icon: "building",
        title: "Diverse Housing Options",
        description: "From budget-friendly shared rooms to luxury sober living, LA offers options at every price point and recovery level."
      },
      {
        icon: "heart",
        title: "Wellness Culture",
        description: "LA's focus on health and wellness aligns with recovery values – outdoor activities, fitness, and mindfulness are everywhere."
      },
      {
        icon: "shield",
        title: "Employment Opportunities",
        description: "Entertainment, tech, healthcare, and service industries provide job opportunities for those rebuilding their careers."
      }
    ],
    faqs: [
      {
        question: "What is sober living in Los Angeles?",
        answer: "Sober living homes in Los Angeles are structured residences for people in recovery from addiction. They provide a drug and alcohol-free environment, peer support, and accountability while allowing residents to work, attend school, or participate in outpatient treatment. LA sober living homes range from basic shared housing to luxury amenity-rich residences."
      },
      {
        question: "How much does sober living cost in Los Angeles?",
        answer: "Sober living costs in Los Angeles typically range from $800 to $3,500 per month depending on location, room type, and amenities. Shared rooms in less expensive areas may start around $800-1,200, while private rooms in West LA, Santa Monica, or Hollywood can range from $1,500-3,500. Luxury sober living with extensive amenities can cost more."
      },
      {
        question: "What's the difference between sober living and treatment in LA?",
        answer: "Treatment centers (inpatient or outpatient) provide clinical addiction treatment including therapy, medical care, and structured programming. Sober living homes are residences that provide a supportive, substance-free environment without clinical treatment. Many LA residents step down from treatment to sober living while continuing outpatient services."
      },
      {
        question: "Who is sober living in Los Angeles for?",
        answer: "Sober living in LA is for anyone committed to maintaining sobriety in a supportive environment. This includes people completing treatment programs, those returning from relapse, individuals seeking structured support, and people wanting to immerse themselves in LA's recovery community."
      },
      {
        question: "How do I find sober living near me in Los Angeles?",
        answer: "Use Sober Stay to browse verified sober living homes throughout Los Angeles. Filter by neighborhood, price, gender, amenities, and recovery support level. You can also get referrals from treatment centers, therapists, or AA/NA meetings in the area."
      }
    ]
  },
  {
    slug: "san-diego",
    name: "San Diego",
    stateCode: "CA",
    stateName: "California",
    stateSlug: "california",
    metaTitle: "Sober Living Homes in San Diego, CA | Recovery Housing | Sober Stay",
    metaDescription: "Find sober living homes in San Diego, California. Browse verified recovery housing near the beach. Year-round perfect weather for your recovery journey.",
    openingParagraph: "San Diego, California provides an ideal setting for sober living and recovery with its perfect weather, beach lifestyle, and growing recovery community. Sober living homes in San Diego range from coastal properties in Pacific Beach to structured residences in North County. Whether you're seeking a laid-back beach environment or a more structured recovery setting, San Diego offers quality sober housing options. Sober Stay helps you connect with verified sober living homes throughout San Diego, supporting your transition to lasting sobriety.",
    whyThisCity: "San Diego's combination of natural beauty, outdoor lifestyle, and supportive recovery community makes it a popular choice for those seeking sober living. The city offers a more relaxed pace than LA while still providing extensive recovery resources. Sober surfing groups, hiking clubs, and outdoor AA meetings take advantage of the year-round sunshine. San Diego's proximity to treatment centers in both Southern California and nearby Tijuana means many people transition to sober living here after completing residential treatment.",
    highlights: [
      {
        icon: "heart",
        title: "Beach Lifestyle Recovery",
        description: "Sober surfing, beach meetings, and outdoor activities create an active recovery lifestyle in America's Finest City."
      },
      {
        icon: "users",
        title: "Growing Recovery Community",
        description: "San Diego's recovery community continues to expand with daily meetings, sober events, and supportive networks."
      },
      {
        icon: "building",
        title: "Quality Housing Options",
        description: "From Pacific Beach to North County, find sober living homes that match your recovery needs and budget."
      },
      {
        icon: "shield",
        title: "Employment & Education",
        description: "Strong healthcare, biotech, and military presence provide stable employment opportunities for recovery."
      }
    ],
    faqs: [
      {
        question: "What is sober living in San Diego?",
        answer: "Sober living homes in San Diego are alcohol and drug-free residences that provide structured support for people in recovery. They offer a bridge between treatment and independent living, with house rules, accountability, and peer support while allowing residents to work and attend outpatient services."
      },
      {
        question: "How much does sober living cost in San Diego?",
        answer: "San Diego sober living typically costs $800 to $2,500 per month. Shared rooms range from $800-1,400, while private rooms in desirable areas like Pacific Beach or La Jolla range from $1,500-2,500. Some homes include utilities and meals in the cost."
      },
      {
        question: "What's the difference between sober living and treatment?",
        answer: "Treatment provides clinical care for addiction including therapy and medical support. Sober living provides housing with structure and accountability but not clinical treatment. Many San Diego residents live in sober housing while attending outpatient treatment programs."
      },
      {
        question: "Who is sober living in San Diego for?",
        answer: "Sober living in San Diego serves anyone maintaining sobriety who wants community support. This includes those completing treatment, people seeking a recovery-focused environment, and individuals wanting to join San Diego's active sober community."
      },
      {
        question: "How do I find sober living near me in San Diego?",
        answer: "Browse sober living homes on Sober Stay and filter by San Diego neighborhoods, price range, and amenities. Treatment centers, therapists, and local AA/NA meetings can also provide referrals to quality sober living homes."
      }
    ]
  },
  {
    slug: "phoenix",
    name: "Phoenix",
    stateCode: "AZ",
    stateName: "Arizona",
    stateSlug: "arizona",
    metaTitle: "Sober Living Homes in Phoenix, AZ | Recovery Housing | Sober Stay",
    metaDescription: "Find sober living homes in Phoenix, Arizona. Browse verified recovery housing in the Valley of the Sun. Desert wellness for your recovery journey.",
    openingParagraph: "Phoenix, Arizona has become a premier destination for sober living and addiction recovery. The Valley of the Sun offers affordable recovery housing, year-round sunshine, and a wellness-focused culture that supports lasting sobriety. Sober living homes in Phoenix and surrounding areas like Scottsdale, Tempe, and Mesa provide options for every budget and recovery need. Sober Stay connects you with verified sober living homes throughout the Phoenix metro area, helping you find supportive housing for your recovery journey.",
    whyThisCity: "Phoenix has experienced tremendous growth as a recovery destination, attracting people from across the country seeking affordable sober living in a wellness-oriented environment. The desert climate encourages outdoor activities year-round, from hiking Camelback Mountain to swimming and golf. Phoenix offers a lower cost of living than California while providing world-class treatment resources and a strong recovery community. Many treatment centers operate in the area, creating a natural pipeline to quality sober living homes.",
    highlights: [
      {
        icon: "heart",
        title: "Wellness-Focused Culture",
        description: "Arizona's emphasis on wellness, outdoor activities, and healthy living naturally supports recovery and sobriety."
      },
      {
        icon: "building",
        title: "Affordable Housing",
        description: "Phoenix offers quality sober living at lower costs than coastal cities, making recovery more accessible."
      },
      {
        icon: "users",
        title: "Strong Recovery Network",
        description: "Numerous treatment centers and robust 12-step communities create extensive support for those in recovery."
      },
      {
        icon: "shield",
        title: "Growing Job Market",
        description: "Phoenix's expanding economy in tech, healthcare, and services provides employment opportunities for residents."
      }
    ],
    faqs: [
      {
        question: "What is sober living in Phoenix?",
        answer: "Sober living homes in Phoenix are structured, substance-free residences for people in addiction recovery. They provide accountability, peer support, and house rules while allowing residents to work and attend outpatient treatment. Phoenix sober living ranges from basic shared housing to luxury amenity-rich residences."
      },
      {
        question: "How much does sober living cost in Phoenix?",
        answer: "Phoenix sober living typically costs $600 to $2,000 per month, making it more affordable than coastal cities. Shared rooms range from $600-1,000, while private rooms in Scottsdale or upscale areas range from $1,200-2,000. Some homes include utilities and meals."
      },
      {
        question: "What's the difference between sober living and treatment?",
        answer: "Treatment centers provide clinical addiction care including therapy and medical supervision. Sober living homes offer supportive housing without clinical services. Many Phoenix residents step down from treatment to sober living while continuing outpatient care."
      },
      {
        question: "Who is sober living in Phoenix for?",
        answer: "Sober living in Phoenix serves anyone committed to recovery who wants structured support. This includes people transitioning from treatment, those relocating for a fresh start, and individuals seeking Arizona's wellness-focused recovery environment."
      },
      {
        question: "How do I find sober living near me in Phoenix?",
        answer: "Use Sober Stay to browse verified sober living homes throughout Phoenix, Scottsdale, Tempe, and Mesa. Filter by location, price, and amenities. Treatment centers and local AA/NA meetings also provide referrals."
      }
    ]
  },
  {
    slug: "miami",
    name: "Miami",
    stateCode: "FL",
    stateName: "Florida",
    stateSlug: "florida",
    metaTitle: "Sober Living Homes in Miami, FL | Recovery Housing | Sober Stay",
    metaDescription: "Find sober living homes in Miami, Florida. Browse verified recovery housing in South Florida. Year-round warm weather for your recovery journey.",
    openingParagraph: "Miami, Florida offers vibrant sober living options in one of the nation's most established recovery communities. South Florida has long been a destination for addiction recovery, with sober living homes throughout Miami-Dade County providing structured support for those rebuilding their lives. From Brickell to Coral Gables and beyond, Miami combines tropical weather with extensive recovery resources. Sober Stay helps you find verified sober living homes in Miami, connecting you with the supportive housing you need for lasting sobriety.",
    whyThisCity: "South Florida earned the nickname 'Recovery Capital of America' for good reason. Miami and surrounding areas offer some of the most established recovery communities in the country, with decades of 12-step traditions and abundant sober living options. The year-round warm weather supports an active outdoor lifestyle, from beach walks to sober social events. Miami's diverse, multicultural community means finding a recovery network that feels like home. Spanish-speaking meetings and diverse cultural communities make Miami welcoming for people from all backgrounds.",
    highlights: [
      {
        icon: "users",
        title: "Established Recovery Community",
        description: "South Florida's decades-long recovery traditions mean extensive meetings, events, and sober support networks."
      },
      {
        icon: "heart",
        title: "Tropical Lifestyle",
        description: "Year-round warm weather, beaches, and outdoor activities support an active, healthy recovery lifestyle."
      },
      {
        icon: "building",
        title: "Diverse Housing Options",
        description: "From budget-friendly homes to luxury waterfront sober living, Miami offers options at every level."
      },
      {
        icon: "shield",
        title: "Multicultural Support",
        description: "Miami's diverse community includes Spanish-speaking meetings and cultural communities for all backgrounds."
      }
    ],
    faqs: [
      {
        question: "What is sober living in Miami?",
        answer: "Sober living homes in Miami are structured residences for people in recovery from addiction. They provide substance-free housing, peer accountability, and house rules while allowing residents to work and attend outpatient treatment. Miami offers options from basic shared housing to luxury amenity-rich residences."
      },
      {
        question: "How much does sober living cost in Miami?",
        answer: "Miami sober living typically costs $800 to $3,000 per month depending on location and amenities. Shared rooms range from $800-1,500, while private rooms in upscale areas like Coral Gables or South Beach range from $1,800-3,000. Luxury waterfront homes cost more."
      },
      {
        question: "What's the difference between sober living and treatment?",
        answer: "Treatment centers provide clinical addiction care with therapy and medical supervision. Sober living homes offer supportive housing without clinical services. Many Miami residents live in sober housing while attending outpatient programs or after completing residential treatment."
      },
      {
        question: "Who is sober living in Miami for?",
        answer: "Sober living in Miami serves anyone committed to recovery who wants community support. This includes those completing treatment, people seeking South Florida's established recovery community, and individuals wanting year-round warm weather for their recovery."
      },
      {
        question: "How do I find sober living near me in Miami?",
        answer: "Use Sober Stay to browse verified sober living homes throughout Miami-Dade County. Filter by neighborhood, price, and amenities. Treatment centers and local AA/NA meetings also provide referrals to quality sober living."
      }
    ]
  },
  {
    slug: "denver",
    name: "Denver",
    stateCode: "CO",
    stateName: "Colorado",
    stateSlug: "colorado",
    metaTitle: "Sober Living Homes in Denver, CO | Recovery Housing | Sober Stay",
    metaDescription: "Find sober living homes in Denver, Colorado. Browse verified recovery housing in the Mile High City. Mountain lifestyle for your recovery journey.",
    openingParagraph: "Denver, Colorado offers a unique combination of outdoor lifestyle, thriving job market, and growing recovery community for those seeking sober living. The Mile High City provides sober living homes throughout the metro area, from Capitol Hill to the suburbs. Colorado's clean mountain air and active culture naturally support wellness and sobriety. Sober Stay helps you find verified sober living homes in Denver, connecting you with recovery housing that fits your needs and budget.",
    whyThisCity: "Denver attracts people seeking recovery in an active, outdoor-focused environment. The city's culture celebrates hiking, skiing, cycling, and other activities that support physical and mental wellness. Denver's growing tech and cannabis industries have paradoxically strengthened the recovery community, as more people seek sober lifestyles amid changing norms. The city offers a lower cost of living than coastal cities while providing urban amenities and easy access to mountain recreation.",
    highlights: [
      {
        icon: "heart",
        title: "Active Outdoor Lifestyle",
        description: "Hiking, skiing, and outdoor recreation provide healthy outlets that naturally support recovery and wellness."
      },
      {
        icon: "building",
        title: "Growing Recovery Scene",
        description: "Denver's recovery community continues to expand with new meetings, sober events, and support groups."
      },
      {
        icon: "users",
        title: "Young Professional Focus",
        description: "Many Denver sober living homes cater to young professionals rebuilding careers in recovery."
      },
      {
        icon: "shield",
        title: "Strong Job Market",
        description: "Tech, healthcare, and outdoor industry jobs provide employment opportunities for those in recovery."
      }
    ],
    faqs: [
      {
        question: "What is sober living in Denver?",
        answer: "Sober living homes in Denver are structured, substance-free residences for people in addiction recovery. They provide peer support, house rules, and accountability while allowing residents to work and participate in outpatient treatment or recovery activities."
      },
      {
        question: "How much does sober living cost in Denver?",
        answer: "Denver sober living typically costs $700 to $2,200 per month. Shared rooms range from $700-1,200, while private rooms in desirable neighborhoods range from $1,400-2,200. Some homes include utilities and amenities in the cost."
      },
      {
        question: "What's the difference between sober living and treatment?",
        answer: "Treatment provides clinical addiction care including therapy and medical support. Sober living provides supportive housing without clinical services. Many Denver residents transition from treatment to sober living while continuing outpatient care."
      },
      {
        question: "Who is sober living in Denver for?",
        answer: "Sober living in Denver serves anyone committed to recovery who wants structured support. This includes people completing treatment, young professionals rebuilding careers, and those seeking Colorado's active outdoor recovery lifestyle."
      },
      {
        question: "How do I find sober living near me in Denver?",
        answer: "Use Sober Stay to browse verified sober living homes throughout the Denver metro area. Filter by neighborhood, price, and amenities. Local treatment centers and AA/NA meetings also provide referrals."
      }
    ]
  },
  {
    slug: "austin",
    name: "Austin",
    stateCode: "TX",
    stateName: "Texas",
    stateSlug: "texas",
    metaTitle: "Sober Living Homes in Austin, TX | Recovery Housing | Sober Stay",
    metaDescription: "Find sober living homes in Austin, Texas. Browse verified recovery housing in the Live Music Capital. Affordable options for your recovery journey.",
    openingParagraph: "Austin, Texas provides affordable sober living options in one of America's fastest-growing cities. Known for its live music scene, outdoor activities, and tech industry, Austin offers a unique recovery environment with strong community values. Sober living homes throughout Austin and surrounding areas like Round Rock and Cedar Park provide structured support for those in recovery. Sober Stay connects you with verified sober living homes in Austin, helping you find the right fit for your recovery journey.",
    whyThisCity: "Austin's 'Keep it Weird' culture creates space for people in recovery to be themselves while rebuilding their lives. The city offers a lower cost of living than coastal cities combined with a booming job market in tech, healthcare, and creative industries. Austin's recovery community has grown alongside the city, with diverse meeting options from traditional 12-step to alternative recovery groups. The city's outdoor culture – from Barton Springs to Lady Bird Lake – supports active, healthy recovery lifestyles.",
    highlights: [
      {
        icon: "building",
        title: "Affordable Living",
        description: "Texas has no state income tax and Austin offers quality sober living at lower costs than coastal cities."
      },
      {
        icon: "users",
        title: "Diverse Recovery Options",
        description: "Traditional 12-step, SMART Recovery, and alternative recovery groups provide options for every approach."
      },
      {
        icon: "heart",
        title: "Active Outdoor Culture",
        description: "Hiking, swimming, and outdoor activities at Lady Bird Lake and beyond support healthy recovery lifestyles."
      },
      {
        icon: "shield",
        title: "Strong Job Market",
        description: "Austin's booming tech and creative industries provide employment opportunities for those rebuilding careers."
      }
    ],
    faqs: [
      {
        question: "What is sober living in Austin?",
        answer: "Sober living homes in Austin are structured, substance-free residences that support addiction recovery. They provide peer accountability, house rules, and a supportive community while allowing residents to work and attend outpatient treatment or recovery meetings."
      },
      {
        question: "How much does sober living cost in Austin?",
        answer: "Austin sober living typically costs $600 to $1,800 per month, more affordable than coastal cities. Shared rooms range from $600-1,000, while private rooms range from $1,200-1,800 depending on location and amenities."
      },
      {
        question: "What's the difference between sober living and treatment?",
        answer: "Treatment centers provide clinical addiction care with therapy and medical supervision. Sober living homes offer supportive housing without clinical services. Many Austin residents live in sober housing while attending outpatient programs."
      },
      {
        question: "Who is sober living in Austin for?",
        answer: "Sober living in Austin serves anyone committed to recovery who wants community support. This includes those completing treatment, people relocating for recovery, and individuals seeking Austin's unique blend of culture and affordability."
      },
      {
        question: "How do I find sober living near me in Austin?",
        answer: "Use Sober Stay to browse verified sober living homes throughout Austin and surrounding areas. Filter by location, price, and amenities. Treatment centers and local recovery meetings also provide referrals."
      }
    ]
  },
  {
    slug: "delray-beach",
    name: "Delray Beach",
    stateCode: "FL",
    stateName: "Florida",
    stateSlug: "florida",
    metaTitle: "Sober Living Homes in Delray Beach, FL | Recovery Housing | Sober Stay",
    metaDescription: "Find sober living homes in Delray Beach, Florida. Browse verified recovery housing in the Recovery Capital of America. Sober Stay connects you.",
    openingParagraph: "Delray Beach, Florida is widely recognized as the 'Recovery Capital of America' with the highest concentration of sober living homes in the nation. This small coastal city has become a destination for those seeking recovery, with hundreds of sober living options and an unmatched recovery community. From Atlantic Avenue to the surrounding neighborhoods, Delray Beach offers recovery housing at every level. Sober Stay helps you navigate Delray Beach's extensive sober living options to find the right home for your recovery.",
    whyThisCity: "Delray Beach transformed from a struggling coastal town to America's premier recovery destination over the past few decades. Today, the city hosts hundreds of sober living homes, dozens of treatment centers, and one of the most active recovery communities in the world. Residents can attend multiple meetings daily, find sober employment in the recovery industry, and build lives surrounded by others in recovery. The beach lifestyle, year-round warm weather, and walkable downtown create an environment where recovery becomes a way of life.",
    highlights: [
      {
        icon: "users",
        title: "Recovery Capital of America",
        description: "The highest concentration of sober living and recovery resources in the nation, with hundreds of meetings weekly."
      },
      {
        icon: "heart",
        title: "Beach Lifestyle",
        description: "Ocean access, perfect weather, and outdoor activities support healthy, active recovery living."
      },
      {
        icon: "building",
        title: "Extensive Options",
        description: "Hundreds of sober living homes at every price point and recovery level within a small geographic area."
      },
      {
        icon: "shield",
        title: "Recovery Employment",
        description: "Many jobs in the recovery industry allow residents to work while maintaining their sobriety focus."
      }
    ],
    faqs: [
      {
        question: "What is sober living in Delray Beach?",
        answer: "Sober living homes in Delray Beach are structured residences for people in recovery, ranging from basic shared housing to luxury oceanfront properties. The city has hundreds of options with varying levels of structure, making it possible to find a home that matches your specific recovery needs."
      },
      {
        question: "How much does sober living cost in Delray Beach?",
        answer: "Delray Beach sober living ranges from $700 to $4,000+ per month. Basic shared rooms start around $700-1,000, mid-range options run $1,200-2,000, and luxury oceanfront homes can cost $3,000-4,000+. The competitive market means quality options exist at every price point."
      },
      {
        question: "Why is Delray Beach known for recovery?",
        answer: "Delray Beach developed its recovery reputation over decades as treatment centers and sober living homes clustered in the area. Today, the recovery community is self-sustaining, with residents supporting each other through extensive meetings, sober events, and recovery-focused employment."
      },
      {
        question: "Who is sober living in Delray Beach for?",
        answer: "Sober living in Delray Beach serves anyone committed to recovery who wants to immerse themselves in the nation's strongest recovery community. This includes those completing treatment, people seeking total immersion in recovery culture, and those wanting extensive meeting and support options."
      },
      {
        question: "How do I find sober living near me in Delray Beach?",
        answer: "Use Sober Stay to browse verified sober living homes in Delray Beach and filter by price, amenities, and recovery level. Given the high concentration of options, you can also visit in person to tour multiple homes and find the right fit."
      }
    ]
  }
];

export function getCityData(slug: string): CityData | undefined {
  return CITY_DATA.find(city => city.slug === slug);
}

export function getRelatedCities(currentSlug: string, stateCode: string): CityData[] {
  return CITY_DATA.filter(city => 
    city.slug !== currentSlug && 
    (city.stateCode === stateCode || CITY_DATA.indexOf(city) < 5)
  ).slice(0, 4);
}

export function getAllCities(): CityData[] {
  return CITY_DATA;
}

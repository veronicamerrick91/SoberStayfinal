export interface StateHighlight {
  icon: "users" | "building" | "heart" | "shield";
  title: string;
  description: string;
}

export interface StateFAQ {
  question: string;
  answer: string;
}

export interface StateData {
  slug: string;
  name: string;
  stateCode: string;
  metaTitle: string;
  metaDescription: string;
  openingParagraph: string;
  whyThisState: string;
  highlights: StateHighlight[];
  faqs: StateFAQ[];
  topCities: string[];
}

export const STATE_DATA: StateData[] = [
  {
    slug: "california",
    name: "California",
    stateCode: "CA",
    metaTitle: "Sober Living Homes in California | Recovery Housing | Sober Stay",
    metaDescription: "Find sober living homes throughout California. Browse verified recovery housing in Los Angeles, San Diego, Orange County, and more. Start your recovery journey today.",
    openingParagraph: "California leads the nation in sober living options, offering thousands of recovery homes from San Diego to San Francisco. The Golden State's year-round sunshine, outdoor lifestyle, and established recovery communities make it an ideal destination for those seeking lasting sobriety. Whether you're looking for beachside recovery in Southern California, serene mountain settings in Northern California, or urban environments in major metros, California provides diverse sober living environments. Sober Stay connects you with verified sober living homes across the state, helping you find the perfect fit for your recovery needs and budget.",
    whyThisState: "California has earned its reputation as a premier recovery destination. The state hosts some of the largest recovery communities in the world, with thousands of daily meetings across all major cities. California's wellness culture naturally supports recovery lifestyles, with abundant fitness options, healthy cuisine, and mindfulness practices. The diverse job market offers opportunities across technology, entertainment, healthcare, and hospitality industries, making it easier to rebuild careers while maintaining sobriety.",
    highlights: [
      {
        icon: "users",
        title: "Largest Recovery Community",
        description: "California hosts the nation's largest network of AA, NA, and other recovery meetings, with thousands of options daily."
      },
      {
        icon: "building",
        title: "Diverse Housing Options",
        description: "From budget-friendly shared rooms to luxury oceanfront recovery homes, California offers options at every price point."
      },
      {
        icon: "heart",
        title: "Wellness Lifestyle",
        description: "Year-round outdoor activities, healthy food culture, and wellness focus align perfectly with recovery values."
      },
      {
        icon: "shield",
        title: "Strong Regulations",
        description: "California has some of the strongest sober living regulations, providing additional oversight and resident protections."
      }
    ],
    faqs: [
      {
        question: "What is sober living in California?",
        answer: "Sober living homes in California are structured residences for people in recovery from addiction. They provide drug and alcohol-free environments with peer support, house rules, and accountability while allowing residents to work, attend school, or participate in outpatient treatment."
      },
      {
        question: "How much does sober living cost in California?",
        answer: "Sober living costs in California typically range from $600 to $4,000+ per month depending on location, amenities, and room type. Inland areas tend to be more affordable, while coastal areas like Orange County, Los Angeles, and San Diego command higher prices."
      },
      {
        question: "What cities have the most sober living homes in California?",
        answer: "Los Angeles has the highest concentration of sober living homes, followed by San Diego, Orange County (especially Costa Mesa and Newport Beach), the San Francisco Bay Area, and Sacramento. Each region offers unique recovery communities and amenities."
      },
      {
        question: "Is sober living in California regulated?",
        answer: "Yes, California has regulations for sober living homes. Many operators obtain certification through organizations like NARR or CAARR. Some cities have additional zoning requirements. Look for certified or licensed homes for added accountability."
      },
      {
        question: "Can I work while in sober living in California?",
        answer: "Absolutely. Most California sober living homes encourage or require employment or school enrollment. California's diverse economy offers job opportunities across many industries, making it easier to rebuild your career while maintaining sobriety."
      }
    ],
    topCities: ["los-angeles", "san-diego", "orange-county", "san-francisco", "sacramento"]
  },
  {
    slug: "florida",
    name: "Florida",
    stateCode: "FL",
    metaTitle: "Sober Living Homes in Florida | Recovery Housing | Sober Stay",
    metaDescription: "Find sober living homes throughout Florida. Browse verified recovery housing in Delray Beach, Miami, Tampa, and more. Begin your recovery journey in the Sunshine State.",
    openingParagraph: "Florida has become one of America's leading recovery destinations, particularly in South Florida where cities like Delray Beach have earned the nickname 'Recovery Capital of the World.' The Sunshine State offers warm weather year-round, beautiful beaches, and one of the most established recovery communities in the country. From the recovery hub of Palm Beach County to the vibrant streets of Miami, Florida provides diverse sober living environments for every stage of recovery. Sober Stay connects you with verified sober living homes across Florida, helping you find structured support in paradise.",
    whyThisState: "Florida's recovery scene has grown tremendously over the past two decades, creating infrastructure that supports long-term sobriety. Delray Beach and the surrounding Palm Beach County area host hundreds of treatment centers, sober living homes, and recovery support services within a few square miles. The warm climate allows for year-round outdoor activities that support physical and mental wellness. Florida's growing economy provides job opportunities across tourism, healthcare, construction, and service industries.",
    highlights: [
      {
        icon: "users",
        title: "Recovery Capital",
        description: "South Florida is known as the 'Recovery Capital of the World' with one of the highest concentrations of recovery resources anywhere."
      },
      {
        icon: "building",
        title: "Established Infrastructure",
        description: "Decades of recovery community development mean abundant meetings, sober activities, and peer support networks."
      },
      {
        icon: "heart",
        title: "Year-Round Sunshine",
        description: "Warm weather and beaches provide natural mood benefits and endless outdoor activities to support recovery lifestyles."
      },
      {
        icon: "shield",
        title: "Recent Reforms",
        description: "Florida has implemented stronger oversight of sober living homes in recent years, improving quality and accountability."
      }
    ],
    faqs: [
      {
        question: "What is sober living in Florida?",
        answer: "Sober living homes in Florida are structured residences for people in recovery from addiction. They provide drug and alcohol-free environments with peer support and accountability while residents work, attend school, or continue outpatient treatment."
      },
      {
        question: "Why is Florida a popular recovery destination?",
        answer: "Florida, especially South Florida, has developed one of the nation's largest recovery ecosystems over several decades. The combination of warm weather, established recovery community, abundant treatment resources, and fresh start opportunities draws people from across the country."
      },
      {
        question: "How much does sober living cost in Florida?",
        answer: "Sober living costs in Florida typically range from $500 to $3,000+ per month. Delray Beach and Palm Beach County tend to have higher prices due to the established recovery community. Other areas like Tampa, Jacksonville, and Orlando often offer more affordable options."
      },
      {
        question: "What is Delray Beach known for in recovery?",
        answer: "Delray Beach is nicknamed the 'Recovery Capital of America' due to its extremely high concentration of treatment centers, sober living homes, and recovery support services. The downtown area hosts dozens of recovery meetings daily and many recovery-friendly employers."
      },
      {
        question: "Is sober living in Florida regulated?",
        answer: "Florida has implemented regulations for sober living homes, including voluntary certification programs and patient brokering laws. Look for homes certified by FARR (Florida Association of Recovery Residences) or similar organizations for added accountability."
      }
    ],
    topCities: ["delray-beach", "miami", "tampa", "orlando", "jacksonville"]
  },
  {
    slug: "texas",
    name: "Texas",
    stateCode: "TX",
    metaTitle: "Sober Living Homes in Texas | Recovery Housing | Sober Stay",
    metaDescription: "Find sober living homes throughout Texas. Browse verified recovery housing in Austin, Houston, Dallas, and more. Start your Texas recovery journey today.",
    openingParagraph: "Texas offers a growing network of sober living homes across its major metropolitan areas. From the live music scene of Austin to the diverse neighborhoods of Houston and the thriving communities of Dallas-Fort Worth, the Lone Star State provides varied recovery environments for every preference. Texas combines lower cost of living than coastal states with strong job markets and welcoming communities. Sober Stay connects you with verified sober living homes throughout Texas, helping you find affordable, structured recovery housing with authentic Texas hospitality.",
    whyThisState: "Texas has seen significant growth in its recovery community and infrastructure. Major cities host thriving AA, NA, and other recovery meeting networks. The state's lower cost of living compared to California or Florida means more affordable sober living options without sacrificing quality. Texas's strong economy across technology, healthcare, energy, and service industries provides abundant employment opportunities for those rebuilding their careers.",
    highlights: [
      {
        icon: "users",
        title: "Growing Recovery Community",
        description: "Major Texas cities have developed strong recovery meeting networks with hundreds of weekly meetings across all programs."
      },
      {
        icon: "building",
        title: "Affordable Options",
        description: "Lower cost of living means more affordable sober living without sacrificing quality or amenities."
      },
      {
        icon: "heart",
        title: "Welcoming Culture",
        description: "Texas hospitality extends to recovery communities, with welcoming fellowship and strong peer support networks."
      },
      {
        icon: "shield",
        title: "Strong Job Market",
        description: "Texas's diverse economy offers employment opportunities across technology, healthcare, energy, and service industries."
      }
    ],
    faqs: [
      {
        question: "What is sober living in Texas?",
        answer: "Sober living homes in Texas are structured residences providing drug and alcohol-free environments for people in recovery. They offer peer support and accountability while allowing residents to work, attend school, or continue treatment."
      },
      {
        question: "How much does sober living cost in Texas?",
        answer: "Sober living costs in Texas typically range from $400 to $2,500 per month depending on location and amenities. Texas generally offers more affordable options than coastal states, with quality housing available at lower price points."
      },
      {
        question: "What cities have the most sober living homes in Texas?",
        answer: "Austin, Houston, Dallas, and San Antonio have the highest concentration of sober living homes. Austin's recovery community has grown significantly alongside its tech industry, while Houston and Dallas offer diverse options across price points."
      },
      {
        question: "Is Texas a good place for recovery?",
        answer: "Yes, Texas offers strong recovery communities in its major cities, affordable cost of living, a robust job market, and welcoming fellowship. The state has seen significant growth in recovery resources and infrastructure."
      },
      {
        question: "Can I work while in sober living in Texas?",
        answer: "Absolutely. Most Texas sober living homes encourage or require employment. The state's strong economy across multiple industries makes it easier to find work while maintaining your recovery."
      }
    ],
    topCities: ["austin", "houston", "dallas", "san-antonio", "fort-worth"]
  },
  {
    slug: "arizona",
    name: "Arizona",
    stateCode: "AZ",
    metaTitle: "Sober Living Homes in Arizona | Recovery Housing | Sober Stay",
    metaDescription: "Find sober living homes throughout Arizona. Browse verified recovery housing in Phoenix, Scottsdale, Tucson, and more. Begin your desert recovery journey.",
    openingParagraph: "Arizona has emerged as a significant recovery destination, particularly in the Phoenix metropolitan area and Prescott. The desert state offers a unique recovery environment with warm, dry climate, stunning natural beauty, and established recovery communities. Phoenix and Scottsdale host numerous sober living options ranging from budget-friendly to luxury, while Prescott has earned recognition as one of America's historic recovery towns. Sober Stay connects you with verified sober living homes across Arizona, helping you find structured support amid the beauty of the Sonoran Desert.",
    whyThisState: "Arizona's recovery community has grown steadily, particularly in the Phoenix metro area where hundreds of meetings happen weekly. The dry desert climate appeals to many in recovery, and the state's natural beauty provides endless outdoor activities from hiking to golf. Prescott, known as 'The Recovery Town,' offers a small-town recovery experience with intensive community support. Arizona's lower cost of living than California and growing job market make it an attractive option for those seeking quality recovery environments.",
    highlights: [
      {
        icon: "users",
        title: "Strong Recovery Networks",
        description: "Phoenix hosts hundreds of weekly recovery meetings, while Prescott offers an intensive small-town recovery community."
      },
      {
        icon: "building",
        title: "Desert Beauty",
        description: "Stunning natural landscapes provide opportunities for hiking, outdoor meditation, and connecting with nature in recovery."
      },
      {
        icon: "heart",
        title: "Healing Climate",
        description: "Year-round sunshine and dry desert air create a comfortable environment that many find supportive of recovery."
      },
      {
        icon: "shield",
        title: "Affordable Living",
        description: "Lower cost of living than coastal states means quality sober living options at more accessible price points."
      }
    ],
    faqs: [
      {
        question: "What is sober living in Arizona?",
        answer: "Sober living homes in Arizona are structured residences for people in recovery, providing drug-free environments with peer support and accountability while residents work, attend school, or continue outpatient treatment."
      },
      {
        question: "How much does sober living cost in Arizona?",
        answer: "Sober living costs in Arizona typically range from $500 to $2,500 per month. Phoenix metro areas like Scottsdale tend to be higher, while Tucson and other areas offer more affordable options."
      },
      {
        question: "What is Prescott known for in recovery?",
        answer: "Prescott is known as 'The Recovery Town' or 'Recovery Row' due to its high concentration of treatment centers and sober living homes relative to its small population. The town has a strong recovery culture and active fellowship."
      },
      {
        question: "What cities have the most sober living homes in Arizona?",
        answer: "Phoenix has the highest concentration, followed by Scottsdale, Tucson, and Prescott. The Phoenix metro area offers the most options and diversity of price points."
      },
      {
        question: "Is Arizona a good place for recovery?",
        answer: "Yes, Arizona offers established recovery communities, beautiful natural settings for outdoor activities, affordable cost of living, and growing job markets in healthcare, technology, and tourism."
      }
    ],
    topCities: ["phoenix", "scottsdale", "tucson", "prescott", "tempe"]
  },
  {
    slug: "colorado",
    name: "Colorado",
    stateCode: "CO",
    metaTitle: "Sober Living Homes in Colorado | Recovery Housing | Sober Stay",
    metaDescription: "Find sober living homes throughout Colorado. Browse verified recovery housing in Denver, Boulder, Colorado Springs, and more. Begin your mountain recovery journey.",
    openingParagraph: "Colorado offers a unique recovery experience against the backdrop of the Rocky Mountains. The Centennial State has developed strong recovery communities in Denver, Boulder, Colorado Springs, and mountain towns. Colorado's outdoor lifestyle provides natural support for recovery through hiking, skiing, and adventure sports. The state combines stunning natural beauty with thriving metropolitan areas and growing job markets. Sober Stay connects you with verified sober living homes across Colorado, helping you find structured recovery housing in one of America's most beautiful states.",
    whyThisState: "Colorado's recovery community has grown significantly, with Denver emerging as a major recovery hub. The state's outdoor culture aligns naturally with recovery values of health and wellness. Mountain activities provide natural dopamine and endorphin boosts while building sober social connections. Colorado's strong economy in technology, outdoor recreation, and healthcare offers employment opportunities for those rebuilding careers. The combination of metropolitan amenities and easy mountain access makes Colorado uniquely appealing.",
    highlights: [
      {
        icon: "users",
        title: "Active Recovery Community",
        description: "Denver and Boulder host robust recovery meeting networks with strong fellowship and outdoor sober activities."
      },
      {
        icon: "building",
        title: "Mountain Lifestyle",
        description: "Easy access to hiking, skiing, and outdoor adventures provides natural mood benefits and sober social opportunities."
      },
      {
        icon: "heart",
        title: "Wellness Culture",
        description: "Colorado's health-conscious culture supports recovery lifestyles with abundant fitness, nutrition, and mindfulness resources."
      },
      {
        icon: "shield",
        title: "Growing Economy",
        description: "Strong job markets in technology, outdoor recreation, and healthcare provide employment opportunities."
      }
    ],
    faqs: [
      {
        question: "What is sober living in Colorado?",
        answer: "Sober living homes in Colorado are structured residences providing drug and alcohol-free environments for people in recovery. They offer peer support and accountability while allowing residents to work, attend school, or continue treatment."
      },
      {
        question: "How much does sober living cost in Colorado?",
        answer: "Sober living costs in Colorado typically range from $600 to $2,500 per month. Denver and Boulder tend to be higher, while Colorado Springs and other areas may offer more affordable options."
      },
      {
        question: "What cities have the most sober living homes in Colorado?",
        answer: "Denver has the highest concentration of sober living homes, followed by Boulder, Colorado Springs, and Fort Collins. Mountain towns like Vail and Breckenridge also have recovery resources."
      },
      {
        question: "Is Colorado good for outdoor recovery activities?",
        answer: "Absolutely. Colorado is ideal for those who want to incorporate outdoor activities into their recovery. Hiking, skiing, mountain biking, and other adventures provide natural mood benefits and sober social opportunities."
      },
      {
        question: "Can I work while in sober living in Colorado?",
        answer: "Yes, most Colorado sober living homes encourage employment. The state's strong economy in technology, tourism, outdoor recreation, and healthcare provides diverse job opportunities."
      }
    ],
    topCities: ["denver", "boulder", "colorado-springs", "fort-collins", "aurora"]
  }
];

export function getStateData(slug: string): StateData | undefined {
  return STATE_DATA.find(state => state.slug === slug);
}

export function getAllStates(): StateData[] {
  return STATE_DATA;
}

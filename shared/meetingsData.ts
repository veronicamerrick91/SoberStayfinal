export interface MeetingResource {
  name: string;
  type: "AA" | "NA" | "Other";
  url: string;
  phone?: string;
  description: string;
}

export interface StateMeetings {
  stateSlug: string;
  stateName: string;
  resources: MeetingResource[];
  sampleMeetings: {
    name: string;
    city: string;
    type: string;
    schedule: string;
  }[];
}

export const STATE_MEETINGS: StateMeetings[] = [
  {
    stateSlug: "california",
    stateName: "California",
    resources: [
      {
        name: "AA Los Angeles Central Office",
        type: "AA",
        url: "https://lacoaa.org/meetings.php",
        phone: "(323) 936-4343",
        description: "Find 1000+ weekly AA meetings throughout Los Angeles County"
      },
      {
        name: "AA San Diego",
        type: "AA",
        url: "https://aasandiego.org/meetings/",
        phone: "(619) 265-8762",
        description: "Meeting finder for San Diego County AA meetings"
      },
      {
        name: "AA Orange County",
        type: "AA",
        url: "https://aaoc.org/meetings/",
        phone: "(714) 556-4555",
        description: "Orange County AA Intergroup meeting directory"
      },
      {
        name: "NA California",
        type: "NA",
        url: "https://todayna.org/meetings/",
        phone: "(800) 622-2669",
        description: "Narcotics Anonymous meetings throughout California"
      },
      {
        name: "NA Orange County",
        type: "NA",
        url: "https://orangecountyna.org/ocwp/meetings/",
        description: "NA meetings in Orange County with map and schedule"
      }
    ],
    sampleMeetings: [
      { name: "Pacific Group", city: "Los Angeles", type: "AA Open Speaker", schedule: "Fridays 8:00 PM" },
      { name: "Early Risers", city: "San Diego", type: "AA Open Discussion", schedule: "Daily 6:30 AM" },
      { name: "Costa Mesa Alano Club", city: "Costa Mesa", type: "AA Multiple Meetings", schedule: "Daily 7 AM - 10 PM" },
      { name: "Living Clean Group", city: "Los Angeles", type: "NA Open", schedule: "Wednesdays 7:30 PM" }
    ]
  },
  {
    stateSlug: "florida",
    stateName: "Florida",
    resources: [
      {
        name: "AA South Florida Intergroup",
        type: "AA",
        url: "https://aabroward.org/meetings/",
        phone: "(954) 462-0265",
        description: "Find AA meetings in Broward County and South Florida"
      },
      {
        name: "AA Palm Beach County",
        type: "AA",
        url: "https://aapalmbeach.org/meetings/",
        phone: "(561) 655-5700",
        description: "Delray Beach, Boca Raton, West Palm Beach AA meetings"
      },
      {
        name: "AA Miami-Dade",
        type: "AA",
        url: "https://aamiamidade.org/meetings/",
        phone: "(305) 461-2425",
        description: "Miami and Miami-Dade County AA meeting finder"
      },
      {
        name: "NA Florida Region",
        type: "NA",
        url: "https://naflorida.org/meetings/",
        phone: "(888) 779-8786",
        description: "Statewide NA meeting directory for Florida"
      },
      {
        name: "AA Tampa Bay",
        type: "AA",
        url: "https://aatampa-area.org/meetings/",
        phone: "(813) 933-9123",
        description: "Tampa Bay area AA meetings"
      }
    ],
    sampleMeetings: [
      { name: "Delray Central House", city: "Delray Beach", type: "AA Open", schedule: "Daily Multiple Times" },
      { name: "Lambda North", city: "Fort Lauderdale", type: "AA Open", schedule: "Daily 7 PM" },
      { name: "Boca Raton Central", city: "Boca Raton", type: "AA Open Discussion", schedule: "Daily 8 AM" },
      { name: "Clean & Serene", city: "Miami", type: "NA Open", schedule: "Tuesdays 8 PM" }
    ]
  },
  {
    stateSlug: "texas",
    stateName: "Texas",
    resources: [
      {
        name: "AA Austin Intergroup",
        type: "AA",
        url: "https://austinaa.org/meetings/",
        phone: "(512) 444-0071",
        description: "Austin and Central Texas AA meeting directory"
      },
      {
        name: "AA Houston Intergroup",
        type: "AA",
        url: "https://aahouston.org/meetings/",
        phone: "(713) 686-6300",
        description: "Houston area AA meetings with online meeting finder"
      },
      {
        name: "AA Dallas Intergroup",
        type: "AA",
        url: "https://aadallas.org/meetings/",
        phone: "(214) 887-6699",
        description: "Dallas-Fort Worth AA meeting finder"
      },
      {
        name: "NA Texas",
        type: "NA",
        url: "https://texasna.org/find-a-meeting/",
        phone: "(800) 622-2669",
        description: "Statewide NA meeting directory for Texas"
      },
      {
        name: "AA San Antonio",
        type: "AA",
        url: "https://aasanantonio.org/meetings/",
        phone: "(210) 828-6235",
        description: "San Antonio area AA meetings"
      }
    ],
    sampleMeetings: [
      { name: "Lambda Center", city: "Austin", type: "AA Open", schedule: "Daily Multiple Times" },
      { name: "Houston Council", city: "Houston", type: "AA Open Speaker", schedule: "Saturdays 8 PM" },
      { name: "Dallas Central", city: "Dallas", type: "AA Open Discussion", schedule: "Daily 12 PM" },
      { name: "Recovery Central", city: "San Antonio", type: "NA Open", schedule: "Thursdays 7 PM" }
    ]
  },
  {
    stateSlug: "arizona",
    stateName: "Arizona",
    resources: [
      {
        name: "AA Phoenix Intergroup",
        type: "AA",
        url: "https://aaphoenix.org/meetings/",
        phone: "(602) 264-1341",
        description: "Phoenix metro area AA meeting finder"
      },
      {
        name: "AA Tucson Intergroup",
        type: "AA",
        url: "https://aatucson.org/meetings/",
        phone: "(520) 624-4183",
        description: "Tucson and Southern Arizona AA meetings"
      },
      {
        name: "NA Arizona Region",
        type: "NA",
        url: "https://arizona-na.org/meetings/",
        phone: "(480) 897-4636",
        description: "Statewide NA meeting directory for Arizona"
      },
      {
        name: "AA Scottsdale",
        type: "AA",
        url: "https://aascottsdale.org/meetings/",
        description: "Scottsdale area AA meeting schedules"
      },
      {
        name: "Prescott Area AA",
        type: "AA",
        url: "https://prescottaa.org/meetings/",
        phone: "(928) 445-8691",
        description: "Prescott 'Recovery Town' AA meetings"
      }
    ],
    sampleMeetings: [
      { name: "Came to Believe", city: "Phoenix", type: "AA Open", schedule: "Daily 7 AM" },
      { name: "Scottsdale Group", city: "Scottsdale", type: "AA Open Speaker", schedule: "Fridays 8 PM" },
      { name: "Hassayampa Group", city: "Prescott", type: "AA Open", schedule: "Daily Multiple Times" },
      { name: "New Freedom", city: "Tucson", type: "NA Open", schedule: "Wednesdays 7:30 PM" }
    ]
  },
  {
    stateSlug: "colorado",
    stateName: "Colorado",
    resources: [
      {
        name: "AA Denver Intergroup",
        type: "AA",
        url: "https://daccaa.org/meetings/",
        phone: "(303) 322-4440",
        description: "Denver metro area AA meeting directory"
      },
      {
        name: "AA Boulder County",
        type: "AA",
        url: "https://bouldercountyaa.org/meetings/",
        phone: "(303) 447-8201",
        description: "Boulder and surrounding area AA meetings"
      },
      {
        name: "NA Colorado Region",
        type: "NA",
        url: "https://www.nacolorado.org/meetings/",
        phone: "(303) 832-3784",
        description: "Statewide NA meeting directory for Colorado"
      },
      {
        name: "AA Colorado Springs",
        type: "AA",
        url: "https://coloradospringsaa.org/meetings/",
        phone: "(719) 573-5020",
        description: "Colorado Springs area AA meeting finder"
      }
    ],
    sampleMeetings: [
      { name: "Capitol Hill Group", city: "Denver", type: "AA Open", schedule: "Daily 7:30 PM" },
      { name: "Boulder Alano Club", city: "Boulder", type: "AA Multiple Meetings", schedule: "Daily 6 AM - 10 PM" },
      { name: "Pikes Peak Group", city: "Colorado Springs", type: "AA Open Speaker", schedule: "Saturdays 8 PM" },
      { name: "Mile High Group", city: "Denver", type: "NA Open", schedule: "Tuesdays 8 PM" }
    ]
  }
];

// Additional states
const ADDITIONAL_STATES: StateMeetings[] = [
  {
    stateSlug: "ohio",
    stateName: "Ohio",
    resources: [
      { name: "AA Cleveland District Office", type: "AA", url: "https://aacle.org/meetings/", phone: "(216) 241-7387", description: "Cleveland area AA meetings" },
      { name: "AA Cincinnati Intergroup", type: "AA", url: "https://aacincinnati.org/meetings/", phone: "(513) 351-0422", description: "Cincinnati AA meeting finder" },
      { name: "NA Ohio", type: "NA", url: "https://naohio.org/meetings/", phone: "(888) 438-4673", description: "Statewide NA meetings in Ohio" }
    ],
    sampleMeetings: [
      { name: "Cleveland Central", city: "Cleveland", type: "AA Open", schedule: "Daily 12 PM" },
      { name: "Columbus Fellowship", city: "Columbus", type: "AA Open Discussion", schedule: "Daily 7 PM" },
      { name: "Cincinnati Alano", city: "Cincinnati", type: "AA Multiple Meetings", schedule: "Daily 6 AM - 10 PM" }
    ]
  },
  {
    stateSlug: "pennsylvania",
    stateName: "Pennsylvania",
    resources: [
      { name: "AA Philadelphia Intergroup", type: "AA", url: "https://aasepia.org/meetings/", phone: "(215) 923-7900", description: "Philadelphia area AA meetings" },
      { name: "AA Pittsburgh Intergroup", type: "AA", url: "https://wpaarea60.org/meetings/", phone: "(412) 471-7472", description: "Pittsburgh AA meeting finder" },
      { name: "NA Pennsylvania", type: "NA", url: "https://napennsylvania.org/meetings/", description: "Statewide NA meetings in Pennsylvania" }
    ],
    sampleMeetings: [
      { name: "Philly Central", city: "Philadelphia", type: "AA Open", schedule: "Daily Multiple Times" },
      { name: "Pittsburgh Unity", city: "Pittsburgh", type: "AA Open Speaker", schedule: "Saturdays 8 PM" },
      { name: "Bucks County Group", city: "Bucks County", type: "AA Open Discussion", schedule: "Daily 7 PM" }
    ]
  },
  {
    stateSlug: "massachusetts",
    stateName: "Massachusetts",
    resources: [
      { name: "AA Greater Boston", type: "AA", url: "https://aaboston.org/meetings/", phone: "(617) 426-9444", description: "Boston area AA meeting directory" },
      { name: "AA Cape Cod", type: "AA", url: "https://aacapecod.org/meetings/", phone: "(508) 775-7060", description: "Cape Cod AA meetings" },
      { name: "NA New England", type: "NA", url: "https://nane.org/meetings/", phone: "(866) 624-3578", description: "New England NA meeting finder" }
    ],
    sampleMeetings: [
      { name: "Boston Central", city: "Boston", type: "AA Open", schedule: "Daily 12 PM" },
      { name: "Cambridge Group", city: "Cambridge", type: "AA Open Discussion", schedule: "Daily 7 PM" },
      { name: "Cape Recovery", city: "Cape Cod", type: "NA Open", schedule: "Wednesdays 7:30 PM" }
    ]
  },
  {
    stateSlug: "new-york",
    stateName: "New York",
    resources: [
      { name: "AA New York Intergroup", type: "AA", url: "https://www.nyintergroup.org/meetings/", phone: "(212) 647-1680", description: "NYC area AA meeting finder" },
      { name: "AA Long Island", type: "AA", url: "https://www.nassauaa.org/meetings/", phone: "(516) 292-3040", description: "Long Island AA meetings" },
      { name: "NA New York", type: "NA", url: "https://newyorkna.org/meetings/", phone: "(212) 929-6262", description: "New York NA meeting directory" }
    ],
    sampleMeetings: [
      { name: "Perry Street Workshop", city: "New York", type: "AA Open", schedule: "Daily Multiple Times" },
      { name: "Manhattan Central", city: "Manhattan", type: "AA Open Speaker", schedule: "Saturdays 8 PM" },
      { name: "Brooklyn Recovery", city: "Brooklyn", type: "NA Open", schedule: "Thursdays 8 PM" }
    ]
  },
  {
    stateSlug: "new-jersey",
    stateName: "New Jersey",
    resources: [
      { name: "AA Northern NJ Intergroup", type: "AA", url: "https://nnjaa.org/meetings/", phone: "(973) 744-2525", description: "Northern New Jersey AA meetings" },
      { name: "AA Central Jersey", type: "AA", url: "https://centraljerseyi.com/meetings/", phone: "(732) 254-4673", description: "Central NJ AA meeting finder" },
      { name: "NA New Jersey", type: "NA", url: "https://nanj.org/meetings/", phone: "(800) 992-0401", description: "Statewide NJ NA meetings" }
    ],
    sampleMeetings: [
      { name: "Jersey Shore Group", city: "Asbury Park", type: "AA Open", schedule: "Daily 8 PM" },
      { name: "Newark Fellowship", city: "Newark", type: "AA Open Discussion", schedule: "Daily 7 PM" },
      { name: "Princeton Recovery", city: "Princeton", type: "NA Open", schedule: "Tuesdays 7:30 PM" }
    ]
  },
  {
    stateSlug: "georgia",
    stateName: "Georgia",
    resources: [
      { name: "AA Atlanta Intergroup", type: "AA", url: "https://atlantaaa.org/meetings/", phone: "(404) 525-3178", description: "Atlanta metro AA meetings" },
      { name: "NA Georgia", type: "NA", url: "https://nageorgia.org/meetings/", phone: "(678) 365-0498", description: "Statewide GA NA meeting finder" }
    ],
    sampleMeetings: [
      { name: "Midtown Group", city: "Atlanta", type: "AA Open", schedule: "Daily Multiple Times" },
      { name: "Buckhead Fellowship", city: "Buckhead", type: "AA Open Speaker", schedule: "Fridays 8 PM" },
      { name: "Marietta Recovery", city: "Marietta", type: "NA Open", schedule: "Wednesdays 8 PM" }
    ]
  },
  {
    stateSlug: "illinois",
    stateName: "Illinois",
    resources: [
      { name: "AA Chicago Area", type: "AA", url: "https://chicagoaa.org/meetings/", phone: "(312) 346-1475", description: "Chicago and surrounding area AA meetings" },
      { name: "NA Illinois", type: "NA", url: "https://na-illinois.org/meetings/", phone: "(800) 539-0475", description: "Illinois NA meeting directory" }
    ],
    sampleMeetings: [
      { name: "Chicago Central", city: "Chicago", type: "AA Open", schedule: "Daily 12 PM" },
      { name: "Lincoln Park Group", city: "Chicago", type: "AA Open Discussion", schedule: "Daily 7 PM" },
      { name: "Naperville Recovery", city: "Naperville", type: "NA Open", schedule: "Thursdays 7:30 PM" }
    ]
  },
  {
    stateSlug: "washington",
    stateName: "Washington",
    resources: [
      { name: "AA Seattle Intergroup", type: "AA", url: "https://www.seattleaa.org/meetings/", phone: "(206) 587-2838", description: "Seattle area AA meeting finder" },
      { name: "NA Pacific Northwest", type: "NA", url: "https://pnwna.org/meetings/", phone: "(800) 922-4748", description: "Pacific Northwest NA meetings" }
    ],
    sampleMeetings: [
      { name: "Capitol Hill Group", city: "Seattle", type: "AA Open", schedule: "Daily Multiple Times" },
      { name: "Tacoma Fellowship", city: "Tacoma", type: "AA Open Speaker", schedule: "Saturdays 8 PM" },
      { name: "Bellevue Recovery", city: "Bellevue", type: "NA Open", schedule: "Tuesdays 7:30 PM" }
    ]
  },
  {
    stateSlug: "north-carolina",
    stateName: "North Carolina",
    resources: [
      { name: "AA Charlotte Central", type: "AA", url: "https://charlotteaa.org/meetings/", phone: "(704) 377-0244", description: "Charlotte area AA meetings" },
      { name: "AA Triangle Area", type: "AA", url: "https://raleighaa.com/meetings/", phone: "(919) 783-6144", description: "Raleigh-Durham AA meeting finder" },
      { name: "NA North Carolina", type: "NA", url: "https://nancwebsite.org/meetings/", phone: "(800) 691-0047", description: "Statewide NC NA meetings" }
    ],
    sampleMeetings: [
      { name: "Charlotte Central", city: "Charlotte", type: "AA Open", schedule: "Daily 12 PM" },
      { name: "Raleigh Fellowship", city: "Raleigh", type: "AA Open Discussion", schedule: "Daily 7 PM" },
      { name: "Asheville Group", city: "Asheville", type: "AA Open Speaker", schedule: "Fridays 8 PM" }
    ]
  },
  {
    stateSlug: "nevada",
    stateName: "Nevada",
    resources: [
      { name: "AA Las Vegas Central", type: "AA", url: "https://www.lasvegasaa.org/meetings/", phone: "(702) 598-1888", description: "Las Vegas area AA meetings" },
      { name: "AA Reno Area", type: "AA", url: "https://www.renoaa.org/meetings/", phone: "(775) 355-1151", description: "Reno-Tahoe AA meeting finder" },
      { name: "NA Nevada", type: "NA", url: "https://nanevada.org/meetings/", phone: "(866) 365-4637", description: "Nevada NA meeting directory" }
    ],
    sampleMeetings: [
      { name: "Vegas Central", city: "Las Vegas", type: "AA Open", schedule: "Daily Multiple Times" },
      { name: "Henderson Group", city: "Henderson", type: "AA Open Discussion", schedule: "Daily 7 PM" },
      { name: "Reno Recovery", city: "Reno", type: "NA Open", schedule: "Wednesdays 7:30 PM" }
    ]
  },
  {
    stateSlug: "alabama",
    stateName: "Alabama",
    resources: [
      { name: "AA Birmingham", type: "AA", url: "https://www.aabirmingham.org/meetings/", phone: "(205) 324-8788", description: "Birmingham area AA meetings" },
      { name: "NA Alabama/NW Florida", type: "NA", url: "https://www.alnwflna.org/meetings/", description: "Alabama NA meeting finder" }
    ],
    sampleMeetings: [
      { name: "Birmingham Central", city: "Birmingham", type: "AA Open", schedule: "Daily 12 PM" },
      { name: "Mobile Fellowship", city: "Mobile", type: "AA Open Discussion", schedule: "Daily 7 PM" }
    ]
  },
  {
    stateSlug: "alaska",
    stateName: "Alaska",
    resources: [
      { name: "AA Anchorage", type: "AA", url: "https://www.prior.prior-it.com/prior/meetings/", phone: "(907) 272-2312", description: "Anchorage area AA meetings" },
      { name: "NA Alaska", type: "NA", url: "https://www.na.org/meetingsearch/", description: "Alaska NA meeting finder" }
    ],
    sampleMeetings: [
      { name: "Anchorage Central", city: "Anchorage", type: "AA Open", schedule: "Daily Multiple Times" },
      { name: "Fairbanks Group", city: "Fairbanks", type: "AA Open Discussion", schedule: "Daily 7 PM" }
    ]
  },
  {
    stateSlug: "arkansas",
    stateName: "Arkansas",
    resources: [
      { name: "AA Arkansas", type: "AA", url: "https://www.arkansasaa.org/meetings/", phone: "(501) 664-7303", description: "Arkansas AA meeting directory" },
      { name: "NA Arkansas", type: "NA", url: "https://www.na.org/meetingsearch/", description: "Arkansas NA meetings" }
    ],
    sampleMeetings: [
      { name: "Little Rock Central", city: "Little Rock", type: "AA Open", schedule: "Daily 12 PM" },
      { name: "Fayetteville Group", city: "Fayetteville", type: "AA Open Discussion", schedule: "Daily 7 PM" }
    ]
  },
  {
    stateSlug: "connecticut",
    stateName: "Connecticut",
    resources: [
      { name: "AA Connecticut", type: "AA", url: "https://www.ct-aa.org/meetings/", phone: "(866) 783-0159", description: "Connecticut AA meeting finder" },
      { name: "NA Connecticut", type: "NA", url: "https://ctna.org/meetings/", description: "Connecticut NA meetings" }
    ],
    sampleMeetings: [
      { name: "Hartford Central", city: "Hartford", type: "AA Open", schedule: "Daily Multiple Times" },
      { name: "New Haven Group", city: "New Haven", type: "AA Open Discussion", schedule: "Daily 7 PM" }
    ]
  },
  {
    stateSlug: "delaware",
    stateName: "Delaware",
    resources: [
      { name: "AA Delaware", type: "AA", url: "https://www.delawareaa.org/meetings/", phone: "(302) 655-5113", description: "Delaware AA meeting directory" },
      { name: "NA Delaware", type: "NA", url: "https://www.na.org/meetingsearch/", description: "Delaware NA meetings" }
    ],
    sampleMeetings: [
      { name: "Wilmington Central", city: "Wilmington", type: "AA Open", schedule: "Daily 12 PM" },
      { name: "Dover Group", city: "Dover", type: "AA Open Discussion", schedule: "Daily 7 PM" }
    ]
  },
  {
    stateSlug: "hawaii",
    stateName: "Hawaii",
    resources: [
      { name: "AA Hawaii", type: "AA", url: "https://www.aahawaii.org/meetings/", phone: "(808) 946-1438", description: "Hawaii AA meeting finder" },
      { name: "NA Hawaii", type: "NA", url: "https://www.na.org/meetingsearch/", description: "Hawaii NA meetings" }
    ],
    sampleMeetings: [
      { name: "Honolulu Central", city: "Honolulu", type: "AA Open", schedule: "Daily Multiple Times" },
      { name: "Maui Group", city: "Maui", type: "AA Open Discussion", schedule: "Daily 7 PM" }
    ]
  },
  {
    stateSlug: "idaho",
    stateName: "Idaho",
    resources: [
      { name: "AA Idaho", type: "AA", url: "https://www.idahoarea18aa.org/meetings/", phone: "(208) 344-6611", description: "Idaho AA meeting directory" },
      { name: "NA Idaho", type: "NA", url: "https://www.na.org/meetingsearch/", description: "Idaho NA meetings" }
    ],
    sampleMeetings: [
      { name: "Boise Central", city: "Boise", type: "AA Open", schedule: "Daily 12 PM" },
      { name: "Idaho Falls Group", city: "Idaho Falls", type: "AA Open Discussion", schedule: "Daily 7 PM" }
    ]
  },
  {
    stateSlug: "indiana",
    stateName: "Indiana",
    resources: [
      { name: "AA Indianapolis", type: "AA", url: "https://www.indyaa.org/meetings/", phone: "(317) 632-7864", description: "Indianapolis AA meeting finder" },
      { name: "NA Indiana", type: "NA", url: "https://www.na.org/meetingsearch/", description: "Indiana NA meetings" }
    ],
    sampleMeetings: [
      { name: "Indianapolis Central", city: "Indianapolis", type: "AA Open", schedule: "Daily Multiple Times" },
      { name: "Fort Wayne Group", city: "Fort Wayne", type: "AA Open Discussion", schedule: "Daily 7 PM" }
    ]
  },
  {
    stateSlug: "iowa",
    stateName: "Iowa",
    resources: [
      { name: "AA Iowa", type: "AA", url: "https://www.aa-iowa.org/meetings/", phone: "(515) 282-8550", description: "Iowa AA meeting directory" },
      { name: "NA Iowa", type: "NA", url: "https://www.na.org/meetingsearch/", description: "Iowa NA meetings" }
    ],
    sampleMeetings: [
      { name: "Des Moines Central", city: "Des Moines", type: "AA Open", schedule: "Daily 12 PM" },
      { name: "Cedar Rapids Group", city: "Cedar Rapids", type: "AA Open Discussion", schedule: "Daily 7 PM" }
    ]
  },
  {
    stateSlug: "kansas",
    stateName: "Kansas",
    resources: [
      { name: "AA Kansas", type: "AA", url: "https://www.kansasaa.org/meetings/", phone: "(316) 684-9456", description: "Kansas AA meeting finder" },
      { name: "NA Kansas", type: "NA", url: "https://www.na.org/meetingsearch/", description: "Kansas NA meetings" }
    ],
    sampleMeetings: [
      { name: "Wichita Central", city: "Wichita", type: "AA Open", schedule: "Daily Multiple Times" },
      { name: "Kansas City Group", city: "Kansas City", type: "AA Open Discussion", schedule: "Daily 7 PM" }
    ]
  },
  {
    stateSlug: "kentucky",
    stateName: "Kentucky",
    resources: [
      { name: "AA Louisville", type: "AA", url: "https://www.louisvilleaa.org/meetings/", phone: "(502) 582-1849", description: "Louisville AA meeting directory" },
      { name: "NA Kentucky", type: "NA", url: "https://www.na.org/meetingsearch/", description: "Kentucky NA meetings" }
    ],
    sampleMeetings: [
      { name: "Louisville Central", city: "Louisville", type: "AA Open", schedule: "Daily 12 PM" },
      { name: "Lexington Group", city: "Lexington", type: "AA Open Discussion", schedule: "Daily 7 PM" }
    ]
  },
  {
    stateSlug: "louisiana",
    stateName: "Louisiana",
    resources: [
      { name: "AA New Orleans", type: "AA", url: "https://www.aaneworleans.org/meetings/", phone: "(504) 838-3399", description: "New Orleans AA meeting finder" },
      { name: "NA Louisiana", type: "NA", url: "https://www.na.org/meetingsearch/", description: "Louisiana NA meetings" }
    ],
    sampleMeetings: [
      { name: "New Orleans Central", city: "New Orleans", type: "AA Open", schedule: "Daily Multiple Times" },
      { name: "Baton Rouge Group", city: "Baton Rouge", type: "AA Open Discussion", schedule: "Daily 7 PM" }
    ]
  },
  {
    stateSlug: "maine",
    stateName: "Maine",
    resources: [
      { name: "AA Maine", type: "AA", url: "https://www.maineaa.org/meetings/", phone: "(800) 737-6237", description: "Maine AA meeting directory" },
      { name: "NA Maine", type: "NA", url: "https://www.na.org/meetingsearch/", description: "Maine NA meetings" }
    ],
    sampleMeetings: [
      { name: "Portland Central", city: "Portland", type: "AA Open", schedule: "Daily 12 PM" },
      { name: "Bangor Group", city: "Bangor", type: "AA Open Discussion", schedule: "Daily 7 PM" }
    ]
  },
  {
    stateSlug: "maryland",
    stateName: "Maryland",
    resources: [
      { name: "AA Baltimore", type: "AA", url: "https://www.baltimoreaa.org/meetings/", phone: "(410) 663-1922", description: "Baltimore AA meeting finder" },
      { name: "NA Maryland", type: "NA", url: "https://www.na.org/meetingsearch/", description: "Maryland NA meetings" }
    ],
    sampleMeetings: [
      { name: "Baltimore Central", city: "Baltimore", type: "AA Open", schedule: "Daily Multiple Times" },
      { name: "Annapolis Group", city: "Annapolis", type: "AA Open Discussion", schedule: "Daily 7 PM" }
    ]
  },
  {
    stateSlug: "michigan",
    stateName: "Michigan",
    resources: [
      { name: "AA Detroit", type: "AA", url: "https://www.aadeasg.org/meetings/", phone: "(248) 541-6565", description: "Detroit area AA meeting directory" },
      { name: "NA Michigan", type: "NA", url: "https://www.na.org/meetingsearch/", description: "Michigan NA meetings" }
    ],
    sampleMeetings: [
      { name: "Detroit Central", city: "Detroit", type: "AA Open", schedule: "Daily 12 PM" },
      { name: "Grand Rapids Group", city: "Grand Rapids", type: "AA Open Discussion", schedule: "Daily 7 PM" }
    ]
  },
  {
    stateSlug: "minnesota",
    stateName: "Minnesota",
    resources: [
      { name: "AA Minneapolis", type: "AA", url: "https://www.aaminneapolis.org/meetings/", phone: "(952) 922-0880", description: "Minneapolis AA meeting finder" },
      { name: "NA Minnesota", type: "NA", url: "https://www.na.org/meetingsearch/", description: "Minnesota NA meetings" }
    ],
    sampleMeetings: [
      { name: "Minneapolis Central", city: "Minneapolis", type: "AA Open", schedule: "Daily Multiple Times" },
      { name: "St. Paul Group", city: "St. Paul", type: "AA Open Discussion", schedule: "Daily 7 PM" }
    ]
  },
  {
    stateSlug: "mississippi",
    stateName: "Mississippi",
    resources: [
      { name: "AA Mississippi", type: "AA", url: "https://www.msarea42.org/meetings/", phone: "(601) 982-0081", description: "Mississippi AA meeting directory" },
      { name: "NA Mississippi", type: "NA", url: "https://www.na.org/meetingsearch/", description: "Mississippi NA meetings" }
    ],
    sampleMeetings: [
      { name: "Jackson Central", city: "Jackson", type: "AA Open", schedule: "Daily 12 PM" },
      { name: "Biloxi Group", city: "Biloxi", type: "AA Open Discussion", schedule: "Daily 7 PM" }
    ]
  },
  {
    stateSlug: "missouri",
    stateName: "Missouri",
    resources: [
      { name: "AA St. Louis", type: "AA", url: "https://www.aastl.org/meetings/", phone: "(314) 647-3677", description: "St. Louis AA meeting finder" },
      { name: "NA Missouri", type: "NA", url: "https://www.na.org/meetingsearch/", description: "Missouri NA meetings" }
    ],
    sampleMeetings: [
      { name: "St. Louis Central", city: "St. Louis", type: "AA Open", schedule: "Daily Multiple Times" },
      { name: "Kansas City Group", city: "Kansas City", type: "AA Open Discussion", schedule: "Daily 7 PM" }
    ]
  },
  {
    stateSlug: "montana",
    stateName: "Montana",
    resources: [
      { name: "AA Montana", type: "AA", url: "https://www.aa-montana.org/meetings/", phone: "(406) 443-5020", description: "Montana AA meeting directory" },
      { name: "NA Montana", type: "NA", url: "https://www.na.org/meetingsearch/", description: "Montana NA meetings" }
    ],
    sampleMeetings: [
      { name: "Billings Central", city: "Billings", type: "AA Open", schedule: "Daily 12 PM" },
      { name: "Missoula Group", city: "Missoula", type: "AA Open Discussion", schedule: "Daily 7 PM" }
    ]
  },
  {
    stateSlug: "nebraska",
    stateName: "Nebraska",
    resources: [
      { name: "AA Nebraska", type: "AA", url: "https://www.aaneb.org/meetings/", phone: "(402) 556-1880", description: "Nebraska AA meeting finder" },
      { name: "NA Nebraska", type: "NA", url: "https://www.na.org/meetingsearch/", description: "Nebraska NA meetings" }
    ],
    sampleMeetings: [
      { name: "Omaha Central", city: "Omaha", type: "AA Open", schedule: "Daily Multiple Times" },
      { name: "Lincoln Group", city: "Lincoln", type: "AA Open Discussion", schedule: "Daily 7 PM" }
    ]
  },
  {
    stateSlug: "new-hampshire",
    stateName: "New Hampshire",
    resources: [
      { name: "AA New Hampshire", type: "AA", url: "https://www.nhaa.net/meetings/", phone: "(800) 593-3330", description: "New Hampshire AA meeting directory" },
      { name: "NA New Hampshire", type: "NA", url: "https://www.na.org/meetingsearch/", description: "New Hampshire NA meetings" }
    ],
    sampleMeetings: [
      { name: "Manchester Central", city: "Manchester", type: "AA Open", schedule: "Daily 12 PM" },
      { name: "Nashua Group", city: "Nashua", type: "AA Open Discussion", schedule: "Daily 7 PM" }
    ]
  },
  {
    stateSlug: "new-mexico",
    stateName: "New Mexico",
    resources: [
      { name: "AA Albuquerque", type: "AA", url: "https://www.albuquerqueaa.org/meetings/", phone: "(505) 266-1900", description: "Albuquerque AA meeting finder" },
      { name: "NA New Mexico", type: "NA", url: "https://www.na.org/meetingsearch/", description: "New Mexico NA meetings" }
    ],
    sampleMeetings: [
      { name: "Albuquerque Central", city: "Albuquerque", type: "AA Open", schedule: "Daily Multiple Times" },
      { name: "Santa Fe Group", city: "Santa Fe", type: "AA Open Discussion", schedule: "Daily 7 PM" }
    ]
  },
  {
    stateSlug: "north-dakota",
    stateName: "North Dakota",
    resources: [
      { name: "AA North Dakota", type: "AA", url: "https://www.area36.org/meetings/", phone: "(701) 235-7335", description: "North Dakota AA meeting directory" },
      { name: "NA North Dakota", type: "NA", url: "https://www.na.org/meetingsearch/", description: "North Dakota NA meetings" }
    ],
    sampleMeetings: [
      { name: "Fargo Central", city: "Fargo", type: "AA Open", schedule: "Daily 12 PM" },
      { name: "Bismarck Group", city: "Bismarck", type: "AA Open Discussion", schedule: "Daily 7 PM" }
    ]
  },
  {
    stateSlug: "oklahoma",
    stateName: "Oklahoma",
    resources: [
      { name: "AA Oklahoma City", type: "AA", url: "https://www.okcintergroup.org/meetings/", phone: "(405) 524-1100", description: "Oklahoma City AA meeting finder" },
      { name: "NA Oklahoma", type: "NA", url: "https://www.na.org/meetingsearch/", description: "Oklahoma NA meetings" }
    ],
    sampleMeetings: [
      { name: "Oklahoma City Central", city: "Oklahoma City", type: "AA Open", schedule: "Daily Multiple Times" },
      { name: "Tulsa Group", city: "Tulsa", type: "AA Open Discussion", schedule: "Daily 7 PM" }
    ]
  },
  {
    stateSlug: "oregon",
    stateName: "Oregon",
    resources: [
      { name: "AA Portland", type: "AA", url: "https://www.pdxaa.org/meetings/", phone: "(503) 223-8569", description: "Portland AA meeting directory" },
      { name: "NA Oregon", type: "NA", url: "https://www.na.org/meetingsearch/", description: "Oregon NA meetings" }
    ],
    sampleMeetings: [
      { name: "Portland Central", city: "Portland", type: "AA Open", schedule: "Daily 12 PM" },
      { name: "Eugene Group", city: "Eugene", type: "AA Open Discussion", schedule: "Daily 7 PM" }
    ]
  },
  {
    stateSlug: "rhode-island",
    stateName: "Rhode Island",
    resources: [
      { name: "AA Rhode Island", type: "AA", url: "https://www.aari.org/meetings/", phone: "(401) 438-8860", description: "Rhode Island AA meeting finder" },
      { name: "NA Rhode Island", type: "NA", url: "https://www.na.org/meetingsearch/", description: "Rhode Island NA meetings" }
    ],
    sampleMeetings: [
      { name: "Providence Central", city: "Providence", type: "AA Open", schedule: "Daily Multiple Times" },
      { name: "Newport Group", city: "Newport", type: "AA Open Discussion", schedule: "Daily 7 PM" }
    ]
  },
  {
    stateSlug: "south-carolina",
    stateName: "South Carolina",
    resources: [
      { name: "AA South Carolina", type: "AA", url: "https://www.area62aa.org/meetings/", phone: "(843) 722-8265", description: "South Carolina AA meeting directory" },
      { name: "NA South Carolina", type: "NA", url: "https://www.na.org/meetingsearch/", description: "South Carolina NA meetings" }
    ],
    sampleMeetings: [
      { name: "Charleston Central", city: "Charleston", type: "AA Open", schedule: "Daily 12 PM" },
      { name: "Columbia Group", city: "Columbia", type: "AA Open Discussion", schedule: "Daily 7 PM" }
    ]
  },
  {
    stateSlug: "south-dakota",
    stateName: "South Dakota",
    resources: [
      { name: "AA South Dakota", type: "AA", url: "https://www.area63.org/meetings/", phone: "(605) 352-8958", description: "South Dakota AA meeting finder" },
      { name: "NA South Dakota", type: "NA", url: "https://www.na.org/meetingsearch/", description: "South Dakota NA meetings" }
    ],
    sampleMeetings: [
      { name: "Sioux Falls Central", city: "Sioux Falls", type: "AA Open", schedule: "Daily Multiple Times" },
      { name: "Rapid City Group", city: "Rapid City", type: "AA Open Discussion", schedule: "Daily 7 PM" }
    ]
  },
  {
    stateSlug: "tennessee",
    stateName: "Tennessee",
    resources: [
      { name: "AA Nashville", type: "AA", url: "https://www.aanashville.org/meetings/", phone: "(615) 831-1050", description: "Nashville AA meeting directory" },
      { name: "NA Tennessee", type: "NA", url: "https://www.na.org/meetingsearch/", description: "Tennessee NA meetings" }
    ],
    sampleMeetings: [
      { name: "Nashville Central", city: "Nashville", type: "AA Open", schedule: "Daily 12 PM" },
      { name: "Memphis Group", city: "Memphis", type: "AA Open Discussion", schedule: "Daily 7 PM" }
    ]
  },
  {
    stateSlug: "utah",
    stateName: "Utah",
    resources: [
      { name: "AA Salt Lake City", type: "AA", url: "https://www.slcintergroup.org/meetings/", phone: "(801) 484-7871", description: "Salt Lake City AA meeting finder" },
      { name: "NA Utah", type: "NA", url: "https://www.na.org/meetingsearch/", description: "Utah NA meetings" }
    ],
    sampleMeetings: [
      { name: "Salt Lake Central", city: "Salt Lake City", type: "AA Open", schedule: "Daily Multiple Times" },
      { name: "Provo Group", city: "Provo", type: "AA Open Discussion", schedule: "Daily 7 PM" }
    ]
  },
  {
    stateSlug: "vermont",
    stateName: "Vermont",
    resources: [
      { name: "AA Vermont", type: "AA", url: "https://www.aavt.org/meetings/", phone: "(802) 864-1212", description: "Vermont AA meeting directory" },
      { name: "NA Vermont", type: "NA", url: "https://www.na.org/meetingsearch/", description: "Vermont NA meetings" }
    ],
    sampleMeetings: [
      { name: "Burlington Central", city: "Burlington", type: "AA Open", schedule: "Daily 12 PM" },
      { name: "Montpelier Group", city: "Montpelier", type: "AA Open Discussion", schedule: "Daily 7 PM" }
    ]
  },
  {
    stateSlug: "virginia",
    stateName: "Virginia",
    resources: [
      { name: "AA Virginia", type: "AA", url: "https://www.aavirginia.org/meetings/", phone: "(804) 355-1212", description: "Virginia AA meeting finder" },
      { name: "NA Virginia", type: "NA", url: "https://www.na.org/meetingsearch/", description: "Virginia NA meetings" }
    ],
    sampleMeetings: [
      { name: "Richmond Central", city: "Richmond", type: "AA Open", schedule: "Daily Multiple Times" },
      { name: "Virginia Beach Group", city: "Virginia Beach", type: "AA Open Discussion", schedule: "Daily 7 PM" }
    ]
  },
  {
    stateSlug: "west-virginia",
    stateName: "West Virginia",
    resources: [
      { name: "AA West Virginia", type: "AA", url: "https://www.aawv.org/meetings/", phone: "(304) 344-4852", description: "West Virginia AA meeting directory" },
      { name: "NA West Virginia", type: "NA", url: "https://www.na.org/meetingsearch/", description: "West Virginia NA meetings" }
    ],
    sampleMeetings: [
      { name: "Charleston Central", city: "Charleston", type: "AA Open", schedule: "Daily 12 PM" },
      { name: "Huntington Group", city: "Huntington", type: "AA Open Discussion", schedule: "Daily 7 PM" }
    ]
  },
  {
    stateSlug: "wisconsin",
    stateName: "Wisconsin",
    resources: [
      { name: "AA Milwaukee", type: "AA", url: "https://www.aamilwaukee.com/meetings/", phone: "(414) 771-9119", description: "Milwaukee AA meeting finder" },
      { name: "NA Wisconsin", type: "NA", url: "https://www.na.org/meetingsearch/", description: "Wisconsin NA meetings" }
    ],
    sampleMeetings: [
      { name: "Milwaukee Central", city: "Milwaukee", type: "AA Open", schedule: "Daily Multiple Times" },
      { name: "Madison Group", city: "Madison", type: "AA Open Discussion", schedule: "Daily 7 PM" }
    ]
  },
  {
    stateSlug: "wyoming",
    stateName: "Wyoming",
    resources: [
      { name: "AA Wyoming", type: "AA", url: "https://www.wyomingaa.org/meetings/", phone: "(307) 265-4041", description: "Wyoming AA meeting directory" },
      { name: "NA Wyoming", type: "NA", url: "https://www.na.org/meetingsearch/", description: "Wyoming NA meetings" }
    ],
    sampleMeetings: [
      { name: "Cheyenne Central", city: "Cheyenne", type: "AA Open", schedule: "Daily 12 PM" },
      { name: "Casper Group", city: "Casper", type: "AA Open Discussion", schedule: "Daily 7 PM" }
    ]
  }
];

// Combine all states
const ALL_STATE_MEETINGS = [...STATE_MEETINGS, ...ADDITIONAL_STATES];

export function getStateMeetings(stateSlug: string): StateMeetings | undefined {
  return ALL_STATE_MEETINGS.find(s => s.stateSlug === stateSlug);
}

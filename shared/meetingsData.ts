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
  }
];

// Combine all states
const ALL_STATE_MEETINGS = [...STATE_MEETINGS, ...ADDITIONAL_STATES];

export function getStateMeetings(stateSlug: string): StateMeetings | undefined {
  return ALL_STATE_MEETINGS.find(s => s.stateSlug === stateSlug);
}

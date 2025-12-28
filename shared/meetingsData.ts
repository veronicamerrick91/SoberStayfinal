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

export function getStateMeetings(stateSlug: string): StateMeetings | undefined {
  return STATE_MEETINGS.find(s => s.stateSlug === stateSlug);
}

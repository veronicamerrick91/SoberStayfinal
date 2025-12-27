import { ExternalLink } from "lucide-react";

export interface MeetingDirectory {
  name: string;
  abbreviation: string;
  description: string;
  getStateUrl: (stateCode: string, stateName: string) => string;
  color: string;
}

const STATE_CODES: Record<string, string> = {
  "Alabama": "AL", "Alaska": "AK", "Arizona": "AZ", "Arkansas": "AR", "California": "CA",
  "Colorado": "CO", "Connecticut": "CT", "Delaware": "DE", "Florida": "FL", "Georgia": "GA",
  "Hawaii": "HI", "Idaho": "ID", "Illinois": "IL", "Indiana": "IN", "Iowa": "IA",
  "Kansas": "KS", "Kentucky": "KY", "Louisiana": "LA", "Maine": "ME", "Maryland": "MD",
  "Massachusetts": "MA", "Michigan": "MI", "Minnesota": "MN", "Mississippi": "MS", "Missouri": "MO",
  "Montana": "MT", "Nebraska": "NE", "Nevada": "NV", "New Hampshire": "NH", "New Jersey": "NJ",
  "New Mexico": "NM", "New York": "NY", "North Carolina": "NC", "North Dakota": "ND", "Ohio": "OH",
  "Oklahoma": "OK", "Oregon": "OR", "Pennsylvania": "PA", "Rhode Island": "RI", "South Carolina": "SC",
  "South Dakota": "SD", "Tennessee": "TN", "Texas": "TX", "Utah": "UT", "Vermont": "VT",
  "Virginia": "VA", "Washington": "WA", "West Virginia": "WV", "Wisconsin": "WI", "Wyoming": "WY",
  "District of Columbia": "DC"
};

export function getStateCode(stateName: string): string {
  return STATE_CODES[stateName] || stateName.toUpperCase().slice(0, 2);
}

export const meetingDirectories: MeetingDirectory[] = [
  {
    name: "Alcoholics Anonymous",
    abbreviation: "AA",
    description: "12-step program for alcohol addiction",
    getStateUrl: (stateCode: string, stateName: string) => {
      return `https://www.aa.org/find-aa/north-america`;
    },
    color: "bg-blue-500/10 text-blue-400 border-blue-500/30"
  },
  {
    name: "Narcotics Anonymous",
    abbreviation: "NA",
    description: "12-step program for drug addiction",
    getStateUrl: (stateCode: string, stateName: string) => {
      return `https://www.na.org/meetingsearch/`;
    },
    color: "bg-green-500/10 text-green-400 border-green-500/30"
  },
  {
    name: "Cocaine Anonymous",
    abbreviation: "CA",
    description: "12-step program for cocaine and other substances",
    getStateUrl: (stateCode: string, stateName: string) => {
      return `https://ca.org/meetings/`;
    },
    color: "bg-purple-500/10 text-purple-400 border-purple-500/30"
  },
  {
    name: "SMART Recovery",
    abbreviation: "SMART",
    description: "Science-based addiction recovery support",
    getStateUrl: (stateCode: string, stateName: string) => {
      return `https://www.smartrecovery.org/community/calendar.php`;
    },
    color: "bg-orange-500/10 text-orange-400 border-orange-500/30"
  },
  {
    name: "Recovery Dharma",
    abbreviation: "Dharma",
    description: "Buddhist-inspired addiction recovery",
    getStateUrl: (stateCode: string, stateName: string) => {
      return `https://recoverydharma.org/find-a-meeting`;
    },
    color: "bg-teal-500/10 text-teal-400 border-teal-500/30"
  }
];

export function getMeetingDirectoriesForState(stateName: string) {
  const stateCode = getStateCode(stateName);
  return meetingDirectories.map(dir => ({
    ...dir,
    url: dir.getStateUrl(stateCode, stateName)
  }));
}

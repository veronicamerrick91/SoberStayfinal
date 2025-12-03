export type SupervisionType = "Peer Ran" | "Supervised" | "Integrated Treatment" | "Monitored";

export const SUPERVISION_DEFINITIONS: Record<SupervisionType, string> = {
  "Peer Ran": " democratically run by the residents themselves, with no paid staff living on-site. Rules are enforced by the community.",
  "Supervised": "House manager or senior resident lives on-site to enforce rules, provide support, and ensure safety.",
  "Monitored": "Staff are present during specific hours or check in regularly, but may not live on-site 24/7.",
  "Integrated Treatment": "Clinical services (therapy, counseling) are provided in-house or closely coordinated with a treatment center."
};

export interface NearbyAmenity {
  category: "Transportation" | "Food" | "Groceries" | "Therapy/IOP" | "Recovery Meetings";
  items: { name: string; distance: string }[];
}

export interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  price: number;
  pricePeriod: "weekly" | "monthly";
  bedsAvailable: number;
  totalBeds: number;
  gender: "Men" | "Women" | "Co-ed";
  isVerified: boolean;
  roomType: "Private Room" | "Shared Room";
  
  // Filters
  isMatFriendly: boolean;
  isPetFriendly: boolean;
  isLgbtqFriendly: boolean;
  isFaithBased: boolean;
  acceptsInsurance: boolean;
  
  supervisionType: SupervisionType;
  
  image: string;
  description: string;
  amenities: string[]; // Physical amenities
  inclusions: string[]; // What's included in price
  houseRules: string[];
  requirements: string[];
  nearbyAmenities: NearbyAmenity[];
}

import home1 from "@assets/stock_images/modern_comfortable_l_a00ffa5e.jpg";
import home2 from "@assets/stock_images/modern_comfortable_l_54ef374c.jpg";
import home3 from "@assets/stock_images/suburban_house_exter_44ed1d5c.jpg";
import home4 from "@assets/stock_images/suburban_house_exter_a5a19182.jpg";

export const MOCK_PROPERTIES: Property[] = [
  {
    id: "1",
    name: "Serenity House Boston",
    address: "123 Recovery Way",
    city: "Boston",
    state: "MA",
    price: 1200,
    pricePeriod: "monthly",
    bedsAvailable: 2,
    totalBeds: 8,
    gender: "Men",
    isVerified: true,
    roomType: "Shared Room",
    isMatFriendly: true,
    isPetFriendly: false,
    isLgbtqFriendly: true,
    isFaithBased: false,
    acceptsInsurance: false,
    supervisionType: "Supervised",
    image: home1,
    description: "A structured sober living environment focused on community and accountability. We provide a safe haven for men in early recovery, with 24/7 staff support and a strong emphasis on 12-step participation.",
    amenities: ["Washer/Dryer", "Kitchen Access", "On-site Gym", "Parking", "Garden/Outdoor Space"],
    inclusions: ["Utilities (All)", "WiFi / Internet", "Drug Testing", "Linens & Bedding", "Case Management"],
    houseRules: ["No drugs or alcohol", "Curfew 11pm", "Weekly house meetings", "Chore rotation", "Guests must be approved", "No overnight visitors without notice"],
    requirements: ["Must attend 3 meetings per week", "Valid ID required", "Minimum 30 days sober", "Commitment to 6+ month stay", "Employment or education program"],
    nearbyAmenities: [
      { category: "Transportation", items: [{ name: "Bus Stop #42", distance: "0.1 mi" }, { name: "Red Line Station", distance: "0.5 mi" }] },
      { category: "Recovery Meetings", items: [{ name: "Boston AA Central", distance: "0.5 mi" }] },
      { category: "Groceries", items: [{ name: "Whole Foods", distance: "0.3 mi" }] }
    ]
  },
  {
    id: "2",
    name: "Hope Haven for Women",
    address: "456 Healing Path",
    city: "Cambridge",
    state: "MA",
    price: 1400,
    pricePeriod: "monthly",
    bedsAvailable: 1,
    totalBeds: 6,
    gender: "Women",
    isVerified: true,
    roomType: "Private Room",
    isMatFriendly: false,
    isPetFriendly: true,
    isLgbtqFriendly: true,
    isFaithBased: true,
    acceptsInsurance: true,
    supervisionType: "Monitored",
    image: home2,
    description: "A warm, homelike setting for women building a new life. We welcome pets and have a large backyard garden.",
    amenities: ["Washer/Dryer", "Kitchen Access", "Garden/Outdoor Space", "Common Area / Lounge"],
    inclusions: ["Food / Meals", "Utilities (All)", "WiFi / Internet", "Cable / Streaming", "Therapy Sessions"],
    houseRules: ["Quiet hours 10pm-8am", "Smoking outside only", "Kitchen cleaned after use", "Monthly rent due by 1st", "No unauthorized guests"],
    requirements: ["Women only", "Minimum 14 days sober", "Mental health assessment required", "Pet policy compliance", "Willing to participate in groups"],
    nearbyAmenities: [
      { category: "Therapy/IOP", items: [{ name: "Cambridge Health", distance: "1.0 mi" }] },
      { category: "Food", items: [{ name: "Main St Cafe", distance: "0.2 mi" }] }
    ]
  },
  {
    id: "3",
    name: "New Beginnings Co-ed",
    address: "789 Start Over St",
    city: "Quincy",
    state: "MA",
    price: 950,
    pricePeriod: "monthly",
    bedsAvailable: 4,
    totalBeds: 12,
    gender: "Co-ed",
    isVerified: false,
    roomType: "Shared Room",
    isMatFriendly: true,
    isPetFriendly: false,
    isLgbtqFriendly: true,
    isFaithBased: false,
    acceptsInsurance: false,
    supervisionType: "Peer Ran",
    image: home3,
    description: "Affordable peer-run housing for motivated individuals. Strong community focus with weekly house meetings.",
    amenities: ["Washer/Dryer", "Kitchen Access", "Parking", "Designated Smoking Area"],
    inclusions: ["Utilities (All)", "WiFi / Internet", "Peer Support"],
    houseRules: ["Democratic decision making", "Mandatory house meetings", "Shared meal prep Sundays", "No violence or theft", "Community service hours required"],
    requirements: ["Open to all genders", "Minimum 7 days sober", "Able to participate in peer governance", "Conflict resolution commitment"],
    nearbyAmenities: [
      { category: "Transportation", items: [{ name: "Quincy Center T", distance: "0.8 mi" }] }
    ]
  },
  {
    id: "4",
    name: "Coastal Recovery Residence",
    address: "321 Ocean Blvd",
    city: "Plymouth",
    state: "MA",
    price: 2500,
    pricePeriod: "monthly",
    bedsAvailable: 0,
    totalBeds: 10,
    gender: "Men",
    isVerified: true,
    roomType: "Private Room",
    isMatFriendly: true,
    isPetFriendly: false,
    isLgbtqFriendly: false,
    isFaithBased: false,
    acceptsInsurance: true,
    supervisionType: "Integrated Treatment",
    image: home4,
    description: "Luxury sober living with integrated clinical services and ocean views. Chef-prepared meals and daily transport included.",
    amenities: ["On-site Gym", "Swimming Pool", "Garden/Outdoor Space", "Common Area / Lounge", "Parking"],
    inclusions: ["Food / Meals", "Transportation", "Utilities (All)", "WiFi / Internet", "Cable / Streaming", "Gym Access", "Therapy Sessions", "Drug Testing"],
    houseRules: ["Professional dress for outings", "No visitors without advance notice", "Bedtime 10:30pm weekdays", "Fitness classes mandatory", "Random UA testing"],
    requirements: ["Private room only", "Minimum 3 months sober", "Aftercare plan required", "Medical clearance", "Insurance or payment plan"],
    nearbyAmenities: [
      { category: "Recovery Meetings", items: [{ name: "Plymouth Group", distance: "1.5 mi" }] }
    ]
  },
  {
    id: "5",
    name: "Worcester Wellness Home",
    address: "101 Central St",
    city: "Worcester",
    state: "MA",
    price: 800,
    pricePeriod: "monthly",
    bedsAvailable: 3,
    totalBeds: 10,
    gender: "Co-ed",
    isVerified: true,
    roomType: "Shared Room",
    isMatFriendly: true,
    isPetFriendly: true,
    isLgbtqFriendly: true,
    isFaithBased: false,
    acceptsInsurance: false,
    supervisionType: "Supervised",
    image: home2,
    description: "A supportive and inclusive environment in the heart of Worcester. We focus on life skills and reintegration into the community.",
    amenities: ["Washer/Dryer", "Kitchen Access", "Common Area / Lounge"],
    inclusions: ["Utilities (All)", "WiFi / Internet", "Peer Support"],
    houseRules: ["All residents welcome", "Respectful communication", "Shared cleaning duties", "No drug paraphernalia", "Midnight curfew"],
    requirements: ["Minimum 2 weeks sober", "Open to all genders", "Willingness to participate in community", "Basic self-care skills"],
    nearbyAmenities: [
      { category: "Transportation", items: [{ name: "Union Station", distance: "0.5 mi" }] },
      { category: "Groceries", items: [{ name: "Price Chopper", distance: "0.4 mi" }] }
    ]
  }
];

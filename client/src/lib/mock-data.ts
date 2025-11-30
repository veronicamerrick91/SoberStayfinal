export type SupervisionType = "Peer Ran" | "Supervised" | "Integrated Treatment" | "Monitored";

export const SUPERVISION_DEFINITIONS: Record<SupervisionType, string> = {
  "Peer Ran": " democratically run by the residents themselves, with no paid staff living on-site. Rules are enforced by the community.",
  "Supervised": "House manager or senior resident lives on-site to enforce rules, provide support, and ensure safety.",
  "Monitored": "Staff are present during specific hours or check in regularly, but may not live on-site 24/7.",
  "Integrated Treatment": "Clinical services (therapy, counseling) are provided in-house or closely coordinated with a treatment center."
};

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
  
  // Filters
  isMatFriendly: boolean;
  isPetFriendly: boolean;
  isLgbtqFriendly: boolean;
  isFaithBased: boolean;
  acceptsInsurance: boolean;
  
  supervisionType: SupervisionType;
  
  image: string;
  description: string;
  amenities: string[];
}

import home1 from "@assets/stock_images/modern_comfortable_l_a00ffa5e.jpg";
import home2 from "@assets/stock_images/modern_comfortable_l_54ef374c.jpg";
import home3 from "@assets/stock_images/suburban_house_exter_44ed1d5c.jpg";
import home4 from "@assets/stock_images/suburban_house_exter_a5a19182.jpg";

export const MOCK_PROPERTIES: Property[] = [
  {
    id: "1",
    name: "Serenity House",
    address: "123 Maple Street",
    city: "Austin",
    state: "TX",
    price: 250,
    pricePeriod: "weekly",
    bedsAvailable: 2,
    totalBeds: 8,
    gender: "Men",
    isVerified: true,
    isMatFriendly: true,
    isPetFriendly: false,
    isLgbtqFriendly: true,
    isFaithBased: false,
    acceptsInsurance: false,
    supervisionType: "Supervised",
    image: home3,
    description: "A structured, supportive environment for men in early recovery. Located near public transit and meetings.",
    amenities: ["WiFi", "Cable TV", "Gym Access", "House Meetings", "Drug Testing"]
  },
  {
    id: "2",
    name: "New Beginnings Cottage",
    address: "456 Oak Avenue",
    city: "Austin",
    state: "TX",
    price: 300,
    pricePeriod: "weekly",
    bedsAvailable: 1,
    totalBeds: 6,
    gender: "Women",
    isVerified: true,
    isMatFriendly: false,
    isPetFriendly: true,
    isLgbtqFriendly: true,
    isFaithBased: false,
    acceptsInsurance: true,
    supervisionType: "Integrated Treatment",
    image: home1,
    description: "Quiet, comfortable home for women. Focus on trauma-informed care and community building.",
    amenities: ["Private Rooms Available", "Garden", "Weekly Dinners", "Transport Assistance"]
  },
  {
    id: "3",
    name: "The Harbor",
    address: "789 Pine Lane",
    city: "Round Rock",
    state: "TX",
    price: 200,
    pricePeriod: "weekly",
    bedsAvailable: 4,
    totalBeds: 12,
    gender: "Co-ed",
    isVerified: false,
    isMatFriendly: true,
    isPetFriendly: false,
    isLgbtqFriendly: true,
    isFaithBased: true,
    acceptsInsurance: false,
    supervisionType: "Peer Ran",
    image: home4,
    description: "Affordable sober living with a strong community focus. Large backyard and shared living spaces.",
    amenities: ["WiFi", "Laundry", "Parking", "Close to Bus Line"]
  },
  {
    id: "4",
    name: "Pathway Home",
    address: "321 Cedar Blvd",
    city: "Georgetown",
    state: "TX",
    price: 1200,
    pricePeriod: "monthly",
    bedsAvailable: 0,
    totalBeds: 5,
    gender: "Men",
    isVerified: true,
    isMatFriendly: true,
    isPetFriendly: false,
    isLgbtqFriendly: false,
    isFaithBased: true,
    acceptsInsurance: true,
    supervisionType: "Monitored",
    image: home2,
    description: "Upscale sober living environment with executive amenities. Perfect for professionals.",
    amenities: ["Private Rooms", "Chef Kitchen", "Pool", "Home Office"]
  }
];

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
  amenities: string[];
  nearbyAmenities: NearbyAmenity[];
}

import home1 from "@assets/stock_images/modern_comfortable_l_a00ffa5e.jpg";
import home2 from "@assets/stock_images/modern_comfortable_l_54ef374c.jpg";
import home3 from "@assets/stock_images/suburban_house_exter_44ed1d5c.jpg";
import home4 from "@assets/stock_images/suburban_house_exter_a5a19182.jpg";

export const MOCK_PROPERTIES: Property[] = [];

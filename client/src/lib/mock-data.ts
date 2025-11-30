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
    amenities: ["WiFi", "Cable TV", "Gym Access", "House Meetings", "Drug Testing"],
    nearbyAmenities: [
      {
        category: "Transportation",
        items: [
          { name: "Metro Bus Stop (Route 4)", distance: "0.3 mi" },
          { name: "Ride Share Pickup Zone", distance: "0.1 mi" }
        ]
      },
      {
        category: "Food",
        items: [
          { name: "Whole Foods Market", distance: "0.5 mi" },
          { name: "Local Diner (All Day Breakfast)", distance: "0.4 mi" }
        ]
      },
      {
        category: "Groceries",
        items: [
          { name: "Kroger Supermarket", distance: "0.6 mi" },
          { name: "Farmer's Market (Wed/Sat)", distance: "1.2 mi" }
        ]
      },
      {
        category: "Therapy/IOP",
        items: [
          { name: "Austin Recovery Clinic (IOP Programs)", distance: "0.8 mi" },
          { name: "Dr. Sarah's Mental Health Services", distance: "1.1 mi" }
        ]
      },
      {
        category: "Recovery Meetings",
        items: [
          { name: "AA - Downtown Group (Daily 7pm)", distance: "0.4 mi" },
          { name: "NA - Early Birds (Daily 6am)", distance: "0.5 mi" },
          { name: "SMART Recovery - Thursday 8pm", distance: "0.7 mi" },
          { name: "LifeRing Meeting - Monday 7pm", distance: "0.9 mi" }
        ]
      }
    ]
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
    amenities: ["Private Rooms Available", "Garden", "Weekly Dinners", "Transport Assistance"],
    nearbyAmenities: [
      {
        category: "Transportation",
        items: [
          { name: "City Transit Hub", distance: "0.2 mi" },
          { name: "Bike Share Station", distance: "0.3 mi" }
        ]
      },
      {
        category: "Food",
        items: [
          { name: "Organic Cafe", distance: "0.3 mi" },
          { name: "Community Restaurant", distance: "0.6 mi" }
        ]
      },
      {
        category: "Groceries",
        items: [
          { name: "Trader Joe's", distance: "0.4 mi" },
          { name: "Central Market", distance: "1.0 mi" }
        ]
      },
      {
        category: "Therapy/IOP",
        items: [
          { name: "Women's Wellness Center (IOP)", distance: "0.5 mi" },
          { name: "Trauma-Informed Therapy Services", distance: "0.7 mi" }
        ]
      },
      {
        category: "Recovery Meetings",
        items: [
          { name: "AA Women's Group - Daily", distance: "0.4 mi" },
          { name: "NA Newcomers - Tuesday/Thursday", distance: "0.6 mi" },
          { name: "SMART Recovery - Wednesday 7pm", distance: "0.8 mi" },
          { name: "CA - Friday Night Meeting", distance: "1.2 mi" }
        ]
      }
    ]
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
    amenities: ["WiFi", "Laundry", "Parking", "Close to Bus Line"],
    nearbyAmenities: [
      {
        category: "Transportation",
        items: [
          { name: "Round Rock Transit Center", distance: "0.8 mi" },
          { name: "Park & Ride Lot", distance: "1.5 mi" }
        ]
      },
      {
        category: "Food",
        items: [
          { name: "Family Restaurant", distance: "0.5 mi" },
          { name: "Pizza & Pasta Place", distance: "0.7 mi" }
        ]
      },
      {
        category: "Groceries",
        items: [
          { name: "Walmart Supercenter", distance: "1.0 mi" },
          { name: "Tom Thumb Grocery", distance: "1.2 mi" }
        ]
      },
      {
        category: "Therapy/IOP",
        items: [
          { name: "Round Rock Behavioral Health", distance: "1.3 mi" },
          { name: "Community Counseling Center", distance: "1.5 mi" }
        ]
      },
      {
        category: "Recovery Meetings",
        items: [
          { name: "AA - Round Rock Group (Daily)", distance: "0.9 mi" },
          { name: "NA - Evening Meetings", distance: "1.1 mi" },
          { name: "CA Meetings - Thursday", distance: "1.4 mi" },
          { name: "SMART Recovery - Weekend", distance: "1.6 mi" }
        ]
      }
    ]
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
    amenities: ["Private Rooms", "Chef Kitchen", "Pool", "Home Office"],
    nearbyAmenities: [
      {
        category: "Transportation",
        items: [
          { name: "Georgetown Transit Bus", distance: "0.7 mi" },
          { name: "Toll Road Access (I-35)", distance: "1.2 mi" }
        ]
      },
      {
        category: "Food",
        items: [
          { name: "Fine Dining Restaurant", distance: "0.4 mi" },
          { name: "Coffee Shop & Bakery", distance: "0.3 mi" }
        ]
      },
      {
        category: "Groceries",
        items: [
          { name: "Central Market Georgetown", distance: "1.1 mi" },
          { name: "Whole Foods", distance: "1.3 mi" }
        ]
      },
      {
        category: "Therapy/IOP",
        items: [
          { name: "Georgetown Recovery Services (IOP)", distance: "0.6 mi" },
          { name: "Executive Wellness Counseling", distance: "1.0 mi" }
        ]
      },
      {
        category: "Recovery Meetings",
        items: [
          { name: "AA - Professional's Meeting", distance: "0.5 mi" },
          { name: "NA Meetings (Multiple Times)", distance: "0.8 mi" },
          { name: "SMART Recovery - Tuesday 7pm", distance: "1.1 mi" },
          { name: "Celebrate Recovery - Sunday", distance: "1.3 mi" }
        ]
      }
    ]
  }
];

export interface Message {
  id: string;
  ride_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  sender?: {
    id: string;
    name: string;
    avatar?: string;
  };
  isCurrentUser?: boolean;
}

export interface Ride {
  id: string;
  driver_id: string;
  origin: string;
  destination: string;
  date: string;
  time: string;
  available_seats: number;
  price: number;
  status: "scheduled" | "in-progress" | "completed" | "cancelled";
}

export interface RideParticipant {
  id: string;
  ride_id: string;
  user_id: string;
  role: "driver" | "passenger";
  user?: {
    id: string;
    name: string;
    avatar?: string;
    rating?: number;
  };
}

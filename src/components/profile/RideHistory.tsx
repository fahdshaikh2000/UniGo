import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MapPin,
  Calendar,
  Clock,
  Star,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";

interface RideHistoryItemProps {
  id: string;
  date: string;
  time: string;
  origin: string;
  destination: string;
  otherPartyName: string;
  otherPartyAvatar: string;
  otherPartyRating: number;
  price: number;
  status: "completed" | "cancelled";
  asDriver: boolean;
}

const RideHistoryItem: React.FC<RideHistoryItemProps> = ({
  id = "1",
  date = "May 10, 2023",
  time = "2:30 PM",
  origin = "University Campus",
  destination = "Downtown Mall",
  otherPartyName = "Sarah Wilson",
  otherPartyAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
  otherPartyRating = 4.7,
  price = 6.5,
  status = "completed",
  asDriver = false,
}) => {
  return (
    <Card className="mb-4 bg-white border-gray-200 hover:shadow-sm transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <Avatar>
                <AvatarImage src={otherPartyAvatar} alt={otherPartyName} />
                <AvatarFallback>
                  {otherPartyName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </div>

            <div>
              <div className="flex items-center">
                <h3 className="font-medium">{otherPartyName}</h3>
                <Badge variant="outline" className="ml-2 text-xs">
                  {asDriver ? "Passenger" : "Driver"}
                </Badge>
                <div className="flex items-center ml-2">
                  <Star size={14} className="text-yellow-500 fill-yellow-500" />
                  <span className="text-sm ml-1">{otherPartyRating}</span>
                </div>
              </div>

              <div className="mt-2 space-y-1">
                <div className="flex items-center">
                  <Calendar size={14} className="text-gray-500 mr-2" />
                  <span className="text-sm text-gray-600">{date}</span>
                  <Clock size={14} className="text-gray-500 ml-3 mr-2" />
                  <span className="text-sm text-gray-600">{time}</span>
                </div>

                <div className="flex items-center">
                  <MapPin size={14} className="text-gray-500 mr-2" />
                  <span className="text-sm text-gray-600">
                    {origin} → {destination}
                  </span>
                </div>

                <div className="flex items-center">
                  <span className="text-sm font-medium">
                    ${price.toFixed(2)}
                  </span>
                  <Badge
                    variant="outline"
                    className={`ml-2 text-xs ${status === "completed" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}
                  >
                    {status === "completed" ? "Completed" : "Cancelled"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="text-xs">
              <ThumbsUp size={14} className="mr-1" /> Rate
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              Report
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface RideHistoryProps {
  asDriverRides?: RideHistoryItemProps[];
  asPassengerRides?: RideHistoryItemProps[];
}

const RideHistory: React.FC<RideHistoryProps> = ({
  asDriverRides = [
    {
      id: "1",
      date: "May 15, 2023",
      time: "3:30 PM",
      origin: "University Campus",
      destination: "Downtown Mall",
      otherPartyName: "Ayesha Khan",
      otherPartyAvatar:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=ayesha",
      otherPartyRating: 4.7,
      price: 6.5,
      status: "completed" as const,
      asDriver: true,
    },
    {
      id: "2",
      date: "May 12, 2023",
      time: "5:15 PM",
      origin: "University Library",
      destination: "Central Station",
      otherPartyName: "Bilal Malik",
      otherPartyAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bilal",
      otherPartyRating: 4.9,
      price: 8.0,
      status: "completed" as const,
      asDriver: true,
    },
    {
      id: "3",
      date: "May 8, 2023",
      time: "9:00 AM",
      origin: "Student Housing",
      destination: "Science Building",
      otherPartyName: "Fatima Akhtar",
      otherPartyAvatar:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=fatima",
      otherPartyRating: 4.5,
      price: 4.0,
      status: "cancelled" as const,
      asDriver: true,
    },
  ],
  asPassengerRides = [
    {
      id: "4",
      date: "May 18, 2023",
      time: "2:00 PM",
      origin: "University Campus",
      destination: "Shopping Center",
      otherPartyName: "Usman Malik",
      otherPartyAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=usman",
      otherPartyRating: 4.8,
      price: 7.5,
      status: "completed" as const,
      asDriver: false,
    },
    {
      id: "5",
      date: "May 14, 2023",
      time: "11:30 AM",
      origin: "Student Housing",
      destination: "University Campus",
      otherPartyName: "Zainab Qureshi",
      otherPartyAvatar:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=zainab",
      otherPartyRating: 4.6,
      price: 5.0,
      status: "completed" as const,
      asDriver: false,
    },
    {
      id: "6",
      date: "May 10, 2023",
      time: "4:45 PM",
      origin: "University Gym",
      destination: "Downtown",
      otherPartyName: "Hassan Ali",
      otherPartyAvatar:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=hassan",
      otherPartyRating: 4.3,
      price: 9.0,
      status: "completed" as const,
      asDriver: false,
    },
  ],
}) => {
  const [activeTab, setActiveTab] = useState("as-passenger");

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold mb-6">Ride History</h2>

      <Tabs
        defaultValue="as-passenger"
        className="w-full"
        onValueChange={setActiveTab}
      >
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="as-passenger">As Passenger</TabsTrigger>
          <TabsTrigger value="as-driver">As Driver</TabsTrigger>
        </TabsList>

        <TabsContent value="as-passenger" className="space-y-4">
          {asPassengerRides.length > 0 ? (
            asPassengerRides.map((ride) => (
              <RideHistoryItem key={ride.id} {...ride} />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>You haven't taken any rides as a passenger yet.</p>
            </div>
          )}

          {asPassengerRides.length > 0 && (
            <div className="flex justify-center mt-4">
              <Button variant="outline">Load More</Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="as-driver" className="space-y-4">
          {asDriverRides.length > 0 ? (
            asDriverRides.map((ride) => (
              <RideHistoryItem key={ride.id} {...ride} />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>You haven't offered any rides as a driver yet.</p>
            </div>
          )}

          {asDriverRides.length > 0 && (
            <div className="flex justify-center mt-4">
              <Button variant="outline">Load More</Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RideHistory;

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import RideCard from "../rides/RideCard";

interface Ride {
  id: string;
  driverName: string;
  driverAvatar: string;
  driverRating: number;
  origin: string;
  destination: string;
  date: string;
  time: string;
  availableSeats: number;
  price: number;
  carModel: string;
  status: "upcoming" | "completed" | "cancelled";
  type: "driver" | "passenger";
}

interface RideCardsProps {
  upcomingRides?: Ride[];
  pastRides?: Ride[];
  onViewAllUpcoming?: () => void;
  onViewAllPast?: () => void;
  onRequestRide?: (id: string) => void;
}

const RideCards = ({
  upcomingRides = [
    {
      id: "1",
      driverName: "Fahd Niaz Shaikh",
      driverAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=fahd",
      driverRating: 4.8,
      origin: "LUMS Campus",
      destination: "Gulberg",
      date: "May 15, 2023",
      time: "3:30 PM",
      availableSeats: 3,
      price: 500,
      carModel: "Honda City (2020)",
      status: "upcoming",
      type: "passenger",
    },
    {
      id: "2",
      driverName: "Ayesha Khan",
      driverAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ayesha",
      driverRating: 4.9,
      origin: "Bahria Town",
      destination: "Packages Mall",
      date: "May 17, 2023",
      time: "2:00 PM",
      availableSeats: 2,
      price: 450,
      carModel: "Honda Civic (2020)",
      status: "upcoming",
      type: "passenger",
    },
    {
      id: "3",
      driverName: "Aap",
      driverAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=you",
      driverRating: 4.7,
      origin: "LUMS Campus",
      destination: "Allama Iqbal Airport",
      date: "May 20, 2023",
      time: "10:00 AM",
      availableSeats: 3,
      price: 1200,
      carModel: "Aap ki Gaari",
      status: "upcoming",
      type: "driver",
    },
  ],
  pastRides = [
    {
      id: "4",
      driverName: "Ali Ahmed",
      driverAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ali",
      driverRating: 4.6,
      origin: "LUMS Campus",
      destination: "Alhamra Arts Council",
      date: "May 5, 2023",
      time: "7:00 PM",
      availableSeats: 0,
      price: 600,
      carModel: "Suzuki Swift (2019)",
      status: "completed",
      type: "passenger",
    },
    {
      id: "5",
      driverName: "Aap",
      driverAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=you",
      driverRating: 4.7,
      origin: "Model Town",
      destination: "LUMS Campus",
      date: "May 3, 2023",
      time: "8:30 AM",
      availableSeats: 0,
      price: 400,
      carModel: "Aap ki Gaari",
      status: "completed",
      type: "driver",
    },
  ],
  onViewAllUpcoming = () => {},
  onViewAllPast = () => {},
  onRequestRide = () => {},
}: RideCardsProps) => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [scrollPosition, setScrollPosition] = useState(0);

  const scrollLeft = () => {
    setScrollPosition(Math.max(0, scrollPosition - 350));
  };

  const scrollRight = () => {
    setScrollPosition(scrollPosition + 350);
  };

  return (
    <div className="w-full bg-gray-50 p-6 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Your Rides</h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={scrollLeft}
            className="rounded-full"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={scrollRight}
            className="rounded-full"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <Tabs
        defaultValue="upcoming"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="mb-4">
          <TabsTrigger value="upcoming" className="relative">
            Upcoming
            <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {upcomingRides.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="past">Past Rides</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingRides.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-lg border border-gray-200">
              <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-3" />
              <h3 className="text-lg font-medium text-gray-900">
                No upcoming rides
              </h3>
              <p className="text-gray-500 mt-1">
                Create a ride or find one to join
              </p>
              <Button className="mt-4">Find a Ride</Button>
            </div>
          ) : (
            <>
              <ScrollArea
                className="w-full overflow-x-auto pb-4"
                style={{ scrollLeft: scrollPosition }}
              >
                <div
                  className="flex space-x-4"
                  style={{ minWidth: "max-content" }}
                >
                  {upcomingRides.map((ride) => (
                    <div key={ride.id} className="w-[350px] flex-shrink-0">
                      <RideCard
                        id={ride.id}
                        driverName={ride.driverName}
                        driverAvatar={ride.driverAvatar}
                        driverRating={ride.driverRating}
                        origin={ride.origin}
                        destination={ride.destination}
                        date={ride.date}
                        time={ride.time}
                        availableSeats={ride.availableSeats}
                        price={ride.price}
                        carModel={ride.carModel}
                        onRequestRide={onRequestRide}
                      />
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="flex justify-center">
                <Button variant="outline" onClick={onViewAllUpcoming}>
                  View All Upcoming Rides
                </Button>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {pastRides.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-lg border border-gray-200">
              <Clock className="mx-auto h-12 w-12 text-gray-400 mb-3" />
              <h3 className="text-lg font-medium text-gray-900">
                No past rides
              </h3>
              <p className="text-gray-500 mt-1">
                Your completed rides will appear here
              </p>
            </div>
          ) : (
            <>
              <ScrollArea
                className="w-full overflow-x-auto pb-4"
                style={{ scrollLeft: scrollPosition }}
              >
                <div
                  className="flex space-x-4"
                  style={{ minWidth: "max-content" }}
                >
                  {pastRides.map((ride) => (
                    <div key={ride.id} className="w-[350px] flex-shrink-0">
                      <RideCard
                        id={ride.id}
                        driverName={ride.driverName}
                        driverAvatar={ride.driverAvatar}
                        driverRating={ride.driverRating}
                        origin={ride.origin}
                        destination={ride.destination}
                        date={ride.date}
                        time={ride.time}
                        availableSeats={ride.availableSeats}
                        price={ride.price}
                        carModel={ride.carModel}
                        onRequestRide={onRequestRide}
                      />
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="flex justify-center">
                <Button variant="outline" onClick={onViewAllPast}>
                  View Ride History
                </Button>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RideCards;

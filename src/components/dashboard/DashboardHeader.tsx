import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Bell, Car, Calendar, MapPin, Settings } from "lucide-react";

interface DashboardHeaderProps {
  userName?: string;
  userAvatar?: string;
  ridesCompleted?: number;
  ecoPoints?: number;
  upcomingRides?: number;
  onCreateRide?: () => void;
  onFindRide?: () => void;
}

const DashboardHeader = ({
  userName = "Fahd Niaz Shaikh",
  userAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=fahd",
  ridesCompleted = 24,
  ecoPoints = 350,
  upcomingRides = 2,
  onCreateRide = () => {},
  onFindRide = () => {},
}: DashboardHeaderProps) => {
  return (
    <div className="w-full bg-white border-b border-gray-200 pb-4">
      <Card className="border-0 shadow-none bg-white">
        <CardHeader className="pb-2">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-primary/20">
                <AvatarImage src={userAvatar} alt={userName} />
                <AvatarFallback>
                  {userName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">
                  Kya haal hai, {userName.split(" ")[0]}!
                </h1>
                <p className="text-gray-500">
                  Chalo apni agli ride dhoondte hain
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-auto">
              <Button variant="ghost" size="icon" className="relative">
                <Bell size={20} />
                {upcomingRides > 0 && (
                  <Badge
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    variant="destructive"
                  >
                    {upcomingRides}
                  </Badge>
                )}
              </Button>
              <Button variant="ghost" size="icon">
                <Settings size={20} />
              </Button>
              <Button onClick={onCreateRide} className="ml-2">
                <Car className="mr-2 h-4 w-4" /> Offer a Ride
              </Button>
              <Button variant="outline" onClick={onFindRide}>
                <MapPin className="mr-2 h-4 w-4" /> Find a Ride
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-3 gap-4 mt-2">
            <div className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg">
              <Car className="h-6 w-6 text-primary mb-1" />
              <p className="text-lg font-bold">{ridesCompleted}</p>
              <p className="text-xs text-gray-500">Rides Completed</p>
            </div>
            <div className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg">
              <Calendar className="h-6 w-6 text-primary mb-1" />
              <p className="text-lg font-bold">{upcomingRides}</p>
              <p className="text-xs text-gray-500">Upcoming Rides</p>
            </div>
            <div className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg">
              <svg
                className="h-6 w-6 text-green-600 mb-1"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="text-lg font-bold">{ecoPoints}</p>
              <p className="text-xs text-gray-500">Eco Points</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardHeader;

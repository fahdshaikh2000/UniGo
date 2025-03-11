import React from "react";
import { MapPin, Calendar, Clock, Users, DollarSign, Car } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

interface RideCardProps {
  id?: string;
  driverName?: string;
  driverAvatar?: string;
  driverRating?: number;
  origin?: string;
  destination?: string;
  date?: string;
  time?: string;
  availableSeats?: number;
  price?: number;
  carModel?: string;
  onRequestRide?: (id: string) => void;
}

const RideCard = ({
  id = "1",
  driverName = "Fahd Niaz Shaikh",
  driverAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=fahd",
  driverRating = 4.8,
  origin = "LUMS Campus",
  destination = "Gulberg",
  date = "May 15, 2023",
  time = "3:30 PM",
  availableSeats = 3,
  price = 500,
  carModel = "Honda City (2020)",
  onRequestRide = () => {},
}: RideCardProps) => {
  return (
    <Card className="w-full bg-white border-gray-200 hover:shadow-md transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={driverAvatar} alt={driverName} />
            <AvatarFallback>
              {driverName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{driverName}</h3>
            <div className="flex items-center">
              <span className="text-yellow-500">★</span>
              <span className="text-sm ml-1">{driverRating}</span>
            </div>
          </div>
        </div>
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          Available
        </Badge>
      </CardHeader>

      <CardContent className="pt-2">
        <div className="space-y-3">
          <div className="flex items-start">
            <div className="min-w-8 mt-1">
              <MapPin size={16} className="text-gray-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">From</p>
              <p className="text-sm text-gray-600">{origin}</p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="min-w-8 mt-1">
              <MapPin size={16} className="text-gray-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">To</p>
              <p className="text-sm text-gray-600">{destination}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <div className="flex items-center">
              <Calendar size={16} className="text-gray-500 mr-2" />
              <span className="text-sm">{date}</span>
            </div>
            <div className="flex items-center">
              <Clock size={16} className="text-gray-500 mr-2" />
              <span className="text-sm">{time}</span>
            </div>
            <div className="flex items-center">
              <Users size={16} className="text-gray-500 mr-2" />
              <span className="text-sm">{availableSeats} seats</span>
            </div>
            <div className="flex items-center">
              <DollarSign size={16} className="text-gray-500 mr-2" />
              <span className="text-sm">PKR {price.toFixed(0)}/person</span>
            </div>
          </div>

          <div className="flex items-center pt-1">
            <Car size={16} className="text-gray-500 mr-2" />
            <span className="text-sm text-gray-600">{carModel}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-2">
        <Button className="w-full" onClick={() => onRequestRide(id)}>
          Request Ride
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RideCard;

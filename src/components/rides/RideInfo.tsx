import React from "react";
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  DollarSign,
  Car,
  Shield,
  MessageCircle,
  Phone,
} from "lucide-react";
import GoogleMapView from "./GoogleMapView";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface RideInfoProps {
  id?: string;
  status?: "scheduled" | "in-progress" | "completed" | "cancelled";
  driverName?: string;
  driverAvatar?: string;
  driverRating?: number;
  driverPhone?: string;
  passengers?: Array<{
    id: string;
    name: string;
    avatar: string;
    rating: number;
  }>;
  origin?: string;
  destination?: string;
  date?: string;
  time?: string;
  estimatedDuration?: string;
  estimatedDistance?: string;
  availableSeats?: number;
  price?: number;
  carModel?: string;
  carColor?: string;
  licensePlate?: string;
  safetyFeatures?: string[];
  onStartRide?: () => void;
  onEndRide?: () => void;
  onCancelRide?: () => void;
  onContactDriver?: () => void;
  onContactPassenger?: (passengerId: string) => void;
  onSendSOS?: () => void;
}

const RideInfo = ({
  id = "ride-123",
  status = "scheduled",
  driverName = "Fahd Niaz Shaikh",
  driverAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=fahd",
  driverRating = 4.8,
  driverPhone = "(555) 123-4567",
  passengers = [
    {
      id: "p1",
      name: "Fatima Akhtar",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=fatima",
      rating: 4.7,
    },
    {
      id: "p2",
      name: "Ali Ahmed",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ali",
      rating: 4.9,
    },
  ],
  origin = "LUMS Campus, Main Building",
  destination = "Packages Mall, Walton Road",
  date = "May 15, 2023",
  time = "3:30 PM",
  estimatedDuration = "25 mins",
  estimatedDistance = "8.5 miles",
  availableSeats = 3,
  price = 5.5,
  carModel = "Honda City",
  carColor = "White",
  licensePlate = "LEJ-1234",
  safetyFeatures = [
    "University ID Verified",
    "Dashcam Enabled",
    "Trip Sharing",
  ],
  onStartRide = () => {},
  onEndRide = () => {},
  onCancelRide = () => {},
  onContactDriver = () => {},
  onContactPassenger = () => {},
  onSendSOS = () => {},
}: RideInfoProps) => {
  const getStatusBadge = () => {
    switch (status) {
      case "scheduled":
        return <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>;
      case "in-progress":
        return (
          <Badge className="bg-green-100 text-green-800">In Progress</Badge>
        );
      case "completed":
        return <Badge className="bg-gray-100 text-gray-800">Completed</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>;
    }
  };

  const renderActionButtons = () => {
    switch (status) {
      case "scheduled":
        return (
          <div className="flex gap-3 w-full">
            <Button className="flex-1" onClick={onStartRide}>
              Start Ride
            </Button>
            <Button variant="outline" className="flex-1" onClick={onCancelRide}>
              Cancel
            </Button>
          </div>
        );
      case "in-progress":
        return (
          <div className="flex gap-3 w-full">
            <Button className="flex-1" onClick={onEndRide}>
              End Ride
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={onSendSOS}
            >
              SOS
            </Button>
          </div>
        );
      case "completed":
        return (
          <Button variant="outline" className="w-full">
            View Receipt
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="w-full bg-white border-gray-200 shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">Ride Details</CardTitle>
          {getStatusBadge()}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Driver and Passenger Information */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Driver Info */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-gray-500">DRIVER</h3>
            <div className="flex items-center space-x-3">
              <Avatar className="h-14 w-14">
                <AvatarImage src={driverAvatar} alt={driverName} />
                <AvatarFallback>
                  {driverName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium text-lg">{driverName}</h3>
                <div className="flex items-center">
                  <span className="text-yellow-500">★</span>
                  <span className="text-sm ml-1">{driverRating}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Car size={16} className="text-gray-500" />
              <span className="text-sm">
                {carColor} {carModel} • {licensePlate}
              </span>
            </div>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={onContactDriver}
              >
                <MessageCircle size={14} />
                <span>Message</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={onContactDriver}
              >
                <Phone size={14} />
                <span>Call</span>
              </Button>
            </div>
          </div>

          {/* Passengers Info */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-gray-500">
              PASSENGERS ({passengers.length})
            </h3>
            <div className="space-y-3 max-h-40 overflow-y-auto">
              {passengers.map((passenger) => (
                <div
                  key={passenger.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage
                        src={passenger.avatar}
                        alt={passenger.name}
                      />
                      <AvatarFallback>
                        {passenger.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{passenger.name}</h3>
                      <div className="flex items-center">
                        <span className="text-yellow-500">★</span>
                        <span className="text-sm ml-1">{passenger.rating}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => onContactPassenger(passenger.id)}
                  >
                    <MessageCircle size={14} />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Route Information */}
        <div className="space-y-3 border-t border-b py-4">
          <h3 className="font-semibold text-sm text-gray-500">ROUTE</h3>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="min-w-8 mt-1">
                <MapPin size={18} className="text-blue-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">From</p>
                <p className="text-gray-600">{origin}</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="min-w-8 mt-1">
                <MapPin size={18} className="text-red-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">To</p>
                <p className="text-gray-600">{destination}</p>
              </div>
            </div>

            {/* Azure Maps Route View */}
            <div className="mt-4 h-48 w-full">
              <GoogleMapView
                origin={origin}
                destination={destination}
                showRoute={true}
                className="w-full h-full rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Ride Details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-500">Date</p>
            <div className="flex items-center mt-1">
              <Calendar size={16} className="text-gray-500 mr-2" />
              <span>{date}</span>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500">Time</p>
            <div className="flex items-center mt-1">
              <Clock size={16} className="text-gray-500 mr-2" />
              <span>{time}</span>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500">Duration</p>
            <div className="flex items-center mt-1">
              <Clock size={16} className="text-gray-500 mr-2" />
              <span>{estimatedDuration}</span>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500">Distance</p>
            <div className="flex items-center mt-1">
              <MapPin size={16} className="text-gray-500 mr-2" />
              <span>{estimatedDistance}</span>
            </div>
          </div>
        </div>

        {/* Price and Seats */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Price per Person</p>
            <div className="flex items-center mt-1">
              <DollarSign size={16} className="text-gray-500 mr-2" />
              <span className="text-lg font-semibold">
                PKR {price.toFixed(0)}
              </span>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500">Available Seats</p>
            <div className="flex items-center mt-1">
              <Users size={16} className="text-gray-500 mr-2" />
              <span className="text-lg font-semibold">{availableSeats}</span>
            </div>
          </div>
        </div>

        {/* Safety Features */}
        <div className="space-y-2">
          <h3 className="font-semibold text-sm text-gray-500">
            SAFETY FEATURES
          </h3>
          <div className="flex flex-wrap gap-2">
            {safetyFeatures.map((feature, index) => (
              <Badge
                key={index}
                variant="outline"
                className="flex items-center gap-1"
              >
                <Shield size={12} />
                <span>{feature}</span>
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-2">{renderActionButtons()}</CardFooter>
    </Card>
  );
};

export default RideInfo;

import React from "react";
import { Car, Search, Clock, MapPin, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface QuickActionsProps {
  onCreateRide?: () => void;
  onFindRide?: () => void;
  onScheduleRide?: () => void;
  userName?: string;
}

const QuickActions = ({
  onCreateRide,
  onFindRide,
  onScheduleRide,
  userName = "User",
}: QuickActionsProps) => {
  const navigate = useNavigate();

  const handleCreateRide = () => {
    if (onCreateRide) {
      onCreateRide();
    } else {
      navigate("/create-ride");
    }
  };

  const handleFindRide = () => {
    if (onFindRide) {
      onFindRide();
    } else {
      navigate("/find-ride");
    }
  };

  const handleScheduleRide = () => {
    if (onScheduleRide) {
      onScheduleRide();
    } else {
      // Default behavior if no handler provided
      navigate("/find-ride?scheduled=true");
    }
  };

  return (
    <div className="w-full bg-gray-50 p-6 rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Fori Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Create Ride Card */}
        <Card
          className="bg-white hover:shadow-md transition-shadow duration-300 cursor-pointer"
          onClick={handleCreateRide}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Ride Offer Karein</CardTitle>
              <Car className="h-6 w-6 text-green-600" />
            </div>
            <CardDescription>
              Apna safar doosron ke saath share karein
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-2" />
                <span>Set your route and destination</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Choose date and time</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Users className="h-4 w-4 mr-2" />
                <span>Specify available seats</span>
              </div>
            </div>
            <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">
              Create Ride
            </Button>
          </CardContent>
        </Card>

        {/* Find Ride Card */}
        <Card
          className="bg-white hover:shadow-md transition-shadow duration-300 cursor-pointer"
          onClick={handleFindRide}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Ride Talash Karein</CardTitle>
              <Search className="h-6 w-6 text-blue-600" />
            </div>
            <CardDescription>Kisi ke safar mein shamil hon</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-2" />
                <span>Search by destination</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Filter by date</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Users className="h-4 w-4 mr-2" />
                <span>Set passenger preferences</span>
              </div>
            </div>
            <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
              Find Ride
            </Button>
          </CardContent>
        </Card>

        {/* Schedule Ride Card */}
        <Card
          className="bg-white hover:shadow-md transition-shadow duration-300 cursor-pointer"
          onClick={handleScheduleRide}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Ride Schedule Karein</CardTitle>
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <CardDescription>
              Apne mustaqbil ke safar ki planning karein
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Set recurring schedule</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-2" />
                <span>Save frequent routes</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="h-4 w-4 mr-2" />
                <span>Get reminders</span>
              </div>
            </div>
            <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700">
              Schedule
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuickActions;

import React from "react";
import { User, MapPin, Calendar, Car, Award, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ProfileHeaderProps {
  name?: string;
  avatar?: string;
  university?: string;
  location?: string;
  joinDate?: string;
  rating?: number;
  ridesCompleted?: number;
  ridesAsDriver?: number;
  ridesAsPassenger?: number;
  co2Saved?: number;
  verificationStatus?: "verified" | "pending" | "unverified";
}

const ProfileHeader = ({
  name = "Fahd Niaz Shaikh",
  avatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=fahd",
  university = "LUMS University",
  location = "Lahore, Pakistan",
  joinDate = "Member since May 2022",
  rating = 4.8,
  ridesCompleted = 42,
  ridesAsDriver = 15,
  ridesAsPassenger = 27,
  co2Saved = 187,
  verificationStatus = "verified",
}: ProfileHeaderProps) => {
  return (
    <Card className="w-full bg-white border-gray-200">
      <CardHeader className="pb-2">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 border-2 border-primary">
              <AvatarImage src={avatar} alt={name} />
              <AvatarFallback className="text-lg">
                {name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold">{name}</h2>
                {verificationStatus === "verified" && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                          <User className="h-3 w-3 mr-1" /> Verified
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>University ID verified</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600 mt-1">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                  {location}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                  {joinDate}
                </div>
              </div>

              <div className="mt-1">
                <div className="flex items-center">
                  <Car className="h-4 w-4 mr-1 text-gray-500" />
                  {university}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2">
            <div className="flex items-center">
              <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
                <Star className="h-5 w-5 text-yellow-500 mr-1 fill-yellow-500" />
                <span className="font-bold text-lg">{rating}</span>
                <span className="text-sm text-gray-600 ml-1">/ 5.0</span>
              </div>
            </div>

            <Button variant="outline" className="mt-1">
              Edit Profile
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 border-t pt-4">
          <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-2xl font-bold text-primary">
              {ridesCompleted}
            </span>
            <span className="text-sm text-gray-600">Total Rides</span>
          </div>

          <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-2xl font-bold text-primary">
              {ridesAsDriver}
            </span>
            <span className="text-sm text-gray-600">As Driver</span>
          </div>

          <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-2xl font-bold text-primary">
              {ridesAsPassenger}
            </span>
            <span className="text-sm text-gray-600">As Passenger</span>
          </div>

          <div className="flex flex-col items-center p-3 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <Award className="h-5 w-5 text-green-600 mr-1" />
              <span className="text-2xl font-bold text-green-600">
                {co2Saved}
              </span>
            </div>
            <span className="text-sm text-gray-600">kg CO2 Saved</span>
            <Progress className="h-1.5 mt-2 bg-green-200" value={75} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileHeader;

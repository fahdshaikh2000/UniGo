import React from "react";
import { Leaf, Award, Zap, TrendingUp, Car } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface EcoBadge {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  progress: number;
  achieved: boolean;
}

interface EcoBadgesProps {
  badges?: EcoBadge[];
  totalCO2Saved?: number;
  ridesShared?: number;
}

const EcoBadges = ({
  badges = [
    {
      id: "1",
      name: "Green Starter",
      description: "Completed your first 5 shared rides",
      icon: <Leaf className="h-5 w-5 text-green-500" />,
      progress: 100,
      achieved: true,
    },
    {
      id: "2",
      name: "Carbon Saver",
      description: "Saved 50kg of CO2 emissions",
      icon: <Zap className="h-5 w-5 text-yellow-500" />,
      progress: 75,
      achieved: false,
    },
    {
      id: "3",
      name: "Carpooling Champion",
      description: "Shared 25 rides as a driver",
      icon: <Award className="h-5 w-5 text-blue-500" />,
      progress: 40,
      achieved: false,
    },
    {
      id: "4",
      name: "Eco Warrior",
      description: "Maintained a perfect rating for 10 consecutive rides",
      icon: <TrendingUp className="h-5 w-5 text-purple-500" />,
      progress: 60,
      achieved: false,
    },
  ],
  totalCO2Saved = 37.5,
  ridesShared = 12,
}: EcoBadgesProps) => {
  return (
    <Card className="w-full bg-white shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <Leaf className="h-5 w-5 text-green-600" />
          Eco Achievements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-3 bg-green-50 p-3 rounded-lg">
            <div className="bg-green-100 p-2 rounded-full">
              <Zap className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">CO2 Saved</p>
              <p className="font-semibold text-lg">{totalCO2Saved} kg</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-blue-50 p-3 rounded-lg">
            <div className="bg-blue-100 p-2 rounded-full">
              <Car className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Rides Shared</p>
              <p className="font-semibold text-lg">{ridesShared}</p>
            </div>
          </div>
        </div>

        <h3 className="text-md font-medium mb-3">Your Badges</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {badges.map((badge) => (
            <TooltipProvider key={badge.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex flex-col items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <div
                      className={`p-2 rounded-full mb-2 ${badge.achieved ? "bg-green-100" : "bg-gray-100"}`}
                    >
                      {badge.icon}
                    </div>
                    <p className="text-sm font-medium text-center">
                      {badge.name}
                    </p>
                    {badge.achieved ? (
                      <Badge
                        variant="outline"
                        className="mt-2 bg-green-50 text-green-700 border-green-200"
                      >
                        Achieved
                      </Badge>
                    ) : (
                      <div className="w-full mt-2">
                        <Progress value={badge.progress} className="h-2" />
                        <p className="text-xs text-gray-500 mt-1 text-center">
                          {badge.progress}%
                        </p>
                      </div>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{badge.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default EcoBadges;

import React from "react";
import { Leaf, Award, Droplets, Zap, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  progress: number;
  level: number;
  maxLevel: number;
  unlocked: boolean;
}

interface EcoAchievementsProps {
  achievements?: Achievement[];
  totalCO2Saved?: number;
  totalRides?: number;
  ecoRank?: string;
}

const EcoAchievements = ({
  achievements = [
    {
      id: "1",
      name: "Carbon Saver",
      description: "Reduce carbon emissions through carpooling",
      icon: <Leaf className="h-5 w-5 text-green-500" />,
      progress: 75,
      level: 3,
      maxLevel: 5,
      unlocked: true,
    },
    {
      id: "2",
      name: "Ride Veteran",
      description: "Complete a significant number of shared rides",
      icon: <Award className="h-5 w-5 text-amber-500" />,
      progress: 40,
      level: 2,
      maxLevel: 5,
      unlocked: true,
    },
    {
      id: "3",
      name: "Fuel Optimizer",
      description: "Save fuel through efficient carpooling routes",
      icon: <Droplets className="h-5 w-5 text-blue-500" />,
      progress: 60,
      level: 3,
      maxLevel: 5,
      unlocked: true,
    },
    {
      id: "4",
      name: "Energy Efficient",
      description: "Contribute to energy conservation through shared rides",
      icon: <Zap className="h-5 w-5 text-yellow-500" />,
      progress: 25,
      level: 1,
      maxLevel: 5,
      unlocked: true,
    },
    {
      id: "5",
      name: "Eco Influencer",
      description: "Inspire others to join the carpooling movement",
      icon: <TrendingUp className="h-5 w-5 text-purple-500" />,
      progress: 10,
      level: 1,
      maxLevel: 5,
      unlocked: false,
    },
  ],
  totalCO2Saved = 487.5,
  totalRides = 42,
  ecoRank = "Green Champion",
}: EcoAchievementsProps) => {
  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-sm">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Eco Achievements
            </h2>
            <p className="text-gray-600">
              Track your environmental impact through carpooling
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Card className="bg-green-50 border-green-200 w-36">
              <CardContent className="p-3 text-center">
                <p className="text-sm text-gray-600">CO₂ Saved</p>
                <p className="text-xl font-bold text-green-600">
                  {totalCO2Saved} kg
                </p>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200 w-36">
              <CardContent className="p-3 text-center">
                <p className="text-sm text-gray-600">Total Rides</p>
                <p className="text-xl font-bold text-blue-600">{totalRides}</p>
              </CardContent>
            </Card>

            <Card className="bg-purple-50 border-purple-200 w-36">
              <CardContent className="p-3 text-center">
                <p className="text-sm text-gray-600">Eco Rank</p>
                <p className="text-xl font-bold text-purple-600">{ecoRank}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement) => (
            <TooltipProvider key={achievement.id}>
              <Card
                className={`border ${achievement.unlocked ? "border-gray-200" : "border-gray-300 opacity-70"}`}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      {achievement.icon}
                      <CardTitle className="text-base">
                        {achievement.name}
                      </CardTitle>
                    </div>
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge
                          variant={achievement.unlocked ? "default" : "outline"}
                          className={
                            achievement.unlocked
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : "text-gray-500"
                          }
                        >
                          Level {achievement.level}/{achievement.maxLevel}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-sm">{achievement.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Progress to next level</span>
                      <span>{achievement.progress}%</span>
                    </div>
                    <Progress value={achievement.progress} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </TooltipProvider>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EcoAchievements;

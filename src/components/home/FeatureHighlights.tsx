import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Shield, Users, Car, Leaf } from "lucide-react";

interface FeatureHighlightsProps {
  features?: {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
  }[];
}

const FeatureHighlights = ({
  features = [
    {
      id: "1",
      title: "University Verified",
      description:
        "Only students with verified university IDs can join, ensuring a safe community of peers.",
      icon: <Shield className="h-10 w-10" />,
      color: "bg-blue-100 text-blue-600",
    },
    {
      id: "2",
      title: "Smart Ride Matching",
      description:
        "Our algorithm matches you with students traveling similar routes and schedules.",
      icon: <Users className="h-10 w-10" />,
      color: "bg-purple-100 text-purple-600",
    },
    {
      id: "3",
      title: "Enhanced Safety",
      description:
        "Real-time tracking, SOS button, and optional dashcam monitoring for peace of mind.",
      icon: <Shield className="h-10 w-10" />,
      color: "bg-red-100 text-red-600",
    },
    {
      id: "4",
      title: "Cost Sharing",
      description:
        "Split travel costs fairly with our transparent fare calculator based on distance.",
      icon: <Car className="h-10 w-10" />,
      color: "bg-green-100 text-green-600",
    },
  ],
}: FeatureHighlightsProps) => {
  return (
    <section className="w-full py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            UNIGO Kyun Choose Karein?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hamara university carpooling platform students ki zarooraton ko
            maddenazar rakhte hue banaya gaya hai, jo safety, convenience, aur
            affordability provide karta hai.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <TooltipProvider key={feature.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="h-full hover:shadow-md transition-shadow duration-300 cursor-pointer">
                    <CardHeader className="pb-2">
                      <div
                        className={`p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4 ${feature.color}`}
                      >
                        {feature.icon}
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">{feature.description}</p>
                    </CardContent>
                  </Card>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Learn more about {feature.title.toLowerCase()}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center bg-green-50 px-4 py-2 rounded-full">
            <Leaf className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-green-800 font-medium">
              UNIGO istemal karne wale students ne mil kar 5,000 kg se zyada CO
              <sub>2</sub>
              emissions bachai hain
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureHighlights;

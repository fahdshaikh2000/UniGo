import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Clock,
  MapPin,
  Car,
  Shield,
  MessageCircle,
  Users,
  Fuel,
  Calendar,
} from "lucide-react";

const FeatureCategory = ({
  title,
  children,
  icon,
}: {
  title: string;
  children: React.ReactNode;
  icon: React.ReactNode;
}) => (
  <div className="mb-6">
    <div className="flex items-center gap-2 mb-3">
      {icon}
      <h3 className="text-lg font-semibold">{title}</h3>
    </div>
    <div className="space-y-3 pl-7">{children}</div>
  </div>
);

const FeatureItem = ({
  title,
  description,
  status,
}: {
  title: string;
  description: string;
  status: "implemented" | "in-progress" | "planned";
}) => {
  const statusColors = {
    implemented: "bg-green-100 text-green-800 border-green-200",
    "in-progress": "bg-blue-100 text-blue-800 border-blue-200",
    planned: "bg-gray-100 text-gray-800 border-gray-200",
  };

  return (
    <div className="flex items-start gap-3 p-3 rounded-md bg-white border border-gray-100 shadow-sm">
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">{title}</h4>
          <Badge variant="outline" className={statusColors[status]}>
            {status === "implemented"
              ? "Implemented"
              : status === "in-progress"
                ? "In Progress"
                : "Planned"}
          </Badge>
        </div>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>
    </div>
  );
};

const RideFeatureRoadmap = () => {
  return (
    <Card className="w-full bg-white">
      <CardHeader>
        <CardTitle className="text-2xl">UNIGO Feature Roadmap</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <FeatureCategory
          title="Ride Offering & Booking Enhancements"
          icon={<Car className="h-5 w-5 text-blue-600" />}
        >
          <FeatureItem
            title="Pickup & Drop-off Radius Control"
            description="Riders and drivers can define a pickup and drop-off radius for flexibility."
            status="in-progress"
          />
          <FeatureItem
            title="Time Range for Ride Matching"
            description="Instead of a fixed time, allow setting a ± time range (e.g., 10–30 minutes flexibility)."
            status="planned"
          />
          <FeatureItem
            title="Multiple Drop-off Points"
            description="Drivers can select multiple drop-off locations if they are passing by."
            status="planned"
          />
          <FeatureItem
            title="Default Vehicle Profile"
            description="Users can set a default vehicle profile (car make, model, seats available)."
            status="in-progress"
          />
          <FeatureItem
            title="Vehicle Registration Number"
            description="Option for drivers to enter their car's number plate for safety."
            status="implemented"
          />
        </FeatureCategory>

        <FeatureCategory
          title="Profile & Verification Enhancements"
          icon={<Shield className="h-5 w-5 text-green-600" />}
        >
          <FeatureItem
            title="Vehicle Section in Profile"
            description="Users can add multiple vehicles to their profile for quick ride offers."
            status="planned"
          />
          <FeatureItem
            title="University ID / CNIC-Based Verification"
            description="Full verification process requiring University ID / NIC / LinkedIn Profile."
            status="in-progress"
          />
          <FeatureItem
            title="Legal Compliance & Binding Agreements"
            description="Terms of use should bind users legally to ensure responsibility."
            status="implemented"
          />
        </FeatureCategory>

        <FeatureCategory
          title="Ride Searching & Filters"
          icon={<MapPin className="h-5 w-5 text-purple-600" />}
        >
          <FeatureItem
            title="Pickup & Drop-off Radius in Filters"
            description="Users searching for a ride can filter rides based on a preferred radius."
            status="planned"
          />
          <FeatureItem
            title="Fuel Savings Instead of CO₂ Emissions"
            description="Show 'Fuel Savings' instead of CO₂ reduction as a key incentive for users."
            status="in-progress"
          />
        </FeatureCategory>

        <FeatureCategory
          title="Ride Insights & Summary"
          icon={<Calendar className="h-5 w-5 text-amber-600" />}
        >
          <FeatureItem
            title="Ride Completion Counter in Summary"
            description="Number of rides completed displayed on the driver's and rider's profile."
            status="implemented"
          />
          <FeatureItem
            title="Previous & Current Rides with Tracking"
            description="Separate 'Current Rides' for tracking ongoing trips and 'Previous Rides' with details of past journeys."
            status="in-progress"
          />
        </FeatureCategory>

        <FeatureCategory
          title="Communication & Interaction"
          icon={<MessageCircle className="h-5 w-5 text-red-600" />}
        >
          <FeatureItem
            title="In-App Chat for Riders & Drivers"
            description="Chat feature within the app to prevent users from switching to WhatsApp."
            status="implemented"
          />
          <FeatureItem
            title="Chat History Section"
            description="'Your Chats' section for ride-related conversations."
            status="in-progress"
          />
        </FeatureCategory>
      </CardContent>
    </Card>
  );
};

export default RideFeatureRoadmap;

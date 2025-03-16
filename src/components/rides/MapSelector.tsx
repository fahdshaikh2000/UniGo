import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Navigation } from "lucide-react";

interface MapSelectorProps {
  onLocationSelect?: (origin: string, destination: string) => void;
  initialPickup?: string;
  initialDropoff?: string;
  showRoute?: boolean;
}

const MapSelector = ({
  onLocationSelect = () => {},
  initialPickup = "LUMS Campus",
  initialDropoff = "Gulberg",
  showRoute = true,
}: MapSelectorProps) => {
  const [pickup, setPickup] = useState(initialPickup);
  const [dropoff, setDropoff] = useState(initialDropoff);
  const [isLoading, setIsLoading] = useState(false);
  const [routeInfo, setRouteInfo] = useState({
    distance: "Calculating...",
    duration: "Calculating...",
    fare: "Calculating...",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pickup && dropoff) {
      setIsLoading(true);
      // Simulate API call delay
      setTimeout(() => {
        // Calculate mock route info
        setRouteInfo({
          distance: "15 km",
          duration: "25 mins",
          fare: "PKR 500",
        });
        onLocationSelect(pickup, dropoff);
        setIsLoading(false);
      }, 500);
    }
  };

  const handleUseCurrentLocation = () => {
    setPickup("Current Location (LUMS)");
  };

  return (
    <div className="w-full">
      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <div className="text-center mb-4">
          <p className="text-sm text-gray-500">
            Map view is simplified for this demo. In a production app, this
            would show an interactive map using Google Maps or a similar
            service.
          </p>
        </div>

        <div className="h-48 bg-blue-50 rounded-lg border border-blue-200 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-sm font-medium">
              {pickup && dropoff
                ? `Route: ${pickup} → ${dropoff}`
                : "Select pickup and drop-off locations"}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="pickup">Pickup Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Input
                id="pickup"
                placeholder="Enter pickup location"
                className="pl-10"
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full mt-1 text-xs"
              onClick={handleUseCurrentLocation}
            >
              Use Current Location
            </Button>
          </div>

          <div>
            <Label htmlFor="dropoff">Dropoff Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Input
                id="dropoff"
                placeholder="Enter destination"
                className="pl-10"
                value={dropoff}
                onChange={(e) => setDropoff(e.target.value)}
              />
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full">
          <Navigation className="mr-2 h-4 w-4" />
          Set Route
        </Button>

        {showRoute && pickup && dropoff && (
          <div className="p-3 bg-gray-50 rounded-md">
            <h3 className="text-sm font-medium mb-2">Route Information</h3>
            <div className="text-xs space-y-1">
              <p>
                <span className="font-medium">Distance:</span>{" "}
                {routeInfo.distance}
              </p>
              <p>
                <span className="font-medium">Est. Time:</span>{" "}
                {routeInfo.duration}
              </p>
              <p>
                <span className="font-medium">Est. Fare:</span> {routeInfo.fare}{" "}
                per person
              </p>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default MapSelector;

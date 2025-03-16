import React, { useState, useEffect } from "react";
import { MapPin, AlertTriangle, Navigation, Phone, Shield } from "lucide-react";
import GoogleMapView from "./GoogleMapView";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface RideTrackingProps {
  rideId?: string;
  driverName?: string;
  passengerName?: string;
  origin?: string;
  destination?: string;
  estimatedArrival?: string;
  currentLocation?: string;
  progress?: number;
  onSendSOS?: () => void;
}

const RideTracking = ({
  rideId = "ride-123",
  driverName = "Fahd Niaz Shaikh",
  passengerName = "Usman Malik",
  origin = "LUMS Campus",
  destination = "Gulberg",
  estimatedArrival = "3:45 PM",
  currentLocation = "Ferozepur Road",
  progress = 65,
  onSendSOS = () => console.log("SOS signal sent"),
}: RideTrackingProps) => {
  const [currentProgress, setCurrentProgress] = useState(progress);
  const [isMoving, setIsMoving] = useState(true);
  const [etaMinutes, setEtaMinutes] = useState(15);

  // Simulate movement for demo purposes
  useEffect(() => {
    if (isMoving && currentProgress < 100) {
      const interval = setInterval(() => {
        setCurrentProgress((prev) => {
          const newProgress = prev + 1;
          if (newProgress >= 100) {
            clearInterval(interval);
            setIsMoving(false);
            return 100;
          }
          return newProgress;
        });

        setEtaMinutes((prev) => {
          const newEta = prev - 1;
          return newEta > 0 ? newEta : 0;
        });
      }, 5000); // Update every 5 seconds

      return () => clearInterval(interval);
    }
  }, [isMoving, currentProgress]);

  return (
    <Card className="w-full max-w-3xl mx-auto bg-white shadow-lg">
      <CardHeader className="border-b">
        <div className="flex justify-between items-center">
          <CardTitle>Live Ride Tracking</CardTitle>
          <Badge
            variant={isMoving ? "secondary" : "default"}
            className={
              isMoving
                ? "bg-green-100 text-green-800"
                : "bg-blue-100 text-blue-800"
            }
          >
            {isMoving ? "In Progress" : "Arrived"}
          </Badge>
        </div>
        <div className="text-sm text-gray-500 mt-1">Ride ID: {rideId}</div>
      </CardHeader>

      <CardContent className="p-6">
        {/* Map Visualization */}
        <div className="relative w-full h-64 bg-gray-100 rounded-lg mb-6 overflow-hidden">
          {/* Google Maps with live tracking */}
          <GoogleMapView
            origin={origin}
            destination={destination}
            showRoute={true}
            className="absolute inset-0"
          />

          {/* Vehicle marker overlay */}
          <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 transition-all duration-1000 ease-in-out"
            style={{
              left: `${20 + currentProgress * 0.6}%`,
              top: `${50 - currentProgress * 0.25}%`,
            }}
          >
            <div className="bg-green-500 p-2 rounded-full animate-pulse shadow-lg">
              <Navigation size={16} className="text-white" />
            </div>
          </div>
        </div>

        {/* Progress and ETA */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Trip Progress</span>
            <span className="text-sm font-medium">{currentProgress}%</span>
          </div>
          <Progress value={currentProgress} className="h-2" />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-500">{origin}</span>
            <span className="text-xs text-gray-500">{destination}</span>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-sm font-medium mr-2">Estimated arrival:</span>
            <span className="text-sm">
              {etaMinutes > 0
                ? `${etaMinutes} minutes (${estimatedArrival})`
                : "Arrived"}
            </span>
          </div>
          <div className="mt-2 flex items-center">
            <span className="text-sm font-medium mr-2">Current location:</span>
            <span className="text-sm">{currentLocation}</span>
          </div>
        </div>

        {/* Driver/Passenger Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 border rounded-lg">
            <h3 className="text-sm font-medium mb-2">Driver</h3>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-200 mr-3 overflow-hidden">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=driver"
                  alt="Driver avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-medium">{driverName}</p>
                <div className="flex items-center">
                  <span className="text-yellow-500 text-xs">★★★★☆</span>
                  <span className="text-xs ml-1">4.8</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border rounded-lg">
            <h3 className="text-sm font-medium mb-2">Passenger</h3>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-200 mr-3 overflow-hidden">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=passenger"
                  alt="Passenger avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-medium">{passengerName}</p>
                <div className="flex items-center">
                  <span className="text-yellow-500 text-xs">★★★★★</span>
                  <span className="text-xs ml-1">5.0</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={onSendSOS}
                >
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  SOS Emergency
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Alert university security in case of emergency</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Button variant="outline" className="flex-1">
            <Phone className="mr-2 h-4 w-4" />
            Contact Driver
          </Button>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="secondary" className="flex-1">
                  <Shield className="mr-2 h-4 w-4" />
                  Safety Features
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View safety options and university security contacts</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
};

export default RideTracking;

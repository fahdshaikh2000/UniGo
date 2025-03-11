import React, { useState, useEffect } from "react";
import { MapPin, AlertTriangle, Navigation, Phone, Shield } from "lucide-react";
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
          {/* Azure Maps with live tracking */}
          <div id="tracking-map" className="absolute inset-0"></div>

          <script
            dangerouslySetInnerHTML={{
              __html: `
            // Initialize Azure Maps for tracking
            setTimeout(() => {
              const mapElement = document.getElementById('tracking-map');
              if (mapElement && window.atlas) {
                const map = new atlas.Map('tracking-map', {
                  authOptions: {
                    authType: 'subscriptionKey',
                    subscriptionKey: '800n0pLHpRxwcY5vOToH3hFatFbYZBULLYfHnZjY78InWtZeKGzrJQQJ99BCACYeBjF2kqJFAAAgAZMPjzno'
                  },
                  center: [74.3587, 31.5204], // Lahore coordinates
                  zoom: 13
                });
                
                map.events.add('ready', function() {
                  // Create a data source and add it to the map
                  const datasource = new atlas.source.DataSource();
                  map.sources.add(datasource);
                  
                  // Add origin and destination points
                  const originPoint = new atlas.data.Feature(
                    new atlas.data.Point([74.3587, 31.5204]), // Placeholder coordinates
                    { name: "${origin}" }
                  );
                  
                  const destinationPoint = new atlas.data.Feature(
                    new atlas.data.Point([74.3686, 31.5804]), // Placeholder coordinates
                    { name: "${destination}" }
                  );
                  
                  // Add vehicle position point
                  const vehiclePoint = new atlas.data.Feature(
                    new atlas.data.Point([74.3636, 31.5504]), // Placeholder coordinates
                    { name: "Current Location" }
                  );
                  
                  datasource.add([originPoint, destinationPoint, vehiclePoint]);
                  
                  // Create a line layer to render the route line
                  map.layers.add(new atlas.layer.LineLayer(datasource, null, {
                    strokeColor: '#2272B9',
                    strokeWidth: 5,
                    filter: ['==', ['geometry-type'], 'LineString']
                  }));
                  
                  // Create a symbol layer for origin and destination
                  map.layers.add(new atlas.layer.SymbolLayer(datasource, 'pins', {
                    iconOptions: {
                      image: 'pin-round-darkblue',
                      anchor: 'center',
                      allowOverlap: true
                    },
                    filter: ['any', 
                      ['==', ['get', 'name'], "${origin}"],
                      ['==', ['get', 'name'], "${destination}"]
                    ]
                  }));
                  
                  // Create a symbol layer for the vehicle
                  map.layers.add(new atlas.layer.SymbolLayer(datasource, 'vehicle', {
                    iconOptions: {
                      image: 'car',
                      anchor: 'center',
                      allowOverlap: true,
                      size: 0.8
                    },
                    filter: ['==', ['get', 'name'], 'Current Location']
                  }));
                  
                  // Simulate a route line
                  const routeLine = new atlas.data.LineString([
                    [74.3587, 31.5204], // Origin
                    [74.3636, 31.5504], // Current vehicle position
                    [74.3686, 31.5804]  // Destination
                  ]);
                  
                  datasource.add(new atlas.data.Feature(routeLine));
                  
                  // Animate the vehicle position
                  let progress = ${currentProgress} / 100;
                  const animateVehicle = () => {
                    if (progress <= 1) {
                      // Interpolate position along the route
                      const position = [
                        74.3587 + (74.3686 - 74.3587) * progress,
                        31.5204 + (31.5804 - 31.5204) * progress
                      ];
                      
                      // Update vehicle position
                      datasource.clear();
                      datasource.add([originPoint, destinationPoint]);
                      datasource.add(new atlas.data.Feature(
                        new atlas.data.Point(position),
                        { name: 'Current Location' }
                      ));
                      datasource.add(new atlas.data.Feature(routeLine));
                      
                      progress += 0.005;
                      setTimeout(animateVehicle, 500);
                    }
                  };
                  
                  // Start animation
                  animateVehicle();
                });
              }
            }, 500);
          `,
            }}
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

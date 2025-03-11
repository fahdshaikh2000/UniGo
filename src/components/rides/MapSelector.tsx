import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Navigation, LocateFixed, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface MapSelectorProps {
  onLocationSelect?: (locations: { pickup: string; dropoff: string }) => void;
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
  const [isMapLoaded, setIsMapLoaded] = useState(true); // Simulating map loaded state
  const mapRef = useRef<HTMLDivElement>(null);

  // Load Google Maps
  useEffect(() => {
    // Set map as loaded immediately when pickup and dropoff are available
    if (pickup && dropoff) {
      setIsMapLoaded(true);
    } else {
      // Small delay to simulate API loading
      const timer = setTimeout(() => {
        setIsMapLoaded(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [pickup, dropoff]);

  // Simulate route calculation when pickup or dropoff changes
  useEffect(() => {
    if (pickup && dropoff && showRoute) {
      // In a real implementation, this would call a mapping API to draw the route
      console.log(`Calculating route from ${pickup} to ${dropoff}`);
    }
  }, [pickup, dropoff, showRoute]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLocationSelect({ pickup, dropoff });
  };

  const handleUseCurrentLocation = () => {
    // In a real implementation, this would use the browser's geolocation API
    setPickup("Current Location");
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Select Route</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1 space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pickup">Pickup Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    id="pickup"
                    placeholder="Enter pickup location"
                    className="pl-8"
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
                  <LocateFixed className="mr-1 h-3 w-3" />
                  Use Current Location
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dropoff">Dropoff Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    id="dropoff"
                    placeholder="Enter destination"
                    className="pl-8"
                    value={dropoff}
                    onChange={(e) => setDropoff(e.target.value)}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full">
                <Navigation className="mr-2 h-4 w-4" />
                Set Route
              </Button>
            </form>

            {showRoute && pickup && dropoff && (
              <div className="p-3 bg-gray-50 rounded-md">
                <h3 className="text-sm font-medium mb-2">Route Information</h3>
                <div className="text-xs space-y-1">
                  <p>
                    <span className="font-medium">Distance:</span> 5.2 miles
                  </p>
                  <p>
                    <span className="font-medium">Est. Time:</span> 15 minutes
                  </p>
                  <p>
                    <span className="font-medium">Est. Fare:</span> PKR 850 per
                    person
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="md:col-span-2 relative">
            <div
              ref={mapRef}
              className={cn(
                "w-full h-80 bg-gray-100 rounded-md overflow-hidden relative",
                !isMapLoaded && "animate-pulse",
              )}
            >
              {!isMapLoaded ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-gray-500">Loading map...</p>
                </div>
              ) : (
                <div className="relative w-full h-full" id="map-container">
                  {/* Azure Maps will be initialized here via JavaScript */}
                  <div id="azure-map" className="absolute inset-0"></div>

                  <script
                    dangerouslySetInnerHTML={{
                      __html: `
                    // Initialize Azure Maps when the component mounts
                    setTimeout(() => {
                      const mapElement = document.getElementById('azure-map');
                      if (mapElement && window.atlas) {
                        const map = new atlas.Map('azure-map', {
                          authOptions: {
                            authType: 'subscriptionKey',
                            subscriptionKey: '800n0pLHpRxwcY5vOToH3hFatFbYZBULLYfHnZjY78InWtZeKGzrJQQJ99BCACYeBjF2kqJFAAAgAZMPjzno'
                          },
                          center: [74.3587, 31.5204], // Lahore coordinates
                          zoom: 12
                        });
                        
                        map.events.add('ready', function() {
                          // Create a data source and add it to the map
                          const datasource = new atlas.source.DataSource();
                          map.sources.add(datasource);
                          
                          // Add origin and destination points
                          const originPoint = new atlas.data.Feature(
                            new atlas.data.Point([74.3587, 31.5204]), // Placeholder coordinates
                            { name: "${pickup}" }
                          );
                          
                          const destinationPoint = new atlas.data.Feature(
                            new atlas.data.Point([74.3686, 31.5804]), // Placeholder coordinates
                            { name: "${dropoff}" }
                          );
                          
                          datasource.add([originPoint, destinationPoint]);
                          
                          // Create a line layer to render the route line
                          map.layers.add(new atlas.layer.LineLayer(datasource, null, {
                            strokeColor: '#2272B9',
                            strokeWidth: 5,
                            filter: ['==', ['geometry-type'], 'LineString']
                          }));
                          
                          // Create a symbol layer to render the origin and destination points
                          map.layers.add(new atlas.layer.SymbolLayer(datasource, null, {
                            iconOptions: {
                              image: 'pin-round-darkblue',
                              anchor: 'center',
                              allowOverlap: true
                            },
                            filter: ['==', ['geometry-type'], 'Point']
                          }));
                          
                          // Simulate a route line for demo purposes
                          const routeLine = new atlas.data.LineString([
                            [74.3587, 31.5204], // Origin
                            [74.3636, 31.5504], // Waypoint
                            [74.3686, 31.5804]  // Destination
                          ]);
                          
                          datasource.add(new atlas.data.Feature(routeLine));
                        });
                      }
                    }, 500);
                  `,
                    }}
                  />
                </div>
              )}
            </div>

            <div className="absolute top-2 right-2 z-10">
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/90 shadow-sm"
              >
                <Search className="h-4 w-4 mr-1" />
                Search Area
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MapSelector;

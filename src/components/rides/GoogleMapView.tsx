import React, { useEffect, useRef } from "react";

interface AzureMapViewProps {
  origin: string;
  destination: string;
  showRoute?: boolean;
  className?: string;
}

const AzureMapView: React.FC<AzureMapViewProps> = ({
  origin,
  destination,
  showRoute = true,
  className = "w-full h-80",
}) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize Azure Maps
    const map = new (window as any).atlas.Map(mapRef.current, {
      authOptions: {
        authType: "subscriptionKey",
        subscriptionKey:
          "800n0pLHpRxwcY5vOToH3hFatFbYZBULLYfHnZjY78InWtZeKGzrJQQJ99BCACYeBjF2kqJFAAAgAZMPjzno",
      },
      center: [74.3587, 31.5204], // Lahore coordinates
      zoom: 12,
    });

    map.events.add("ready", function () {
      // Create a data source and add it to the map
      const datasource = new (window as any).atlas.source.DataSource();
      map.sources.add(datasource);

      // Add origin and destination points
      const originPoint = new (window as any).atlas.data.Feature(
        new (window as any).atlas.data.Point([74.3587, 31.5204]), // Placeholder coordinates
        { name: origin },
      );

      const destinationPoint = new (window as any).atlas.data.Feature(
        new (window as any).atlas.data.Point([74.3686, 31.5804]), // Placeholder coordinates
        { name: destination },
      );

      datasource.add([originPoint, destinationPoint]);

      // Create a line layer to render the route line
      map.layers.add(
        new (window as any).atlas.layer.LineLayer(datasource, null, {
          strokeColor: "#2272B9",
          strokeWidth: 5,
          filter: ["==", ["geometry-type"], "LineString"],
        }),
      );

      // Create a symbol layer to render the origin and destination points
      map.layers.add(
        new (window as any).atlas.layer.SymbolLayer(datasource, null, {
          iconOptions: {
            image: "pin-round-darkblue",
            anchor: "center",
            allowOverlap: true,
          },
          textOptions: {
            anchor: "top",
            offset: [0, 1],
            color: "#000",
            size: 12,
            font: ["StandardFont-Bold"],
            halo: {
              color: "#fff",
              width: 2,
            },
          },
          filter: ["==", ["geometry-type"], "Point"],
        }),
      );

      // If showRoute is true, calculate and display the route
      if (showRoute) {
        // Create a route URL using Azure Maps Route API
        // This is a simplified example - in a real app, you would use geocoding to get coordinates
        const routeURL = `https://atlas.microsoft.com/route/directions/json?subscription-key=800n0pLHpRxwcY5vOToH3hFatFbYZBULLYfHnZjY78InWtZeKGzrJQQJ99BCACYeBjF2kqJFAAAgAZMPjzno&api-version=1.0&query=31.5204,74.3587:31.5804,74.3686`;

        // Simulate a route line for demo purposes
        const routeLine = new (window as any).atlas.data.LineString([
          [74.3587, 31.5204], // Origin
          [74.3636, 31.5504], // Waypoint
          [74.3686, 31.5804], // Destination
        ]);

        datasource.add(new (window as any).atlas.data.Feature(routeLine));
      }
    });

    return () => {
      // Clean up map resources when component unmounts
      if (map) {
        map.dispose();
      }
    };
  }, [origin, destination, showRoute]);

  return (
    <div
      ref={mapRef}
      className={`relative rounded-md overflow-hidden ${className}`}
    ></div>
  );
};

export default AzureMapView;

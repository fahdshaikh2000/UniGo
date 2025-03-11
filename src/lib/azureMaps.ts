// Azure Maps API key and configuration
export const AZURE_MAPS_KEY =
  "800n0pLHpRxwcY5vOToH3hFatFbYZBULLYfHnZjY78InWtZeKGzrJQQJ99BCACYeBjF2kqJFAAAgAZMPjzno";

// Type definitions for Azure Maps
declare global {
  interface Window {
    atlas: any;
  }
}

// Helper function to initialize a map
export const initializeMap = (
  elementId: string,
  center: [number, number] = [74.3587, 31.5204],
  zoom: number = 12,
) => {
  if (!window.atlas) {
    console.error("Azure Maps SDK not loaded");
    return null;
  }

  return new window.atlas.Map(elementId, {
    authOptions: {
      authType: "subscriptionKey",
      subscriptionKey: AZURE_MAPS_KEY,
    },
    center,
    zoom,
  });
};

// Helper function to create a route between two points
export const createRoute = (
  map: any,
  origin: [number, number],
  destination: [number, number],
) => {
  if (!map || !window.atlas) return;

  // Create a data source and add it to the map
  const datasource = new window.atlas.source.DataSource();
  map.sources.add(datasource);

  // Add origin and destination points
  const originPoint = new window.atlas.data.Feature(
    new window.atlas.data.Point(origin),
    { name: "Origin" },
  );

  const destinationPoint = new window.atlas.data.Feature(
    new window.atlas.data.Point(destination),
    { name: "Destination" },
  );

  datasource.add([originPoint, destinationPoint]);

  // Create a line layer to render the route line
  map.layers.add(
    new window.atlas.layer.LineLayer(datasource, null, {
      strokeColor: "#2272B9",
      strokeWidth: 5,
      filter: ["==", ["geometry-type"], "LineString"],
    }),
  );

  // Create a symbol layer to render the origin and destination points
  map.layers.add(
    new window.atlas.layer.SymbolLayer(datasource, null, {
      iconOptions: {
        image: "pin-round-darkblue",
        anchor: "center",
        allowOverlap: true,
      },
      filter: ["==", ["geometry-type"], "Point"],
    }),
  );

  // Simulate a route line for demo purposes
  const routeLine = new window.atlas.data.LineString([
    origin,
    [(origin[0] + destination[0]) / 2, (origin[1] + destination[1]) / 2], // Midpoint
    destination,
  ]);

  datasource.add(new window.atlas.data.Feature(routeLine));

  return datasource;
};

// Helper function to geocode an address to coordinates
export const geocodeAddress = async (address: string) => {
  try {
    const response = await fetch(
      `https://atlas.microsoft.com/search/address/json?subscription-key=${AZURE_MAPS_KEY}&api-version=1.0&query=${encodeURIComponent(address)}`,
    );

    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const result = data.results[0];
      return [result.position.lon, result.position.lat] as [number, number];
    }

    return null;
  } catch (error) {
    console.error("Error geocoding address:", error);
    return null;
  }
};

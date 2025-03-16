import React, { useEffect, useRef } from "react";
import { loadGoogleMapsScript } from "@/lib/googleMaps";

interface GoogleMapViewProps {
  origin: string;
  destination: string;
  showRoute?: boolean;
  className?: string;
}

const GoogleMapView: React.FC<GoogleMapViewProps> = ({
  origin,
  destination,
  showRoute = true,
  className = "w-full h-80",
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const directionsRendererRef = useRef<any>(null);

  useEffect(() => {
    // Load Google Maps API
    loadGoogleMapsScript(() => {
      initMap();
    });

    return () => {
      // Clean up resources when component unmounts
      if (mapInstanceRef.current) {
        // Google Maps doesn't have a built-in dispose method
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Initialize the map
  const initMap = () => {
    if (!mapRef.current || !window.google) return;

    // Create a new map instance
    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
      center: { lat: 31.5204, lng: 74.3587 }, // Lahore coordinates
      zoom: 12,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });

    // Initialize the directions renderer
    directionsRendererRef.current = new window.google.maps.DirectionsRenderer({
      map: mapInstanceRef.current,
      suppressMarkers: false,
    });

    // If we have origin and destination, calculate the route
    if (origin && destination && showRoute) {
      calculateRoute();
    }
  };

  // Calculate and display the route
  const calculateRoute = () => {
    if (!window.google || !mapInstanceRef.current) return;

    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin,
        destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (response, status) => {
        if (status === "OK" && response) {
          directionsRendererRef.current.setDirections(response);

          // Fit the map to the route bounds
          if (response.routes[0] && response.routes[0].bounds) {
            mapInstanceRef.current.fitBounds(response.routes[0].bounds);
          }
        } else {
          console.error(`Directions request failed due to ${status}`);

          // If route calculation fails, just show markers for origin and destination
          showMarkers();
        }
      },
    );
  };

  // Show markers for origin and destination without a route
  const showMarkers = () => {
    if (!window.google || !mapInstanceRef.current) return;

    // Geocode the origin and destination to get coordinates
    const geocoder = new window.google.maps.Geocoder();

    // Origin marker
    geocoder.geocode({ address: origin }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        new window.google.maps.Marker({
          position: results[0].geometry.location,
          map: mapInstanceRef.current,
          title: origin,
          label: "A",
        });

        // Center on first result
        mapInstanceRef.current.setCenter(results[0].geometry.location);
      }
    });

    // Destination marker
    geocoder.geocode({ address: destination }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        new window.google.maps.Marker({
          position: results[0].geometry.location,
          map: mapInstanceRef.current,
          title: destination,
          label: "B",
        });
      }
    });
  };

  // Recalculate route when origin or destination changes
  useEffect(() => {
    if (window.google && mapInstanceRef.current && origin && destination) {
      if (showRoute) {
        calculateRoute();
      } else {
        showMarkers();
      }
    }
  }, [origin, destination, showRoute]);

  return (
    <div
      ref={mapRef}
      className={`relative rounded-md overflow-hidden ${className}`}
    ></div>
  );
};

export default GoogleMapView;

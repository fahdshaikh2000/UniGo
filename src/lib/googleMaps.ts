// Google Maps API key and configuration
export const GOOGLE_MAPS_API_KEY = "AIzaSyDO2VyNH8vC2ZhZX8BhwpkvzxKaSLAE0ic";

// Type definitions for Google Maps
declare global {
  interface Window {
    google: any;
  }
}

// Helper function to initialize a map
export const initializeMap = (
  elementId: string,
  center: { lat: number; lng: number } = { lat: 31.5204, lng: 74.3587 }, // Lahore coordinates
  zoom: number = 12,
) => {
  if (!window.google) {
    console.error("Google Maps SDK not loaded");
    return null;
  }

  return new window.google.maps.Map(document.getElementById(elementId), {
    center,
    zoom,
  });
};

// Helper function to create a route between two points
export const createRoute = (
  map: any,
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number },
) => {
  if (!map || !window.google) return;

  const directionsService = new window.google.maps.DirectionsService();
  const directionsRenderer = new window.google.maps.DirectionsRenderer({
    map,
    suppressMarkers: false,
  });

  directionsService.route(
    {
      origin,
      destination,
      travelMode: window.google.maps.TravelMode.DRIVING,
    },
    (response: any, status: any) => {
      if (status === "OK") {
        directionsRenderer.setDirections(response);
      } else {
        console.error(`Directions request failed due to ${status}`);
      }
    },
  );

  return directionsRenderer;
};

// Helper function to geocode an address to coordinates
export const geocodeAddress = async (address: string) => {
  if (!window.google) {
    console.error("Google Maps SDK not loaded");
    return null;
  }

  const geocoder = new window.google.maps.Geocoder();

  return new Promise((resolve, reject) => {
    geocoder.geocode({ address }, (results: any, status: any) => {
      if (status === "OK" && results[0]) {
        resolve({
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng(),
        });
      } else {
        reject(`Geocoding failed due to ${status}`);
      }
    });
  });
};

// Helper function to load the Google Maps script
export const loadGoogleMapsScript = (callback: () => void) => {
  if (window.google && window.google.maps) {
    callback();
    return;
  }

  const script = document.createElement("script");
  script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
  script.async = true;
  script.defer = true;
  script.onload = callback;
  document.head.appendChild(script);
};

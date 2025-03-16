// This file is now replaced by googleMaps.ts
// Keeping this file for backward compatibility but it should not be used

export const AZURE_MAPS_KEY = "";

declare global {
  interface Window {
    atlas: any;
  }
}

// These functions are now deprecated - use the ones in googleMaps.ts instead
export const initializeMap = () => null;
export const createRoute = () => null;
export const geocodeAddress = async () => null;

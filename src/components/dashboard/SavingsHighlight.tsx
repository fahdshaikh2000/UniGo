import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, MapPin, Fuel, Car } from "lucide-react";

interface SavingsHighlightProps {
  totalKmTravelled?: number;
  totalRides?: number;
  fuelEfficiency?: number; // km per liter
  fuelPrice?: number; // PKR per liter
}

const SavingsHighlight = ({
  totalKmTravelled = 1250,
  totalRides = 24,
  fuelEfficiency = 12, // Average Pakistani car efficiency (km/l)
  fuelPrice = 280, // Current approximate fuel price in PKR
}: SavingsHighlightProps) => {
  // Calculate fuel saved (assuming each passenger would have driven separately)
  const averagePassengersPerRide = 2.5; // Assuming average of 2.5 passengers per ride
  const fuelSavedLiters =
    (totalKmTravelled * (averagePassengersPerRide - 1)) / fuelEfficiency;

  // Calculate money saved
  const moneySavedPKR = fuelSavedLiters * fuelPrice;

  // Calculate CO2 reduction (2.3 kg per liter of petrol)
  const co2ReductionKg = fuelSavedLiters * 2.3;

  return (
    <Card className="w-full bg-gradient-to-br from-green-50 to-blue-50 border-green-100">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2 text-green-800">
          <Fuel className="h-5 w-5 text-green-600" />
          Your Carpooling Impact
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-green-700">Money Saved</p>
                <h3 className="text-2xl font-bold text-green-800">
                  PKR{" "}
                  {moneySavedPKR.toLocaleString("en-US", {
                    maximumFractionDigits: 0,
                  })}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-full">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-blue-700">Distance Travelled</p>
                <h3 className="text-2xl font-bold text-blue-800">
                  {totalKmTravelled.toLocaleString("en-US")} km
                </h3>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-3 rounded-full">
                <Car className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-purple-700">Fuel Saved</p>
                <h3 className="text-2xl font-bold text-purple-800">
                  {fuelSavedLiters.toLocaleString("en-US", {
                    maximumFractionDigits: 1,
                  })}{" "}
                  liters
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-amber-100 p-3 rounded-full">
                <svg
                  className="h-6 w-6 text-amber-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 22C2 17.5817 5.58172 14 10 14C14.4183 14 18 17.5817 18 22H2Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10 11C12.2091 11 14 9.20914 14 7C14 4.79086 12.2091 3 10 3C7.79086 3 6 4.79086 6 7C6 9.20914 7.79086 11 10 11Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21.5 2.5C21.5 2.5 22 3 22 5C22 7 21.5 7.5 21.5 7.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M19.5 4.5C19.5 4.5 19 5 19 7C19 9 19.5 9.5 19.5 9.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-amber-700">CO₂ Reduction</p>
                <h3 className="text-2xl font-bold text-amber-800">
                  {co2ReductionKg.toLocaleString("en-US", {
                    maximumFractionDigits: 1,
                  })}{" "}
                  kg
                </h3>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-green-100">
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Based on {totalRides} rides with an average fuel efficiency of{" "}
              {fuelEfficiency} km/L
            </p>
            <div className="mt-2 text-xs inline-flex items-center px-2.5 py-1 rounded-full bg-green-100 text-green-800">
              <Fuel className="h-3 w-3 mr-1" /> Keep carpooling to increase your
              savings!
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SavingsHighlight;

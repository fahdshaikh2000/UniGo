import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Fuel, DollarSign, Users, Car } from "lucide-react";

interface FuelSavingsCalculatorProps {
  distance?: number; // in kilometers
  passengers?: number;
  fuelPrice?: number; // per liter
  fuelEfficiency?: number; // km per liter
}

const FuelSavingsCalculator = ({
  distance = 20,
  passengers = 3,
  fuelPrice = 280, // PKR per liter (approximate price in Pakistan)
  fuelEfficiency = 12, // km per liter (average car)
}: FuelSavingsCalculatorProps) => {
  const [distanceValue, setDistanceValue] = useState(distance);
  const [passengersValue, setPassengersValue] = useState(passengers);
  const [fuelPriceValue, setFuelPriceValue] = useState(fuelPrice);
  const [fuelEfficiencyValue, setFuelEfficiencyValue] =
    useState(fuelEfficiency);

  const [fuelSaved, setFuelSaved] = useState(0);
  const [moneySaved, setMoneySaved] = useState(0);
  const [co2Reduced, setCo2Reduced] = useState(0);

  // Calculate savings whenever inputs change
  useEffect(() => {
    // Calculate fuel saved (in liters)
    // Formula: distance * (passengers - 1) / fuel efficiency
    // This assumes that without carpooling, each passenger would drive separately
    const fuelSavedLiters =
      (distanceValue * (passengersValue - 1)) / fuelEfficiencyValue;
    setFuelSaved(fuelSavedLiters);

    // Calculate money saved (in PKR)
    const moneySavedAmount = fuelSavedLiters * fuelPriceValue;
    setMoneySaved(moneySavedAmount);

    // Calculate CO2 reduction (in kg)
    // Average CO2 emission is about 2.3 kg per liter of petrol
    const co2ReducedKg = fuelSavedLiters * 2.3;
    setCo2Reduced(co2ReducedKg);
  }, [distanceValue, passengersValue, fuelPriceValue, fuelEfficiencyValue]);

  return (
    <Card className="w-full bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Fuel className="h-5 w-5 text-green-600" />
          Fuel Savings Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="distance">Trip Distance (km)</Label>
                <span className="text-sm font-medium">{distanceValue} km</span>
              </div>
              <Slider
                id="distance"
                min={1}
                max={100}
                step={1}
                defaultValue={[distanceValue]}
                onValueChange={(value) => setDistanceValue(value[0])}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="passengers">Number of Passengers</Label>
                <span className="text-sm font-medium">{passengersValue}</span>
              </div>
              <Slider
                id="passengers"
                min={1}
                max={8}
                step={1}
                defaultValue={[passengersValue]}
                onValueChange={(value) => setPassengersValue(value[0])}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fuel-price">Fuel Price (PKR/L)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    id="fuel-price"
                    type="number"
                    className="pl-10"
                    value={fuelPriceValue}
                    onChange={(e) =>
                      setFuelPriceValue(Number(e.target.value) || 0)
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fuel-efficiency">Fuel Efficiency (km/L)</Label>
                <div className="relative">
                  <Car className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    id="fuel-efficiency"
                    type="number"
                    className="pl-10"
                    value={fuelEfficiencyValue}
                    onChange={(e) =>
                      setFuelEfficiencyValue(Number(e.target.value) || 1)
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Estimated Savings</h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-md">
                <div className="flex items-center">
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    <Fuel className="h-5 w-5 text-green-600" />
                  </div>
                  <span className="font-medium">Fuel Saved</span>
                </div>
                <span className="text-lg font-bold text-green-700">
                  {fuelSaved.toFixed(2)} L
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-md">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <DollarSign className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="font-medium">Money Saved</span>
                </div>
                <span className="text-lg font-bold text-blue-700">
                  PKR {moneySaved.toFixed(0)}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-md">
                <div className="flex items-center">
                  <div className="bg-purple-100 p-2 rounded-full mr-3">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                  <span className="font-medium">Per Person Savings</span>
                </div>
                <span className="text-lg font-bold text-purple-700">
                  PKR {(moneySaved / passengersValue).toFixed(0)}
                </span>
              </div>

              <div className="mt-4 text-center text-sm text-gray-500">
                <p>
                  By carpooling, you're also reducing CO2 emissions by
                  approximately:
                </p>
                <p className="font-bold text-green-600 mt-1">
                  {co2Reduced.toFixed(2)} kg of CO2
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-3 rounded-md text-sm">
          <p className="text-blue-700">
            <strong>Note:</strong> These calculations are estimates based on
            average values. Actual savings may vary depending on your specific
            vehicle, driving conditions, and current fuel prices.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FuelSavingsCalculator;

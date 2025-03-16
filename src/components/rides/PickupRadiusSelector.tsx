import React, { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";

interface PickupRadiusSelectorProps {
  defaultRadius?: number;
  maxRadius?: number;
  onChange?: (radius: number) => void;
  label?: string;
  description?: string;
}

const PickupRadiusSelector = ({
  defaultRadius = 2,
  maxRadius = 10,
  onChange = () => {},
  label = "Pickup Radius",
  description = "Set how far you're willing to travel for pickup",
}: PickupRadiusSelectorProps) => {
  const [radius, setRadius] = useState(defaultRadius);

  const handleRadiusChange = (value: number[]) => {
    const newRadius = value[0];
    setRadius(newRadius);
    onChange(newRadius);
  };

  return (
    <Card className="bg-white border-gray-200">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <Label htmlFor="pickup-radius" className="font-medium">
                {label}
              </Label>
            </div>
            <span className="text-sm font-medium bg-primary/10 text-primary px-2 py-1 rounded-full">
              {radius} km
            </span>
          </div>

          <p className="text-sm text-gray-500">{description}</p>

          <div className="pt-2">
            <Slider
              id="pickup-radius"
              defaultValue={[defaultRadius]}
              max={maxRadius}
              min={0.5}
              step={0.5}
              onValueChange={handleRadiusChange}
            />
          </div>

          <div className="flex justify-between text-xs text-gray-500">
            <span>0.5 km</span>
            <span>{maxRadius} km</span>
          </div>

          <div className="bg-gray-50 p-3 rounded-md text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>0.5-2 km: Short walking distance</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              <span>2-5 km: Moderate distance</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <span>5+ km: Long distance</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PickupRadiusSelector;

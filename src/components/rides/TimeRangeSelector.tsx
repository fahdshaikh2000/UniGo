import React, { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { Input } from "@/components/ui/input";

interface TimeRangeSelectorProps {
  defaultTime?: string;
  defaultFlexibility?: number;
  maxFlexibility?: number;
  onChange?: (time: string, flexibility: number) => void;
}

const TimeRangeSelector = ({
  defaultTime = "",
  defaultFlexibility = 15,
  maxFlexibility = 60,
  onChange = () => {},
}: TimeRangeSelectorProps) => {
  const [time, setTime] = useState(defaultTime);
  const [flexibility, setFlexibility] = useState(defaultFlexibility);

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setTime(newTime);
    onChange(newTime, flexibility);
  };

  const handleFlexibilityChange = (value: number[]) => {
    const newFlexibility = value[0];
    setFlexibility(newFlexibility);
    onChange(time, newFlexibility);
  };

  // Format the time range display
  const formatTimeRange = () => {
    if (!time) return "Select a time first";

    try {
      // Parse the time string (HH:MM)
      const [hours, minutes] = time.split(":").map(Number);

      // Calculate minutes before and after
      const totalMinutes = hours * 60 + minutes;
      const beforeMinutes = totalMinutes - flexibility;
      const afterMinutes = totalMinutes + flexibility;

      // Convert back to hours and minutes
      const beforeHours = Math.floor(beforeMinutes / 60) % 24;
      const beforeMins = beforeMinutes % 60;
      const afterHours = Math.floor(afterMinutes / 60) % 24;
      const afterMins = afterMinutes % 60;

      // Format as HH:MM
      const formatTime = (h: number, m: number) =>
        `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;

      const beforeTime = formatTime(beforeHours, beforeMins);
      const afterTime = formatTime(afterHours, afterMins);

      return `${beforeTime} - ${afterTime}`;
    } catch (e) {
      return "Invalid time format";
    }
  };

  return (
    <Card className="bg-white border-gray-200">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <Label htmlFor="time-selector" className="font-medium">
              Time with Flexibility
            </Label>
          </div>

          <p className="text-sm text-gray-500">
            Set your preferred time and how flexible you can be (± minutes)
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="time-input" className="text-sm">
                Preferred Time
              </Label>
              <div className="relative">
                <Clock className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  id="time-input"
                  type="time"
                  className="pl-10"
                  value={time}
                  onChange={handleTimeChange}
                />
              </div>
            </div>

            <div>
              <Label
                htmlFor="flexibility"
                className="text-sm flex justify-between"
              >
                <span>Time Flexibility</span>
                <span className="text-primary">± {flexibility} min</span>
              </Label>
              <Slider
                id="flexibility"
                defaultValue={[defaultFlexibility]}
                max={maxFlexibility}
                min={5}
                step={5}
                onValueChange={handleFlexibilityChange}
              />
            </div>
          </div>

          <div className="bg-primary/10 p-3 rounded-md">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Time Range:</span>
              <span className="text-sm font-bold text-primary">
                {formatTimeRange()}
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              This means you're willing to depart anytime within this window
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimeRangeSelector;

import React, { useState } from "react";
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  DollarSign,
  Filter,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RideSearchFiltersProps {
  onFilterChange?: (filters: FilterState) => void;
  className?: string;
}

interface FilterState {
  origin: string;
  destination: string;
  date: string;
  timeRange: [number, number];
  priceRange: [number, number];
  seatsNeeded: number;
  genderPreference: string;
  onlyVerifiedDrivers: boolean;
  sortBy: string;
}

const RideSearchFilters = ({
  onFilterChange = () => {},
  className = "",
}: RideSearchFiltersProps) => {
  const [filters, setFilters] = useState<FilterState>({
    origin: "",
    destination: "",
    date: "",
    timeRange: [6, 22], // 6 AM to 10 PM
    priceRange: [0, 50],
    seatsNeeded: 1,
    genderPreference: "any",
    onlyVerifiedDrivers: true,
    sortBy: "departure",
  });

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const formatTimeValue = (value: number) => {
    const hour = Math.floor(value);
    const minute = (value - hour) * 60;
    const period = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    return `${hour12}:${minute === 0 ? "00" : minute} ${period}`;
  };

  return (
    <Card className={`w-full h-full bg-white ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Filter Rides</h3>
          <Filter className="h-5 w-5 text-gray-500" />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Location Filters */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="origin"
              className="text-sm font-medium flex items-center gap-2"
            >
              <MapPin className="h-4 w-4 text-gray-500" />
              From
            </label>
            <Input
              id="origin"
              placeholder="Enter pickup location"
              value={filters.origin}
              onChange={(e) => handleFilterChange("origin", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="destination"
              className="text-sm font-medium flex items-center gap-2"
            >
              <MapPin className="h-4 w-4 text-gray-500" />
              To
            </label>
            <Input
              id="destination"
              placeholder="Enter destination"
              value={filters.destination}
              onChange={(e) =>
                handleFilterChange("destination", e.target.value)
              }
            />
          </div>
        </div>

        {/* Date Filter */}
        <div className="space-y-2">
          <label
            htmlFor="date"
            className="text-sm font-medium flex items-center gap-2"
          >
            <Calendar className="h-4 w-4 text-gray-500" />
            Date
          </label>
          <Input
            id="date"
            type="date"
            value={filters.date}
            onChange={(e) => handleFilterChange("date", e.target.value)}
          />
        </div>

        {/* Time Range Filter */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              Time Range
            </label>
            <span className="text-xs text-gray-500">
              {formatTimeValue(filters.timeRange[0])} -{" "}
              {formatTimeValue(filters.timeRange[1])}
            </span>
          </div>
          <Slider
            defaultValue={filters.timeRange}
            min={0}
            max={24}
            step={0.5}
            onValueChange={(value) => handleFilterChange("timeRange", value)}
          />
        </div>

        {/* Price Range Filter */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-gray-500" />
              Price Range
            </label>
            <span className="text-xs text-gray-500">
              ${filters.priceRange[0]} - ${filters.priceRange[1]}
            </span>
          </div>
          <Slider
            defaultValue={filters.priceRange}
            min={0}
            max={100}
            step={1}
            onValueChange={(value) => handleFilterChange("priceRange", value)}
          />
        </div>

        {/* Seats Needed Filter */}
        <div className="space-y-2">
          <label
            htmlFor="seats"
            className="text-sm font-medium flex items-center gap-2"
          >
            <Users className="h-4 w-4 text-gray-500" />
            Seats Needed
          </label>
          <Select
            value={filters.seatsNeeded.toString()}
            onValueChange={(value) =>
              handleFilterChange("seatsNeeded", parseInt(value))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select seats" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 seat</SelectItem>
              <SelectItem value="2">2 seats</SelectItem>
              <SelectItem value="3">3 seats</SelectItem>
              <SelectItem value="4">4 seats</SelectItem>
              <SelectItem value="5">5+ seats</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Gender Preference Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Gender Preference</label>
          <RadioGroup
            value={filters.genderPreference}
            onValueChange={(value) =>
              handleFilterChange("genderPreference", value)
            }
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="any" id="any" />
              <label htmlFor="any" className="text-sm">
                Any
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="male" id="male" />
              <label htmlFor="male" className="text-sm">
                Male drivers only
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="female" id="female" />
              <label htmlFor="female" className="text-sm">
                Female drivers only
              </label>
            </div>
          </RadioGroup>
        </div>

        {/* Verified Drivers Filter */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="verified"
            checked={filters.onlyVerifiedDrivers}
            onCheckedChange={(checked) =>
              handleFilterChange("onlyVerifiedDrivers", checked === true)
            }
          />
          <label
            htmlFor="verified"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Only show verified drivers
          </label>
        </div>

        {/* Sort By Filter */}
        <div className="space-y-2">
          <label htmlFor="sortBy" className="text-sm font-medium">
            Sort Results By
          </label>
          <Select
            value={filters.sortBy}
            onValueChange={(value) => handleFilterChange("sortBy", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="departure">Departure Time</SelectItem>
              <SelectItem value="price">Price (Low to High)</SelectItem>
              <SelectItem value="rating">Driver Rating</SelectItem>
              <SelectItem value="distance">Distance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>

      <CardFooter className="flex justify-center pt-4">
        <button
          className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          onClick={() => onFilterChange(filters)}
        >
          Apply Filters
        </button>
      </CardFooter>
    </Card>
  );
};

export default RideSearchFilters;

import React, { useState } from "react";
import {
  Search,
  Filter,
  SortAsc,
  SortDesc,
  MapPin,
  Clock,
  Users,
  DollarSign,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import RideCard from "./RideCard";

interface Ride {
  id: string;
  driverName: string;
  driverAvatar: string;
  driverRating: number;
  origin: string;
  destination: string;
  date: string;
  time: string;
  availableSeats: number;
  price: number;
  carModel: string;
}

interface RideSearchResultsProps {
  rides?: Ride[];
  isLoading?: boolean;
  onRequestRide?: (id: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  sortBy?: string;
  onSortChange?: (sortBy: string) => void;
}

const RideSearchResults = ({
  rides = [
    {
      id: "1",
      driverName: "Fahd Niaz Shaikh",
      driverAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=fahd",
      driverRating: 4.8,
      origin: "LUMS Campus",
      destination: "Gulberg",
      date: "May 15, 2023",
      time: "3:30 PM",
      availableSeats: 3,
      price: 500,
      carModel: "Honda City (2020)",
    },
    {
      id: "2",
      driverName: "Ayesha Khan",
      driverAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ayesha",
      driverRating: 4.9,
      origin: "LUMS Campus",
      destination: "Packages Mall",
      date: "May 15, 2023",
      time: "4:00 PM",
      availableSeats: 2,
      price: 450,
      carModel: "Honda Civic (2020)",
    },
    {
      id: "3",
      driverName: "Ali Ahmed",
      driverAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ali",
      driverRating: 4.7,
      origin: "LUMS Campus",
      destination: "Allama Iqbal Airport",
      date: "May 16, 2023",
      time: "8:00 AM",
      availableSeats: 4,
      price: 1200,
      carModel: "Toyota Corolla (2021)",
    },
    {
      id: "4",
      driverName: "Fatima Akhtar",
      driverAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=fatima",
      driverRating: 4.6,
      origin: "LUMS Campus",
      destination: "Alhamra Arts Council",
      date: "May 17, 2023",
      time: "6:30 PM",
      availableSeats: 1,
      price: 600,
      carModel: "Suzuki Swift (2019)",
    },
    {
      id: "5",
      driverName: "Usman Malik",
      driverAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=usman",
      driverRating: 5.0,
      origin: "LUMS Campus",
      destination: "Jinnah Park",
      date: "May 18, 2023",
      time: "10:00 AM",
      availableSeats: 3,
      price: 800,
      carModel: "Kia Sportage (2022)",
    },
  ],
  isLoading = false,
  onRequestRide = () => {},
  searchQuery = "",
  onSearchChange = () => {},
  sortBy = "time",
  onSortChange = () => {},
}: RideSearchResultsProps) => {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [localSortBy, setLocalSortBy] = useState(sortBy);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchQuery(e.target.value);
    onSearchChange(e.target.value);
  };

  const handleSortChange = (newSortBy: string) => {
    if (newSortBy === localSortBy) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setLocalSortBy(newSortBy);
      setSortDirection("asc");
    }
    onSortChange(newSortBy);
  };

  const sortedRides = [...rides].sort((a, b) => {
    let comparison = 0;
    switch (localSortBy) {
      case "price":
        comparison = a.price - b.price;
        break;
      case "time":
        // Simple string comparison for demo purposes
        // In a real app, you'd parse these into Date objects
        comparison = a.time.localeCompare(b.time);
        break;
      case "seats":
        comparison = a.availableSeats - b.availableSeats;
        break;
      case "rating":
        comparison = a.driverRating - b.driverRating;
        break;
      default:
        comparison = 0;
    }
    return sortDirection === "asc" ? comparison : -comparison;
  });

  return (
    <div className="w-full h-full bg-gray-50 rounded-lg p-4 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="relative flex-1 max-w-md">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <Input
            className="pl-10 pr-4 py-2 w-full"
            placeholder="Search by destination or driver name"
            value={localSearchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <div className="flex items-center space-x-2 ml-4">
          <Button
            variant="outline"
            size="sm"
            className={`flex items-center ${localSortBy === "price" ? "bg-blue-50 border-blue-200" : ""}`}
            onClick={() => handleSortChange("price")}
          >
            <DollarSign size={16} className="mr-1" />
            Price
            {localSortBy === "price" &&
              (sortDirection === "asc" ? (
                <SortAsc size={16} className="ml-1" />
              ) : (
                <SortDesc size={16} className="ml-1" />
              ))}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={`flex items-center ${localSortBy === "time" ? "bg-blue-50 border-blue-200" : ""}`}
            onClick={() => handleSortChange("time")}
          >
            <Clock size={16} className="mr-1" />
            Time
            {localSortBy === "time" &&
              (sortDirection === "asc" ? (
                <SortAsc size={16} className="ml-1" />
              ) : (
                <SortDesc size={16} className="ml-1" />
              ))}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={`flex items-center ${localSortBy === "seats" ? "bg-blue-50 border-blue-200" : ""}`}
            onClick={() => handleSortChange("seats")}
          >
            <Users size={16} className="mr-1" />
            Seats
            {localSortBy === "seats" &&
              (sortDirection === "asc" ? (
                <SortAsc size={16} className="ml-1" />
              ) : (
                <SortDesc size={16} className="ml-1" />
              ))}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={`flex items-center ${localSortBy === "rating" ? "bg-blue-50 border-blue-200" : ""}`}
            onClick={() => handleSortChange("rating")}
          >
            <span className="mr-1">★</span>
            Rating
            {localSortBy === "rating" &&
              (sortDirection === "asc" ? (
                <SortAsc size={16} className="ml-1" />
              ) : (
                <SortDesc size={16} className="ml-1" />
              ))}
          </Button>
        </div>
      </div>

      <div className="flex items-center mb-4">
        <MapPin size={16} className="text-gray-500 mr-2" />
        <span className="text-sm font-medium">Popular destinations:</span>
        <div className="flex space-x-2 ml-2">
          <Badge variant="outline" className="cursor-pointer hover:bg-blue-50">
            Gulberg
          </Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-blue-50">
            Allama Iqbal Airport
          </Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-blue-50">
            Packages Mall
          </Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-blue-50">
            Jinnah Park
          </Badge>
        </div>
      </div>

      <Separator className="mb-4" />

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : sortedRides.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
          <Filter size={48} className="text-gray-400 mb-4" />
          <h3 className="text-xl font-medium mb-2">
            No rides match your criteria
          </h3>
          <p className="text-gray-500 mb-4">
            Try adjusting your filters or search for a different destination
          </p>
          <Button onClick={() => onSearchChange("")}>Clear filters</Button>
        </div>
      ) : (
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {sortedRides.map((ride) => (
              <RideCard
                key={ride.id}
                id={ride.id}
                driverName={ride.driverName}
                driverAvatar={ride.driverAvatar}
                driverRating={ride.driverRating}
                origin={ride.origin}
                destination={ride.destination}
                date={ride.date}
                time={ride.time}
                availableSeats={ride.availableSeats}
                price={ride.price}
                carModel={ride.carModel}
                onRequestRide={onRequestRide}
              />
            ))}
          </div>
        </ScrollArea>
      )}

      <div className="mt-4 text-center text-sm text-gray-500">
        Showing {sortedRides.length} available rides
      </div>
    </div>
  );
};

export default RideSearchResults;

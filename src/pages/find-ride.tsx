import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Clock, DollarSign, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import RideSearchFilters from "@/components/rides/RideSearchFilters";
import RideSearchResults from "@/components/rides/RideSearchResults";
import MapSelector from "@/components/rides/MapSelector";

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

const FindRidePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("time");
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    origin: "",
    destination: "",
    date: "",
    timeRange: [6, 22],
    priceRange: [0, 50],
    seatsNeeded: 1,
    genderPreference: "any",
    onlyVerifiedDrivers: true,
    sortBy: "departure",
  });

  // Sample rides data
  const [rides, setRides] = useState<Ride[]>([
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
  ]);

  const handleFilterChange = (newFilters: FilterState) => {
    setIsLoading(true);
    setFilters(newFilters);

    // Simulate API call delay
    setTimeout(() => {
      // In a real app, this would be an API call with the filters
      // For now, we'll just use the existing rides data
      setIsLoading(false);
    }, 500);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    // In a real app, this would trigger a search API call
  };

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    // In a real app, this would re-sort the results from the API
  };

  const handleRequestRide = (rideId: string) => {
    // Navigate to ride details page
    navigate(`/ride-details/${rideId}`);
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-6 px-4 sm:px-6">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={handleBackToDashboard}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Find a Ride</h1>
              <p className="text-gray-600 mt-1">
                Dastiyaab rides talash karein aur apni manzil ki taraf jaaney
                wale drivers se rabta karein
              </p>
            </div>

            <Card className="bg-blue-50 border-blue-200 w-full md:w-auto">
              <div className="p-4 flex flex-col sm:flex-row gap-4 items-center">
                <div className="flex items-center gap-2">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Mashoor Route</p>
                    <p className="text-xs text-gray-600">LUMS → Gulberg</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Peak Hours</p>
                    <p className="text-xs text-gray-600">8-9 AM, 4-6 PM</p>
                  </div>
                </div>

                <Button size="sm" className="whitespace-nowrap">
                  Quick Match
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <RideSearchFilters
              onFilterChange={handleFilterChange}
              className="sticky top-6"
            />

            {/* Quick Stats */}
            <Card className="mt-6 bg-white">
              <div className="p-4">
                <h3 className="text-sm font-medium mb-2">Quick Stats</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm">Active Drivers</span>
                    </div>
                    <span className="font-medium">42</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm">Avg. Response Time</span>
                    </div>
                    <span className="font-medium">5 min</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm">Avg. Price</span>
                    </div>
                    <span className="font-medium">PKR 650</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Search Results */}
          <div className="lg:col-span-3">
            <RideSearchResults
              rides={rides}
              isLoading={isLoading}
              onRequestRide={handleRequestRide}
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              sortBy={sortBy}
              onSortChange={handleSortChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindRidePage;

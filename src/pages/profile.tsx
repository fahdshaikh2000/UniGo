import React from "react";
import ProfileHeader from "../components/profile/ProfileHeader";
import RideHistory from "../components/profile/RideHistory";
import EcoAchievements from "../components/profile/EcoAchievements";
import VehicleManager from "../components/profile/VehicleManager";
import VerificationUploader from "../components/profile/VerificationUploader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { User, Car, Award, Settings, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfilePageProps {
  userId?: string;
}

const ProfilePage = ({ userId = "user-123" }: ProfilePageProps) => {
  // Mock user data
  const userData = {
    name: "Fahd Niaz Shaikh",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=fahd",
    university: "LUMS University",
    location: "Lahore, Pakistan",
    joinDate: "Member since May 2022",
    rating: 4.8,
    ridesCompleted: 42,
    ridesAsDriver: 15,
    ridesAsPassenger: 27,
    co2Saved: 187,
    verificationStatus: "verified" as const,
  };

  // Mock ride history data
  const asDriverRides = [
    {
      id: "1",
      date: "May 15, 2023",
      time: "3:30 PM",
      origin: "University Campus",
      destination: "Downtown Mall",
      otherPartyName: "Ayesha Khan",
      otherPartyAvatar:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=ayesha",
      otherPartyRating: 4.7,
      price: 6.5,
      status: "completed" as const,
      asDriver: true,
    },
    {
      id: "2",
      date: "May 12, 2023",
      time: "5:15 PM",
      origin: "University Library",
      destination: "Central Station",
      otherPartyName: "Bilal Malik",
      otherPartyAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bilal",
      otherPartyRating: 4.9,
      price: 8.0,
      status: "completed" as const,
      asDriver: true,
    },
    {
      id: "3",
      date: "May 8, 2023",
      time: "9:00 AM",
      origin: "Student Housing",
      destination: "Science Building",
      otherPartyName: "Fatima Akhtar",
      otherPartyAvatar:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=fatima",
      otherPartyRating: 4.5,
      price: 4.0,
      status: "cancelled" as const,
      asDriver: true,
    },
  ];

  const asPassengerRides = [
    {
      id: "4",
      date: "May 18, 2023",
      time: "2:00 PM",
      origin: "University Campus",
      destination: "Shopping Center",
      otherPartyName: "Usman Malik",
      otherPartyAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=usman",
      otherPartyRating: 4.8,
      price: 7.5,
      status: "completed" as const,
      asDriver: false,
    },
    {
      id: "5",
      date: "May 14, 2023",
      time: "11:30 AM",
      origin: "Student Housing",
      destination: "University Campus",
      otherPartyName: "Zainab Qureshi",
      otherPartyAvatar:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=zainab",
      otherPartyRating: 4.6,
      price: 5.0,
      status: "completed" as const,
      asDriver: false,
    },
    {
      id: "6",
      date: "May 10, 2023",
      time: "4:45 PM",
      origin: "University Gym",
      destination: "Downtown",
      otherPartyName: "Hassan Ali",
      otherPartyAvatar:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=hassan",
      otherPartyRating: 4.3,
      price: 9.0,
      status: "completed" as const,
      asDriver: false,
    },
  ];

  // Mock eco achievements data
  const achievements = [
    {
      id: "1",
      name: "Carbon Saver",
      description: "Reduce carbon emissions through carpooling",
      icon: <Award className="h-5 w-5 text-green-500" />,
      progress: 75,
      level: 3,
      maxLevel: 5,
      unlocked: true,
    },
    {
      id: "2",
      name: "Ride Veteran",
      description: "Complete a significant number of shared rides",
      icon: <Car className="h-5 w-5 text-amber-500" />,
      progress: 40,
      level: 2,
      maxLevel: 5,
      unlocked: true,
    },
    {
      id: "3",
      name: "Fuel Optimizer",
      description: "Save fuel through efficient carpooling routes",
      icon: <Award className="h-5 w-5 text-blue-500" />,
      progress: 60,
      level: 3,
      maxLevel: 5,
      unlocked: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top navigation bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-primary">UNIGO</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell size={20} />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings size={20} />
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Car size={16} />
              Create Ride
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Profile header section */}
        <ProfileHeader
          name={userData.name}
          avatar={userData.avatar}
          university={userData.university}
          location={userData.location}
          joinDate={userData.joinDate}
          rating={userData.rating}
          ridesCompleted={userData.ridesCompleted}
          ridesAsDriver={userData.ridesAsDriver}
          ridesAsPassenger={userData.ridesAsPassenger}
          co2Saved={userData.co2Saved}
          verificationStatus={userData.verificationStatus}
        />

        {/* Profile content tabs */}
        <div className="mt-8">
          <Tabs defaultValue="rides" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="rides" className="flex items-center gap-2">
                <Car size={16} />
                Ride History
              </TabsTrigger>
              <TabsTrigger value="vehicles" className="flex items-center gap-2">
                <Car size={16} />
                My Vehicles
              </TabsTrigger>
              <TabsTrigger value="eco" className="flex items-center gap-2">
                <Award size={16} />
                Eco Achievements
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <User size={16} />
                Account Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="rides">
              <RideHistory
                asDriverRides={asDriverRides}
                asPassengerRides={asPassengerRides}
              />
            </TabsContent>

            <TabsContent value="vehicles">
              <div className="space-y-6">
                <VehicleManager />
              </div>
            </TabsContent>

            <TabsContent value="eco">
              <EcoAchievements
                achievements={achievements}
                totalCO2Saved={userData.co2Saved}
                totalRides={userData.ridesCompleted}
                ecoRank="Green Champion"
              />
            </TabsContent>

            <TabsContent value="settings">
              <div className="space-y-6">
                <Card className="w-full bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="text-2xl font-semibold mb-6">
                    Account Settings
                  </h2>
                  <p className="text-gray-500 text-center py-8">
                    Account settings functionality will be implemented in a
                    future update.
                  </p>
                </Card>

                <VerificationUploader status="unverified" />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

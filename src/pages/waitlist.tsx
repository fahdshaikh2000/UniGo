import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Navbar, Footer } from "@/components/layout";
import WaitlistForm from "@/components/waitlist/WaitlistForm";
import WaitlistLeaderboard from "@/components/waitlist/WaitlistLeaderboard";
import CountdownTimer from "@/components/waitlist/CountdownTimer";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Search, ArrowRight } from "lucide-react";
import WaitlistStatus from "@/components/waitlist/WaitlistStatus";

const WaitlistPage = () => {
  const [searchParams] = useSearchParams();
  const referralCode = searchParams.get("ref");
  const [searchEmail, setSearchEmail] = useState("");
  const [activeTab, setActiveTab] = useState<"join" | "check">("join");
  const [checkedEmail, setCheckedEmail] = useState<string>("");

  // Set launch date to 30 days from now
  const launchDate = new Date();
  launchDate.setDate(launchDate.getDate() + 30);

  const handleCheckStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchEmail) {
      toast({
        title: "Email required",
        description: "Please enter your email address to check your status.",
        variant: "destructive",
      });
      return;
    }

    setCheckedEmail(searchEmail);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-16 mt-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Join the UniGo Waitlist</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Be among the first to experience the future of university
              carpooling. Sign up now and invite friends to gain priority
              access!
            </p>
          </div>

          <div className="mb-12">
            <CountdownTimer targetDate={launchDate} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <Tabs
                    value={activeTab}
                    onValueChange={(v) => setActiveTab(v as "join" | "check")}
                  >
                    <TabsList className="grid w-full grid-cols-2 mb-8">
                      <TabsTrigger value="join">Join Waitlist</TabsTrigger>
                      <TabsTrigger value="check">Check Status</TabsTrigger>
                    </TabsList>

                    <TabsContent value="join">
                      <WaitlistForm />
                    </TabsContent>

                    <TabsContent value="check">
                      {!checkedEmail ? (
                        <div className="max-w-md mx-auto">
                          <h2 className="text-2xl font-bold mb-6 text-center">
                            Check Your Status
                          </h2>
                          <form
                            onSubmit={handleCheckStatus}
                            className="space-y-4"
                          >
                            <div>
                              <label
                                htmlFor="email"
                                className="block text-sm font-medium mb-1"
                              >
                                Email Address
                              </label>
                              <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                  id="email"
                                  type="email"
                                  placeholder="Enter your email address"
                                  className="pl-10"
                                  value={searchEmail}
                                  onChange={(e) =>
                                    setSearchEmail(e.target.value)
                                  }
                                />
                              </div>
                            </div>
                            <Button type="submit" className="w-full">
                              <ArrowRight className="h-4 w-4 mr-2" />
                              Check Status
                            </Button>
                          </form>
                        </div>
                      ) : (
                        <WaitlistStatus email={checkedEmail} />
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            <div>
              <WaitlistLeaderboard />
            </div>
          </div>

          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold mb-4">Why Join the Waitlist?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <FeatureCard
                title="Priority Access"
                description="Be among the first to experience UniGo when we launch."
                icon="🚀"
              />
              <FeatureCard
                title="Invite Friends"
                description="Move up the waitlist by referring your university friends."
                icon="👥"
              />
              <FeatureCard
                title="Exclusive Benefits"
                description="Early users will receive special perks and features."
                icon="🎁"
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
}

const FeatureCard = ({ title, description, icon }: FeatureCardProps) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default WaitlistPage;

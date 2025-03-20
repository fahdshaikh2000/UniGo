import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users } from "lucide-react";

interface WaitlistCTAProps {
  totalSignups?: number;
  className?: string;
}

const WaitlistCTA = ({
  totalSignups = 0,
  className = "",
}: WaitlistCTAProps) => {
  const navigate = useNavigate();

  return (
    <div className={`bg-primary/5 rounded-lg p-6 ${className}`}>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold mb-2">Join the UniGo Waitlist</h3>
          <p className="text-gray-600">
            Get early access to the exclusive university carpooling platform.
            {totalSignups > 0 && (
              <span className="font-medium">
                {" "}
                Join {totalSignups}+ students already on the waitlist!
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {totalSignups > 0 && (
            <div className="bg-white px-3 py-2 rounded-md flex items-center gap-2 text-sm font-medium">
              <Users className="h-4 w-4 text-primary" />
              <span>{totalSignups}+ signups</span>
            </div>
          )}
          <Button onClick={() => navigate("/waitlist")}>
            Join Waitlist
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WaitlistCTA;

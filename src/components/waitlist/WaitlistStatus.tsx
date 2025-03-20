import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface WaitlistStatusProps {
  email: string;
}

type WaitlistEntry = {
  id: string;
  position: number;
  referral_code: string;
  referral_count: number;
  status: string;
};

const WaitlistStatus = ({ email }: WaitlistStatusProps) => {
  const [waitlistEntry, setWaitlistEntry] = useState<WaitlistEntry | null>(
    null,
  );
  const [totalAhead, setTotalAhead] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWaitlistStatus = async () => {
      try {
        // Get user's waitlist entry
        const { data, error } = await supabase
          .from("waitlist")
          .select("id, position, referral_code, referral_count, status")
          .eq("email", email)
          .single();

        if (error) throw error;

        setWaitlistEntry(data);

        // Get count of people ahead
        if (data) {
          const { count, error: countError } = await supabase
            .from("waitlist")
            .select("id", { count: "exact", head: true })
            .eq("status", "waiting")
            .lt("position", data.position);

          if (countError) throw countError;

          setTotalAhead(count || 0);
        }
      } catch (error) {
        console.error("Error fetching waitlist status:", error);
      } finally {
        setLoading(false);
      }
    };

    if (email) {
      fetchWaitlistStatus();
    }

    // Set up realtime subscription for position updates
    const subscription = supabase
      .channel(`waitlist-status-${email}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "waitlist",
          filter: `email=eq.${email}`,
        },
        () => fetchWaitlistStatus(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [email]);

  const referralLink = waitlistEntry
    ? `${window.location.origin}/waitlist?ref=${waitlistEntry.referral_code}`
    : "";

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast({ title: "Referral link copied to clipboard!" });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Waitlist Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!waitlistEntry) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Waitlist Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <p>You're not on the waitlist yet.</p>
            <Button
              className="mt-4"
              onClick={() => (window.location.href = "/waitlist")}
            >
              Join Waitlist
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // If user has been invited
  if (waitlistEntry.status === "invited") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>You're In!</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-green-600 font-medium mb-4">
              You've been invited to join UniGo! Check your email for
              instructions.
            </p>
            <Button onClick={() => (window.location.href = "/login")}>
              Login to UniGo
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Waitlist Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Current Position</span>
            <span className="text-sm font-bold text-primary">
              #{waitlistEntry.position}
            </span>
          </div>
          <Progress
            value={100 - (totalAhead / waitlistEntry.position) * 100}
            className="h-2"
          />
          <p className="text-xs text-gray-500 mt-1">
            {totalAhead} people ahead of you
          </p>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Your Referrals</span>
            <span className="text-sm font-bold text-primary">
              {waitlistEntry.referral_count}
            </span>
          </div>
          <div className="bg-gray-100 p-3 rounded-md text-sm flex justify-between items-center">
            <span className="truncate flex-1 mr-2">{referralLink}</span>
            <Button size="sm" variant="outline" onClick={copyReferralLink}>
              <Share2 className="h-4 w-4 mr-1" /> Copy
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Share your link to move up the waitlist faster!
          </p>
        </div>

        <div className="pt-2">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              window.open(
                `https://wa.me/?text=Join me on UniGo, the exclusive university carpooling app! Use my referral link: ${encodeURIComponent(referralLink)}`,
                "_blank",
              );
            }}
          >
            Share on WhatsApp
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WaitlistStatus;

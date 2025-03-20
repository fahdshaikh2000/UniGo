import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Users, ArrowUp } from "lucide-react";

type LeaderboardEntry = {
  id: string;
  name: string;
  university: string;
  referral_count: number;
  position: number;
};

const WaitlistLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [totalSignups, setTotalSignups] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // Get top 10 referrers
        const { data, error } = await supabase
          .from("waitlist")
          .select("id, name, university, referral_count, position")
          .order("referral_count", { ascending: false })
          .limit(10);

        if (error) throw error;

        setLeaderboard(data || []);

        // Get total count
        const { count, error: countError } = await supabase
          .from("waitlist")
          .select("id", { count: "exact", head: true });

        if (countError) throw countError;

        setTotalSignups(count || 0);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();

    // Set up realtime subscription
    const subscription = supabase
      .channel("waitlist-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "waitlist" },
        () => fetchLeaderboard(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Top Referrers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Top Referrers</span>
          <Badge variant="outline" className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {totalSignups} Signups
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {leaderboard.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No referrals yet. Be the first!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {leaderboard.map((entry, index) => (
              <div
                key={entry.id}
                className={`flex items-center justify-between p-3 rounded-md ${index < 3 ? "bg-primary/5" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                    {index === 0 ? (
                      <Trophy className="h-4 w-4 text-yellow-500" />
                    ) : index === 1 ? (
                      <Trophy className="h-4 w-4 text-gray-400" />
                    ) : index === 2 ? (
                      <Trophy className="h-4 w-4 text-amber-700" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <div>
                    <p className="font-medium truncate max-w-[150px]">
                      {entry.name}
                    </p>
                    <p className="text-xs text-gray-500">{entry.university}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-primary font-medium">
                    <ArrowUp className="h-4 w-4" />
                    {entry.referral_count}
                  </div>
                  <p className="text-xs text-gray-500">
                    Position #{entry.position}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WaitlistLeaderboard;

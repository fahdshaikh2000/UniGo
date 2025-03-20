import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import {
  Users,
  UserPlus,
  Mail,
  CheckCircle,
  Clock,
  BarChart3,
} from "lucide-react";

interface WaitlistStats {
  totalSignups: number;
  totalReferrals: number;
  waitingCount: number;
  invitedCount: number;
  joinedCount: number;
  conversionRate: number;
}

interface WaitlistUser {
  id: string;
  name: string;
  email: string;
  university: string;
  phone: string | null;
  position: number;
  referral_count: number;
  status: string;
  access_level: string;
  created_at: string;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<WaitlistStats>({
    totalSignups: 0,
    totalReferrals: 0,
    waitingCount: 0,
    invitedCount: 0,
    joinedCount: 0,
    conversionRate: 0,
  });
  const [users, setUsers] = useState<WaitlistUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  useEffect(() => {
    fetchData();

    // Set up realtime subscription
    const subscription = supabase
      .channel("admin-waitlist-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "waitlist" },
        () => fetchData(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch users
      const { data: usersData, error: usersError } = await supabase
        .from("waitlist")
        .select("*")
        .order("position", { ascending: true });

      if (usersError) throw usersError;
      setUsers(usersData || []);

      // Calculate stats
      const totalSignups = usersData?.length || 0;
      const totalReferrals =
        usersData?.reduce((sum, user) => sum + (user.referral_count || 0), 0) ||
        0;
      const waitingCount =
        usersData?.filter((user) => user.status === "waiting").length || 0;
      const invitedCount =
        usersData?.filter((user) => user.status === "invited").length || 0;
      const joinedCount =
        usersData?.filter((user) => user.status === "joined").length || 0;
      const conversionRate =
        totalSignups > 0 ? (joinedCount / totalSignups) * 100 : 0;

      setStats({
        totalSignups,
        totalReferrals,
        waitingCount,
        invitedCount,
        joinedCount,
        conversionRate,
      });
    } catch (error) {
      console.error("Error fetching admin data:", error);
      toast({
        title: "Error fetching data",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInviteUsers = async () => {
    if (selectedUsers.length === 0) {
      toast({
        title: "No users selected",
        description: "Please select users to invite.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("waitlist")
        .update({ status: "invited" })
        .in("id", selectedUsers);

      if (error) throw error;

      toast({
        title: "Users invited successfully",
        description: `${selectedUsers.length} users have been invited to join UniGo.`,
      });

      // Clear selection
      setSelectedUsers([]);
    } catch (error) {
      console.error("Error inviting users:", error);
      toast({
        title: "Error inviting users",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateAccessLevel = async (
    userId: string,
    accessLevel: string,
  ) => {
    try {
      const { error } = await supabase
        .from("waitlist")
        .update({ access_level: accessLevel })
        .eq("id", userId);

      if (error) throw error;

      toast({
        title: "Access level updated",
        description: `User's access level has been updated to ${accessLevel}.`,
      });
    } catch (error) {
      console.error("Error updating access level:", error);
      toast({
        title: "Error updating access level",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.university.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const selectAllVisible = () => {
    setSelectedUsers(filteredUsers.map((user) => user.id));
  };

  const clearSelection = () => {
    setSelectedUsers([]);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Signups"
          value={stats.totalSignups}
          icon={<Users className="h-5 w-5" />}
          description="Users on waitlist"
        />
        <StatCard
          title="Total Referrals"
          value={stats.totalReferrals}
          icon={<UserPlus className="h-5 w-5" />}
          description="Generated by users"
        />
        <StatCard
          title="Conversion Rate"
          value={`${stats.conversionRate.toFixed(1)}%`}
          icon={<BarChart3 className="h-5 w-5" />}
          description="Waitlist to joined"
        />
        <StatCard
          title="Status Breakdown"
          value={`${stats.waitingCount} / ${stats.invitedCount} / ${stats.joinedCount}`}
          icon={<Clock className="h-5 w-5" />}
          description="Waiting / Invited / Joined"
        />
      </div>

      <Tabs defaultValue="users">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users">Manage Users</TabsTrigger>
          <TabsTrigger value="invites">Send Invites</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Waitlist Users</CardTitle>
              <CardDescription>
                View and manage users on the waitlist
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search by name, email, or university"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="w-full md:w-48">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="waiting">Waiting</SelectItem>
                      <SelectItem value="invited">Invited</SelectItem>
                      <SelectItem value="joined">Joined</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="border rounded-md">
                <div className="grid grid-cols-12 gap-2 p-3 bg-gray-50 font-medium text-sm border-b">
                  <div className="col-span-1">#</div>
                  <div className="col-span-3">Name</div>
                  <div className="col-span-3">Email</div>
                  <div className="col-span-2">University</div>
                  <div className="col-span-1">Refs</div>
                  <div className="col-span-2">Status</div>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {loading ? (
                    <div className="flex justify-center items-center h-32">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : filteredUsers.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>No users found</p>
                    </div>
                  ) : (
                    filteredUsers.map((user) => (
                      <div
                        key={user.id}
                        className="grid grid-cols-12 gap-2 p-3 text-sm border-b hover:bg-gray-50"
                      >
                        <div className="col-span-1 font-medium">
                          #{user.position}
                        </div>
                        <div className="col-span-3 truncate">{user.name}</div>
                        <div className="col-span-3 truncate">{user.email}</div>
                        <div className="col-span-2 truncate">
                          {user.university}
                        </div>
                        <div className="col-span-1">{user.referral_count}</div>
                        <div className="col-span-2 flex items-center gap-2">
                          <Select
                            value={user.access_level}
                            onValueChange={(value) =>
                              handleUpdateAccessLevel(user.id, value)
                            }
                          >
                            <SelectTrigger className="h-7 w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="general">General</SelectItem>
                              <SelectItem value="early_access">
                                Early
                              </SelectItem>
                              <SelectItem value="vip">VIP</SelectItem>
                            </SelectContent>
                          </Select>

                          <StatusBadge status={user.status} />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invites" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Send Invites</CardTitle>
              <CardDescription>Invite users to join UniGo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between mb-4">
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={selectAllVisible}
                  >
                    Select All
                  </Button>
                  <Button variant="outline" size="sm" onClick={clearSelection}>
                    Clear
                  </Button>
                </div>
                <div>
                  <span className="text-sm mr-2">
                    {selectedUsers.length} users selected
                  </span>
                  <Button
                    size="sm"
                    onClick={handleInviteUsers}
                    disabled={selectedUsers.length === 0}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Send Invites
                  </Button>
                </div>
              </div>

              <div className="border rounded-md">
                <div className="grid grid-cols-12 gap-2 p-3 bg-gray-50 font-medium text-sm border-b">
                  <div className="col-span-1">Select</div>
                  <div className="col-span-1">#</div>
                  <div className="col-span-3">Name</div>
                  <div className="col-span-3">Email</div>
                  <div className="col-span-2">University</div>
                  <div className="col-span-1">Refs</div>
                  <div className="col-span-1">Status</div>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {loading ? (
                    <div className="flex justify-center items-center h-32">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : filteredUsers.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>No users found</p>
                    </div>
                  ) : (
                    filteredUsers.map((user) => (
                      <div
                        key={user.id}
                        className={`grid grid-cols-12 gap-2 p-3 text-sm border-b hover:bg-gray-50 ${selectedUsers.includes(user.id) ? "bg-primary/5" : ""}`}
                      >
                        <div className="col-span-1">
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user.id)}
                            onChange={() => toggleUserSelection(user.id)}
                            disabled={user.status !== "waiting"}
                            className="rounded text-primary focus:ring-primary"
                          />
                        </div>
                        <div className="col-span-1 font-medium">
                          #{user.position}
                        </div>
                        <div className="col-span-3 truncate">{user.name}</div>
                        <div className="col-span-3 truncate">{user.email}</div>
                        <div className="col-span-2 truncate">
                          {user.university}
                        </div>
                        <div className="col-span-1">{user.referral_count}</div>
                        <div className="col-span-1">
                          <StatusBadge status={user.status} />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  description: string;
}

const StatCard = ({ title, value, icon, description }: StatCardProps) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        </div>
        <div className="bg-primary/10 p-2 rounded-full">{icon}</div>
      </div>
    </CardContent>
  </Card>
);

interface StatusBadgeProps {
  status: string;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  switch (status) {
    case "waiting":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
          <Clock className="h-3 w-3 mr-1" />
          Waiting
        </span>
      );
    case "invited":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
          <Mail className="h-3 w-3 mr-1" />
          Invited
        </span>
      );
    case "joined":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Joined
        </span>
      );
    default:
      return null;
  }
};

export default AdminDashboard;

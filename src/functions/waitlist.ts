import { supabase } from "@/lib/supabase";

/**
 * Joins the waitlist with the provided information
 */
export const joinWaitlist = async ({
  name,
  email,
  university,
  phone,
  referralCode,
}: {
  name: string;
  email: string;
  university: string;
  phone?: string;
  referralCode?: string;
}) => {
  try {
    // Check if referral code exists
    let referrerId = null;
    if (referralCode) {
      const { data: referrerData } = await supabase
        .from("waitlist")
        .select("id")
        .eq("referral_code", referralCode)
        .single();

      if (referrerData) {
        referrerId = referrerData.id;
      }
    }

    // Insert into waitlist
    const { data, error } = await supabase
      .from("waitlist")
      .insert({
        name,
        email,
        university,
        phone: phone || null,
        referrer_id: referrerId,
        referral_code: "PLACEHOLDER", // Will be replaced by database function
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Get updated position and referral code
    const { data: updatedData, error: updateError } = await supabase
      .from("waitlist")
      .select("position, referral_code")
      .eq("id", data.id)
      .single();

    if (updateError) {
      throw updateError;
    }

    return {
      success: true,
      data: {
        ...data,
        position: updatedData.position,
        referral_code: updatedData.referral_code,
      },
    };
  } catch (error) {
    console.error("Error joining waitlist:", error);
    return {
      success: false,
      error,
    };
  }
};

/**
 * Gets the waitlist status for a user by email
 */
export const getWaitlistStatus = async (email: string) => {
  try {
    const { data, error } = await supabase
      .from("waitlist")
      .select("id, position, referral_code, referral_count, status")
      .eq("email", email)
      .single();

    if (error) {
      throw error;
    }

    // Get count of people ahead
    let totalAhead = 0;
    if (data) {
      const { count, error: countError } = await supabase
        .from("waitlist")
        .select("id", { count: "exact", head: true })
        .eq("status", "waiting")
        .lt("position", data.position);

      if (countError) {
        throw countError;
      }

      totalAhead = count || 0;
    }

    return {
      success: true,
      data: {
        ...data,
        totalAhead,
      },
    };
  } catch (error) {
    console.error("Error getting waitlist status:", error);
    return {
      success: false,
      error,
    };
  }
};

/**
 * Gets the top referrers for the leaderboard
 */
export const getWaitlistLeaderboard = async (limit = 10) => {
  try {
    const { data, error } = await supabase
      .from("waitlist")
      .select("id, name, university, referral_count, position")
      .order("referral_count", { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    // Get total count
    const { count, error: countError } = await supabase
      .from("waitlist")
      .select("id", { count: "exact", head: true });

    if (countError) {
      throw countError;
    }

    return {
      success: true,
      data,
      totalSignups: count || 0,
    };
  } catch (error) {
    console.error("Error getting waitlist leaderboard:", error);
    return {
      success: false,
      error,
    };
  }
};

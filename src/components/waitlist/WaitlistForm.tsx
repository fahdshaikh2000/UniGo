import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/lib/supabase";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Loader2, CheckCircle2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  university: z.string().min(1, { message: "Please select your university" }),
  phone: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const universities = [
  "LUMS",
  "FAST",
  "NUST",
  "IBA",
  "UET",
  "GIKI",
  "COMSATS",
  "BNU",
  "LSE",
  "Other",
];

const WaitlistForm = () => {
  const [searchParams] = useSearchParams();
  const referralCode = searchParams.get("ref");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [waitlistPosition, setWaitlistPosition] = useState<number | null>(null);
  const [userReferralCode, setUserReferralCode] = useState<string>("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      university: "",
      phone: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
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
          name: values.name,
          email: values.email,
          university: values.university,
          phone: values.phone || null,
          referrer_id: referrerId,
          referral_code: "PLACEHOLDER", // Will be replaced by database function
        })
        .select()
        .single();

      if (error) {
        if (error.code === "23505") {
          // Unique violation
          toast({
            title: "Already on the waitlist",
            description: "This email is already registered on our waitlist.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
        return;
      }

      // Get updated position
      const { data: positionData } = await supabase
        .from("waitlist")
        .select("position, referral_code")
        .eq("id", data.id)
        .single();

      if (positionData) {
        setWaitlistPosition(positionData.position);
        setUserReferralCode(positionData.referral_code);
      }

      setIsSuccess(true);
      toast({
        title: "Successfully joined the waitlist!",
        description: "We'll notify you when it's your turn to join UniGo.",
      });
    } catch (error) {
      console.error("Error joining waitlist:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const referralLink = userReferralCode
    ? `${window.location.origin}/waitlist?ref=${userReferralCode}`
    : "";

  if (isSuccess) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-auto text-center">
        <CheckCircle2 className="h-16 w-16 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">You're on the waitlist!</h2>
        <p className="text-gray-600 mb-6">
          Your current position:{" "}
          <span className="font-bold text-primary">{waitlistPosition}</span>
        </p>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">
            Want to move up the list?
          </h3>
          <p className="text-gray-600 mb-4">
            Share your referral link with friends to gain priority access!
          </p>

          <div className="bg-gray-100 p-3 rounded-md mb-4 relative">
            <p className="text-sm font-mono truncate">{referralLink}</p>
            <button
              onClick={() => {
                navigator.clipboard.writeText(referralLink);
                toast({ title: "Copied to clipboard!" });
              }}
              className="absolute right-2 top-2 text-xs bg-primary text-white px-2 py-1 rounded"
            >
              Copy
            </button>
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                window.open(
                  `https://wa.me/?text=Join me on UniGo, the exclusive university carpooling app! Use my referral link: ${encodeURIComponent(referralLink)}`,
                  "_blank",
                );
              }}
            >
              Share on WhatsApp
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                window.open(
                  `https://twitter.com/intent/tweet?text=${encodeURIComponent(`I just joined the waitlist for UniGo, the exclusive university carpooling app! Join me using my referral link: ${referralLink}`)}`,
                  "_blank",
                );
              }}
            >
              Share on Twitter
            </Button>
          </div>
        </div>

        <Button onClick={() => (window.location.href = "/")} className="w-full">
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Join the UniGo Waitlist
      </h2>

      {referralCode && (
        <div className="bg-primary/10 p-3 rounded-md mb-6">
          <p className="text-sm text-primary font-medium">
            You've been referred! You'll get priority access.
          </p>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input placeholder="john@university.edu" {...field} />
                </FormControl>
                <FormDescription>
                  Preferably use your university email
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="university"
            render={({ field }) => (
              <FormItem>
                <FormLabel>University</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your university" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {universities.map((uni) => (
                      <SelectItem key={uni} value={uni}>
                        {uni}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="+92 300 1234567" {...field} />
                </FormControl>
                <FormDescription>
                  We'll send you SMS updates about your waitlist status
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Joining Waitlist...
              </>
            ) : (
              "Join Waitlist"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default WaitlistForm;

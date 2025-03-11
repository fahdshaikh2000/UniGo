import React, { useState, useEffect, useRef } from "react";
import { Send, Paperclip, AlertCircle, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { Message, RideParticipant } from "@/lib/types";

interface RideChatProps {
  rideId?: string;
  onSendMessage?: (message: string) => void;
}

const RideChat = ({
  rideId = "ride-123",
  onSendMessage = () => {},
}: RideChatProps) => {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [participants, setParticipants] = useState<RideParticipant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Fetch messages and participants when component mounts
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        // Fetch messages for this ride
        const { data: messagesData, error: messagesError } = await supabase
          .from("messages")
          .select("*, sender:profiles(id, name, avatar)")
          .eq("ride_id", rideId)
          .order("created_at", { ascending: true });

        if (messagesError) throw messagesError;

        // Fetch participants for this ride
        const { data: participantsData, error: participantsError } =
          await supabase
            .from("ride_participants")
            .select("*, user:profiles(id, name, avatar, rating)")
            .eq("ride_id", rideId);

        if (participantsError) throw participantsError;

        // Process messages to add isCurrentUser flag
        const processedMessages = messagesData.map((msg: any) => ({
          ...msg,
          isCurrentUser: msg.sender_id === user?.id,
          sender: msg.sender,
          timestamp: new Date(msg.created_at),
        }));

        setMessages(processedMessages);
        setParticipants(participantsData);
      } catch (error) {
        console.error("Error fetching chat data:", error);
        toast({
          title: "Error loading chat",
          description: "Could not load chat messages. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();

    // Set up real-time subscription for new messages
    const subscription = supabase
      .channel(`ride-chat-${rideId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `ride_id=eq.${rideId}`,
        },
        async (payload) => {
          // Fetch the sender information for the new message
          const { data: senderData } = await supabase
            .from("profiles")
            .select("id, name, avatar")
            .eq("id", payload.new.sender_id)
            .single();

          const newMsg = {
            ...payload.new,
            sender: senderData,
            isCurrentUser: payload.new.sender_id === user?.id,
            timestamp: new Date(payload.new.created_at),
          };

          setMessages((prev) => [...prev, newMsg]);

          // Scroll to bottom when new message arrives
          setTimeout(() => {
            if (scrollAreaRef.current) {
              scrollAreaRef.current.scrollTop =
                scrollAreaRef.current.scrollHeight;
            }
          }, 100);
        },
      )
      .subscribe();

    // Clean up subscription on unmount
    return () => {
      supabase.channel(`ride-chat-${rideId}`).unsubscribe();
    };
  }, [rideId, user?.id, toast]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current && messages.length > 0) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user?.id) return;

    setIsSending(true);
    try {
      // Insert message into Supabase
      const { error } = await supabase.from("messages").insert({
        ride_id: rideId,
        sender_id: user.id,
        content: newMessage.trim(),
      });

      if (error) throw error;

      // Clear input field after successful send
      setNewMessage("");
      onSendMessage(newMessage);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Failed to send message",
        description: "Your message could not be sent. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <Card className="w-full h-full max-h-[500px] flex flex-col bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center">
          <span>Ride Chat</span>
          <div className="ml-auto flex items-center text-sm font-normal text-green-600">
            <span className="h-2 w-2 rounded-full bg-green-600 mr-1"></span>
            {participants.length} Active
          </div>
        </CardTitle>
      </CardHeader>

      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-gray-500">Loading messages...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <AlertCircle className="h-8 w-8 mb-2" />
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isCurrentUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex max-w-[80%] ${message.isCurrentUser ? "flex-row-reverse" : "flex-row"}`}
                >
                  {!message.isCurrentUser && message.sender && (
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage
                        src={message.sender.avatar}
                        alt={message.sender.name}
                      />
                      <AvatarFallback>
                        {message.sender.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div>
                    <div
                      className={`rounded-lg px-3 py-2 text-sm ${
                        message.isCurrentUser
                          ? "bg-primary text-primary-foreground ml-2"
                          : "bg-muted"
                      }`}
                    >
                      {message.content}
                    </div>
                    <div
                      className={`text-xs text-muted-foreground mt-1 ${message.isCurrentUser ? "text-right" : "text-left"}`}
                    >
                      {!message.isCurrentUser && message.sender && (
                        <span className="font-medium mr-1">
                          {message.sender.name}
                        </span>
                      )}
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      <CardFooter className="p-3 pt-2 border-t">
        <div className="flex items-center w-full gap-2">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            type="button"
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          <Textarea
            placeholder="Type a message..."
            className="min-h-[40px] flex-1"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={isSending}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isSending}
            className="rounded-full"
            size="icon"
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardFooter>

      <div className="p-2 text-xs text-center text-muted-foreground bg-muted/30 rounded-b-xl">
        <div className="flex items-center justify-center">
          <AlertCircle className="h-3 w-3 mr-1" />
          Messages are only visible to ride participants
        </div>
      </div>
    </Card>
  );
};

export default RideChat;

import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import { useConversations, useMessages, useSendMessage, useMarkMessagesRead, type Conversation } from "@/hooks/useMessages";
import { Send, Search, ArrowLeft, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import AnimatedPage from "@/components/AnimatedPage";
import { supabase } from "@/integrations/supabase/client";

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [showMobileList, setShowMobileList] = useState(true);
  const [myUserId, setMyUserId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setMyUserId(session.user.id);
    });
  }, []);

  const { data: conversations = [], isLoading: convsLoading } = useConversations();
  const { data: messages = [] } = useMessages(selectedChat);
  const sendMessage = useSendMessage();
  const markRead = useMarkMessagesRead();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (selectedChat) markRead.mutate(selectedChat);
  }, [selectedChat]); // eslint-disable-line react-hooks/exhaustive-deps

  const getOtherName = (conv: Conversation) => {
    if (!myUserId) return "...";
    if (conv.participant_1 === myUserId) return conv.p2_profile?.full_name || "User";
    return conv.p1_profile?.full_name || "User";
  };

  const getInitials = (name: string) => name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  const handleSend = () => {
    if (!newMessage.trim() || !selectedChat) return;
    sendMessage.mutate({ conversationId: selectedChat, content: newMessage });
    setNewMessage("");
  };

  const selectChat = (id: string) => {
    setSelectedChat(id);
    setShowMobileList(false);
  };

  const currentConv = conversations.find(c => c.id === selectedChat);

  return (
    <AnimatedPage>
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 flex overflow-hidden" style={{ height: "calc(100vh - 140px)" }}>
        {/* Conversation list */}
        <div className={`w-full md:w-80 lg:w-96 border-r border-border bg-card flex flex-col ${!showMobileList ? "hidden md:flex" : "flex"}`}>
          <div className="p-4 border-b border-border">
            <h2 className="font-display font-bold text-xl text-foreground mb-3">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search conversations..." className="pl-9 font-body" />
            </div>
          </div>
          <ScrollArea className="flex-1">
            {convsLoading && <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>}
            {!convsLoading && conversations.length === 0 && (
              <p className="text-muted-foreground font-body text-sm text-center py-8">No conversations yet.</p>
            )}
            {conversations.map((conv) => {
              const otherName = getOtherName(conv);
              return (
                <button
                  key={conv.id}
                  onClick={() => selectChat(conv.id)}
                  className={`w-full flex items-start gap-3 p-4 hover:bg-accent/50 transition text-left border-b border-border ${
                    selectedChat === conv.id ? "bg-accent" : ""
                  }`}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary font-display font-bold text-sm">
                      {getInitials(otherName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-display font-semibold text-sm text-foreground truncate">{otherName}</span>
                      <span className="text-xs text-muted-foreground font-body whitespace-nowrap ml-2">
                        {new Date(conv.last_message_at).toLocaleDateString("en-PK")}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </ScrollArea>
        </div>

        {/* Chat area */}
        <div className={`flex-1 flex flex-col ${showMobileList ? "hidden md:flex" : "flex"}`}>
          {selectedChat && currentConv ? (
            <>
              <div className="flex items-center gap-3 p-4 border-b border-border bg-card">
                <button className="md:hidden" onClick={() => setShowMobileList(true)}>
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-primary/10 text-primary font-display font-bold text-sm">
                    {getInitials(getOtherName(currentConv))}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-display font-semibold text-foreground text-sm">{getOtherName(currentConv)}</h3>
                </div>
              </div>

              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4 max-w-3xl mx-auto">
                  {messages.length === 0 && <p className="text-muted-foreground font-body text-sm text-center py-8">No messages yet. Start the conversation!</p>}
                  {messages.map((msg) => {
                    const isOwn = msg.sender_id === myUserId;
                    return (
                      <div key={msg.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                          isOwn
                            ? "bg-primary text-primary-foreground rounded-br-md"
                            : "bg-accent text-foreground rounded-bl-md"
                        }`}>
                          <p className="text-sm font-body">{msg.content}</p>
                          <p className={`text-[10px] mt-1 ${isOwn ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={bottomRef} />
                </div>
              </ScrollArea>

              <div className="p-4 border-t border-border bg-card">
                <div className="flex items-center gap-2 max-w-3xl mx-auto">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Type a message..."
                    className="font-body"
                  />
                  <Button onClick={handleSend} size="icon" className="bg-gradient-hero text-primary-foreground h-9 w-9 flex-shrink-0 hover:opacity-90" disabled={sendMessage.isPending}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground font-body">
              Select a conversation to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
    </AnimatedPage>
  );
};

export default Messages;

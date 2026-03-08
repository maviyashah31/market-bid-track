import { useState } from "react";
import Navbar from "@/components/Navbar";
import { chatConversations, chatMessages, ChatMessage } from "@/data/mockData";
import { Send, Search, MoreVertical, Phone, Video, Paperclip, Smile, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState<string | null>("1");
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState(chatMessages);
  const [showMobileList, setShowMobileList] = useState(true);

  const currentMessages = selectedChat ? messages[selectedChat] || [] : [];
  const currentContact = chatConversations.find((c) => c.id === selectedChat);

  const handleSend = () => {
    if (!newMessage.trim() || !selectedChat) return;
    const msg: ChatMessage = {
      id: `m${Date.now()}`,
      senderId: "buyer1",
      senderName: "You",
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isOwn: true,
    };
    setMessages((prev) => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), msg],
    }));
    setNewMessage("");
  };

  const selectChat = (id: string) => {
    setSelectedChat(id);
    setShowMobileList(false);
  };

  return (
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
            {chatConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => selectChat(conv.id)}
                className={`w-full flex items-start gap-3 p-4 hover:bg-accent/50 transition text-left border-b border-border ${
                  selectedChat === conv.id ? "bg-accent" : ""
                }`}
              >
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary font-display font-bold text-sm">
                      {conv.contactName.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  {conv.online && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-success border-2 border-card" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-display font-semibold text-sm text-foreground truncate">{conv.contactName}</span>
                    <span className="text-xs text-muted-foreground font-body whitespace-nowrap ml-2">{conv.lastTime}</span>
                  </div>
                  <p className="text-xs text-muted-foreground font-body truncate mt-0.5">{conv.lastMessage}</p>
                </div>
                {conv.unread > 0 && (
                  <Badge className="bg-primary text-primary-foreground text-xs h-5 w-5 flex items-center justify-center rounded-full p-0">
                    {conv.unread}
                  </Badge>
                )}
              </button>
            ))}
          </ScrollArea>
        </div>

        {/* Chat area */}
        <div className={`flex-1 flex flex-col ${showMobileList ? "hidden md:flex" : "flex"}`}>
          {selectedChat && currentContact ? (
            <>
              {/* Chat header */}
              <div className="flex items-center gap-3 p-4 border-b border-border bg-card">
                <button className="md:hidden" onClick={() => setShowMobileList(true)}>
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-primary/10 text-primary font-display font-bold text-sm">
                    {currentContact.contactName.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-display font-semibold text-foreground text-sm">{currentContact.contactName}</h3>
                  <p className="text-xs text-muted-foreground font-body">{currentContact.online ? "Online" : "Offline"}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8"><Phone className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8"><Video className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4 max-w-3xl mx-auto">
                  {currentMessages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                        msg.isOwn
                          ? "bg-primary text-primary-foreground rounded-br-md"
                          : "bg-accent text-foreground rounded-bl-md"
                      }`}>
                        <p className="text-sm font-body">{msg.content}</p>
                        <p className={`text-[10px] mt-1 ${msg.isOwn ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                          {msg.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="p-4 border-t border-border bg-card">
                <div className="flex items-center gap-2 max-w-3xl mx-auto">
                  <Button variant="ghost" size="icon" className="h-9 w-9 flex-shrink-0"><Paperclip className="h-4 w-4" /></Button>
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Type a message..."
                    className="font-body"
                  />
                  <Button variant="ghost" size="icon" className="h-9 w-9 flex-shrink-0"><Smile className="h-4 w-4" /></Button>
                  <Button onClick={handleSend} size="icon" className="bg-gradient-hero text-primary-foreground h-9 w-9 flex-shrink-0 hover:opacity-90">
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
  );
};

export default Messages;
import { useState, useRef, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { disputes, disputeMessages, disputeReasons, DisputeMessage } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Send,
  AlertTriangle,
  CheckCircle,
  Clock,
  ShieldAlert,
  User,
  Store,
  Shield,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import AnimatedPage from "@/components/AnimatedPage";

const statusConfig = {
  open: { label: "Open", color: "bg-warning/10 text-warning", icon: Clock },
  negotiating: { label: "Negotiating", color: "bg-primary/10 text-primary", icon: AlertTriangle },
  escalated: { label: "Escalated to Admin", color: "bg-destructive/10 text-destructive", icon: ShieldAlert },
  resolved: { label: "Resolved", color: "bg-success/10 text-success", icon: CheckCircle },
  closed: { label: "Closed", color: "bg-muted text-muted-foreground", icon: CheckCircle },
};

const roleIcons = {
  buyer: User,
  seller: Store,
  admin: Shield,
};

const DisputeDetail = () => {
  const { disputeId } = useParams<{ disputeId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const dispute = disputes.find((d) => d.id === disputeId);
  const initialMessages = disputeId ? disputeMessages[disputeId] || [] : [];
  const [messages, setMessages] = useState<DisputeMessage[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [status, setStatus] = useState(dispute?.status || "open");

  const reasonLabel = disputeReasons.find((r) => r.value === dispute?.reason)?.label;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!dispute) {
    return (
      <AnimatedPage>
        <div className="min-h-screen bg-background">
          <Navbar />
          <div className="container mx-auto px-4 py-16 text-center">
            <AlertTriangle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="font-display font-bold text-2xl text-foreground mb-2">
              Dispute Not Found
            </h1>
            <p className="text-muted-foreground font-body mb-6">
              The dispute you're looking for doesn't exist.
            </p>
            <Link to="/buyer/dashboard">
              <Button className="font-body">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </AnimatedPage>
    );
  }

  const StatusIcon = statusConfig[status].icon;

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const newMsg: DisputeMessage = {
      id: `dm-new-${Date.now()}`,
      disputeId: dispute.id,
      senderId: "buyer1",
      senderName: "Muhammad Ahmed",
      senderRole: "buyer",
      content: newMessage.trim(),
      timestamp: new Date().toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    };

    setMessages([...messages, newMsg]);
    setNewMessage("");

    // Simulate seller response after 2 seconds
    setTimeout(() => {
      const sellerResponse: DisputeMessage = {
        id: `dm-seller-${Date.now()}`,
        disputeId: dispute.id,
        senderId: "seller1",
        senderName: dispute.sellerName,
        senderRole: "seller",
        content: "Thank you for the additional information. We're reviewing your case and will get back to you shortly.",
        timestamp: new Date().toLocaleString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      };
      setMessages((prev) => [...prev, sellerResponse]);
    }, 2000);
  };

  const handleEscalate = () => {
    setStatus("escalated");
    toast({
      title: "Dispute Escalated",
      description: "An admin will review your case within 24-48 hours.",
    });

    // Add admin notification message
    const adminMsg: DisputeMessage = {
      id: `dm-admin-${Date.now()}`,
      disputeId: dispute.id,
      senderId: "admin1",
      senderName: "Bulkur Support",
      senderRole: "admin",
      content: "This dispute has been escalated to our support team. We will review all details and respond within 24-48 hours.",
      timestamp: new Date().toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    };
    setMessages((prev) => [...prev, adminMsg]);
  };

  const handleAcceptResolution = () => {
    setStatus("resolved");
    toast({
      title: "Dispute Resolved",
      description: "The dispute has been marked as resolved. Thank you!",
    });
  };

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/buyer/dashboard")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="font-display font-bold text-2xl text-foreground">
                  {dispute.id}
                </h1>
                <Badge className={statusConfig[status].color}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {statusConfig[status].label}
                </Badge>
              </div>
              <p className="text-muted-foreground font-body">
                {dispute.orderName} • {dispute.sellerName}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chat Section */}
            <div className="lg:col-span-2 bg-card rounded-xl border border-border flex flex-col h-[400px] sm:h-[500px] lg:h-[600px]">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => {
                  const RoleIcon = roleIcons[msg.senderRole];
                  const isOwn = msg.senderRole === "buyer";

                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-3 ${isOwn ? "flex-row-reverse" : ""}`}
                    >
                      <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          msg.senderRole === "admin"
                            ? "bg-destructive/10"
                            : msg.senderRole === "seller"
                            ? "bg-verified/10"
                            : "bg-primary/10"
                        }`}
                      >
                        <RoleIcon
                          className={`h-5 w-5 ${
                            msg.senderRole === "admin"
                              ? "text-destructive"
                              : msg.senderRole === "seller"
                              ? "text-verified"
                              : "text-primary"
                          }`}
                        />
                      </div>
                      <div
                        className={`max-w-[70%] ${isOwn ? "text-right" : ""}`}
                      >
                        <div
                          className={`flex items-center gap-2 mb-1 ${
                            isOwn ? "justify-end" : ""
                          }`}
                        >
                          <span className="font-display font-semibold text-sm text-foreground">
                            {msg.senderName}
                          </span>
                          <span className="text-xs text-muted-foreground font-body">
                            {msg.timestamp}
                          </span>
                        </div>
                        <div
                          className={`rounded-lg p-3 font-body text-sm ${
                            isOwn
                              ? "bg-primary text-primary-foreground"
                              : msg.senderRole === "admin"
                              ? "bg-destructive/10 text-foreground border border-destructive/20"
                              : "bg-muted text-foreground"
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              {status !== "resolved" && status !== "closed" && (
                <div className="border-t border-border p-4">
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      rows={2}
                      className="font-body resize-none"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button
                      onClick={handleSendMessage}
                      className="bg-gradient-hero text-primary-foreground hover:opacity-90 self-end"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Dispute Details Sidebar */}
            <div className="space-y-4">
              {/* Details Card */}
              <div className="bg-card rounded-xl border border-border p-4">
                <h3 className="font-display font-bold text-lg text-foreground mb-4">
                  Dispute Details
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-xs text-muted-foreground font-body">
                      Order ID
                    </span>
                    <p className="font-display font-semibold text-foreground">
                      {dispute.orderId}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground font-body">
                      Reason
                    </span>
                    <p className="font-display font-semibold text-foreground">
                      {reasonLabel}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground font-body">
                      Description
                    </span>
                    <p className="font-body text-sm text-muted-foreground">
                      {dispute.description}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground font-body">
                      Created
                    </span>
                    <p className="font-body text-sm text-foreground">
                      {dispute.createdAt}
                    </p>
                  </div>
                  {dispute.resolution && (
                    <div>
                      <span className="text-xs text-muted-foreground font-body">
                        Resolution
                      </span>
                      <p className="font-body text-sm text-success">
                        {dispute.resolution}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions Card */}
              {status !== "resolved" && status !== "closed" && (
                <div className="bg-card rounded-xl border border-border p-4 space-y-3">
                  <h3 className="font-display font-bold text-lg text-foreground">
                    Actions
                  </h3>

                  {status !== "escalated" && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full font-body gap-2 border-destructive text-destructive hover:bg-destructive/10"
                        >
                          <ShieldAlert className="h-4 w-4" />
                          Escalate to Admin
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle className="font-display">
                            Escalate Dispute?
                          </AlertDialogTitle>
                          <AlertDialogDescription className="font-body">
                            This will involve Bulkur support team to review your
                            dispute. Only escalate if you cannot reach an
                            agreement with the seller.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="font-body">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleEscalate}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-body"
                          >
                            Escalate
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}

                  <Button
                    onClick={handleAcceptResolution}
                    className="w-full bg-success text-success-foreground hover:bg-success/90 font-body gap-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Mark as Resolved
                  </Button>
                </div>
              )}

              {/* Resolution Notice */}
              {status === "resolved" && (
                <div className="bg-success/10 border border-success/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span className="font-display font-bold text-success">
                      Resolved
                    </span>
                  </div>
                  <p className="font-body text-sm text-muted-foreground">
                    This dispute has been resolved. Thank you for using Bulkur's
                    dispute resolution system.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default DisputeDetail;

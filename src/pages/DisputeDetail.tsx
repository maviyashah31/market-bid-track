import { useState, useRef, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useDispute, useUpdateDisputeStatus, useDisputeMessages, useSendDisputeMessage } from "@/hooks/useDisputes";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Send, AlertTriangle, CheckCircle, Clock, ShieldAlert, Loader2 } from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import AnimatedPage from "@/components/AnimatedPage";
import { supabase } from "@/integrations/supabase/client";

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  open: { label: "Open", color: "bg-warning/10 text-warning", icon: Clock },
  negotiating: { label: "Negotiating", color: "bg-primary/10 text-primary", icon: AlertTriangle },
  escalated: { label: "Escalated to Admin", color: "bg-destructive/10 text-destructive", icon: ShieldAlert },
  resolved: { label: "Resolved", color: "bg-success/10 text-success", icon: CheckCircle },
  closed: { label: "Closed", color: "bg-muted text-muted-foreground", icon: CheckCircle },
};

const DisputeDetail = () => {
  const { disputeId } = useParams<{ disputeId: string }>();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [newMessage, setNewMessage] = useState("");
  const [myUserId, setMyUserId] = useState<string | null>(null);

  const { data: dispute, isLoading } = useDispute(disputeId);
  const { data: messages = [] } = useDisputeMessages(disputeId);
  const sendMessage = useSendDisputeMessage();
  const updateStatus = useUpdateDisputeStatus();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setMyUserId(session.user.id);
    });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex justify-center py-32"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      </div>
    );
  }

  if (!dispute) {
    return (
      <AnimatedPage>
        <div className="min-h-screen bg-background">
          <Navbar />
          <div className="container mx-auto px-4 py-16 text-center">
            <AlertTriangle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="font-display font-bold text-2xl text-foreground mb-2">Dispute Not Found</h1>
            <Link to="/buyer/dashboard"><Button className="font-body">Back to Dashboard</Button></Link>
          </div>
        </div>
      </AnimatedPage>
    );
  }

  const status = dispute.status;
  const cfg = statusConfig[status] || statusConfig.open;
  const StatusIcon = cfg.icon;

  const handleSendMessage = () => {
    if (!newMessage.trim() || !disputeId) return;
    sendMessage.mutate({ disputeId, content: newMessage.trim() });
    setNewMessage("");
  };

  const handleEscalate = () => {
    updateStatus.mutate({ disputeId: dispute.id, status: "escalated" });
    toast.success("Dispute Escalated", { description: "An admin will review your case within 24-48 hours." });
  };

  const handleResolve = () => {
    updateStatus.mutate({ disputeId: dispute.id, status: "resolved", resolution: "Resolved by agreement" });
    toast.success("Dispute Resolved");
  };

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-3 sm:gap-4 mb-6">
            <Button variant="ghost" size="icon" className="shrink-0" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <h1 className="font-display font-bold text-lg sm:text-2xl text-foreground">{dispute.dispute_number}</h1>
                <Badge className={cfg.color}><StatusIcon className="h-3 w-3 mr-1" />{cfg.label}</Badge>
              </div>
              <p className="text-muted-foreground font-body">
                Order {dispute.order?.order_number || dispute.order_id} • {dispute.seller?.full_name || dispute.buyer?.full_name || ""}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-card rounded-xl border border-border flex flex-col h-[400px] sm:h-[500px] lg:h-[600px]">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && <p className="text-muted-foreground font-body text-sm text-center py-8">No messages yet. Start the conversation.</p>}
                {messages.map((msg) => {
                  const isOwn = msg.sender_id === myUserId;
                  return (
                    <div key={msg.id} className={`flex gap-3 ${isOwn ? "flex-row-reverse" : ""}`}>
                      <div className={`max-w-[70%] ${isOwn ? "text-right" : ""}`}>
                        <div className={`flex items-center gap-2 mb-1 ${isOwn ? "justify-end" : ""}`}>
                          <span className="font-display font-semibold text-sm text-foreground">{msg.sender?.full_name || "User"}</span>
                          <span className="text-xs text-muted-foreground font-body">
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        <div className={`rounded-lg p-3 font-body text-sm ${isOwn ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                          {msg.content}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {status !== "resolved" && status !== "closed" && (
                <div className="border-t border-border p-4">
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      rows={2}
                      className="font-body resize-none"
                      onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                    />
                    <Button onClick={handleSendMessage} className="bg-gradient-hero text-primary-foreground hover:opacity-90 self-end" disabled={sendMessage.isPending}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="bg-card rounded-xl border border-border p-4">
                <h3 className="font-display font-bold text-lg text-foreground mb-4">Dispute Details</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-xs text-muted-foreground font-body">Order</span>
                    <p className="font-display font-semibold text-foreground">{dispute.order?.order_number || dispute.order_id}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground font-body">Reason</span>
                    <p className="font-display font-semibold text-foreground">{dispute.reason}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground font-body">Description</span>
                    <p className="font-body text-sm text-muted-foreground">{dispute.description}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground font-body">Created</span>
                    <p className="font-body text-sm text-foreground">{new Date(dispute.created_at).toLocaleDateString("en-PK")}</p>
                  </div>
                  {dispute.resolution && (
                    <div>
                      <span className="text-xs text-muted-foreground font-body">Resolution</span>
                      <p className="font-body text-sm text-success">{dispute.resolution}</p>
                    </div>
                  )}
                </div>
              </div>

              {status !== "resolved" && status !== "closed" && (
                <div className="bg-card rounded-xl border border-border p-4 space-y-3">
                  <h3 className="font-display font-bold text-lg text-foreground">Actions</h3>
                  {status !== "escalated" && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" className="w-full font-body gap-2 border-destructive text-destructive hover:bg-destructive/10">
                          <ShieldAlert className="h-4 w-4" /> Escalate to Admin
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle className="font-display">Escalate Dispute?</AlertDialogTitle>
                          <AlertDialogDescription className="font-body">This will involve Bulkur support team.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="font-body">Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleEscalate} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-body">Escalate</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                  <Button onClick={handleResolve} className="w-full bg-success text-success-foreground hover:bg-success/90 font-body gap-2">
                    <CheckCircle className="h-4 w-4" /> Mark as Resolved
                  </Button>
                </div>
              )}

              {status === "resolved" && (
                <div className="bg-success/10 border border-success/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span className="font-display font-bold text-success">Resolved</span>
                  </div>
                  <p className="font-body text-sm text-muted-foreground">This dispute has been resolved.</p>
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

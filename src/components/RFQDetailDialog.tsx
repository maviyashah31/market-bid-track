import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { type RFQ, useAcceptBid } from "@/hooks/useRFQs";
import {
  MapPin, Calendar, Clock, Users, DollarSign,
  FileText, CheckCircle2, Truck
} from "lucide-react";
import { toast } from "sonner";

interface RFQDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rfq: RFQ | null;
  onSubmitBid?: () => void;
  mode?: "buyer" | "seller";
}

const statusColors: Record<string, string> = {
  open: "bg-success/10 text-success border-success/20",
  active: "bg-success/10 text-success border-success/20",
  closed: "bg-muted text-muted-foreground border-border",
  awarded: "bg-primary/10 text-primary border-primary/20",
  expired: "bg-destructive/10 text-destructive border-destructive/20",
};

const RFQDetailDialog = ({ open, onOpenChange, rfq, onSubmitBid, mode = "seller" }: RFQDetailDialogProps) => {
  const acceptBid = useAcceptBid();

  if (!rfq) return null;

  const budgetMin = rfq.budget_min || 0;
  const budgetMax = rfq.budget_max || 0;
  const budgetStr = budgetMin || budgetMax
    ? `PKR ${(budgetMin / 1000000).toFixed(1)}M - ${(budgetMax / 1000000).toFixed(1)}M`
    : "Not specified";

  const bids = rfq.rfq_responses || [];
  const status = rfq.status || "open";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header with images */}
        {rfq.image_urls && rfq.image_urls.length > 0 && (
          <div className="grid grid-cols-2 gap-1 max-h-56 overflow-hidden">
            {rfq.image_urls.slice(0, 4).map((url, idx) => (
              <div key={idx} className={`relative ${rfq.image_urls.length === 1 ? "col-span-2" : ""}`}>
                <img src={url} alt="RFQ" className="w-full h-56 object-cover" />
              </div>
            ))}
          </div>
        )}

        <div className="p-6 space-y-6">
          <DialogHeader className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="font-body">{rfq.category?.name || "General"}</Badge>
                  <Badge className={`font-body border ${statusColors[status] || statusColors.open}`}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Badge>
                </div>
                <DialogTitle className="font-display font-bold text-xl leading-tight">{rfq.title}</DialogTitle>
              </div>
              {mode === "seller" && (status === "active" || status === "open") && (
                <Button onClick={onSubmitBid} className="bg-gradient-hero text-primary-foreground hover:opacity-90 font-display font-semibold shrink-0">
                  Submit Bid
                </Button>
              )}
            </div>
          </DialogHeader>

          {/* Key metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-accent/50 rounded-lg p-3 text-center">
              <DollarSign className="h-4 w-4 text-primary mx-auto mb-1" />
              <p className="text-xs text-muted-foreground font-body">Budget</p>
              <p className="font-display font-bold text-sm text-foreground">{budgetStr}</p>
            </div>
            <div className="bg-accent/50 rounded-lg p-3 text-center">
              <FileText className="h-4 w-4 text-primary mx-auto mb-1" />
              <p className="text-xs text-muted-foreground font-body">Quantity</p>
              <p className="font-display font-bold text-sm text-foreground">{rfq.quantity.toLocaleString()} {rfq.unit}</p>
            </div>
            <div className="bg-accent/50 rounded-lg p-3 text-center">
              <Clock className="h-4 w-4 text-primary mx-auto mb-1" />
              <p className="text-xs text-muted-foreground font-body">Deadline</p>
              <p className="font-display font-bold text-sm text-foreground">{rfq.deadline ? new Date(rfq.deadline).toLocaleDateString("en-PK") : "Open"}</p>
            </div>
            <div className="bg-accent/50 rounded-lg p-3 text-center">
              <Users className="h-4 w-4 text-primary mx-auto mb-1" />
              <p className="text-xs text-muted-foreground font-body">Bids</p>
              <p className="font-display font-bold text-sm text-foreground">{bids.length}</p>
            </div>
          </div>

          {/* Buyer info */}
          <div className="flex items-center gap-3 p-3 bg-accent/30 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="font-display font-bold text-primary">{(rfq.buyer?.full_name || "B").charAt(0)}</span>
            </div>
            <div>
              <p className="font-display font-semibold text-foreground text-sm">{rfq.buyer?.full_name || "Buyer"}</p>
              <p className="text-xs text-muted-foreground font-body flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Posted {new Date(rfq.created_at).toLocaleDateString("en-PK")}
              </p>
            </div>
          </div>

          <Separator />

          {/* Description */}
          {rfq.description && (
            <div>
              <h3 className="font-display font-semibold text-foreground mb-2">Description & Requirements</h3>
              <p className="text-sm text-muted-foreground font-body leading-relaxed">{rfq.description}</p>
            </div>
          )}

          {/* Bids section (buyer mode) */}
          {mode === "buyer" && bids.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="font-display font-semibold text-foreground mb-3">Bids Received ({bids.length})</h3>
                <div className="space-y-3">
                  {bids.map((bid) => (
                    <div key={bid.id} className="border border-border rounded-lg p-4 hover:shadow-md transition">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="font-display font-bold text-primary text-sm">{(bid.seller?.full_name || "S").charAt(0)}</span>
                          </div>
                          <div>
                            <span className="font-display font-semibold text-foreground text-sm">{bid.seller?.full_name || "Seller"}</span>
                            <p className="text-xs text-muted-foreground font-body">
                              Submitted {new Date(bid.created_at).toLocaleDateString("en-PK")}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-display font-bold text-primary">PKR {bid.price_per_unit.toLocaleString()}/{rfq.unit}</p>
                          <p className="text-xs text-muted-foreground font-body">Total: PKR {bid.total_price.toLocaleString()}</p>
                        </div>
                      </div>
                      {bid.notes && <p className="text-sm text-muted-foreground font-body mt-2">{bid.notes}</p>}
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-border">
                        <span className="text-xs text-muted-foreground font-body flex items-center gap-1">
                          <Truck className="h-3 w-3" /> {bid.delivery_days} days delivery
                        </span>
                        {bid.status === "pending" && status !== "awarded" && (
                          <Button size="sm" onClick={() => {
                            acceptBid.mutate({ responseId: bid.id, rfqId: rfq.id }, {
                              onSuccess: () => { toast.success("Bid accepted!"); onOpenChange(false); },
                            });
                          }} className="bg-gradient-hero text-primary-foreground hover:opacity-90 font-body text-xs">
                            Accept Bid
                          </Button>
                        )}
                        {bid.status === "accepted" && (
                          <Badge className="bg-success/10 text-success border-success/20">
                            <CheckCircle2 className="h-3 w-3 mr-1" /> Accepted
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RFQDetailDialog;

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { type RFQDetail, rfqBids } from "@/data/rfqData";
import {
  MapPin, Calendar, Clock, Users, DollarSign, Truck, CreditCard,
  Award, CheckCircle2, Image as ImageIcon, FileText, ChevronRight
} from "lucide-react";

interface RFQDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rfq: RFQDetail | null;
  onSubmitBid?: () => void;
  mode?: "buyer" | "seller";
}

const statusColors: Record<string, string> = {
  active: "bg-success/10 text-success border-success/20",
  closed: "bg-muted text-muted-foreground border-border",
  awarded: "bg-primary/10 text-primary border-primary/20",
  expired: "bg-destructive/10 text-destructive border-destructive/20",
};

const RFQDetailDialog = ({ open, onOpenChange, rfq, onSubmitBid, mode = "seller" }: RFQDetailDialogProps) => {
  if (!rfq) return null;

  const bids = rfqBids[rfq.id] || [];
  const budgetStr = `PKR ${(rfq.budgetMin / 1000000).toFixed(1)}M - ${(rfq.budgetMax / 1000000).toFixed(1)}M`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header with images */}
        {rfq.images.length > 0 && (
          <div className="grid grid-cols-2 gap-1 max-h-56 overflow-hidden">
            {rfq.images.slice(0, 4).map((img, idx) => (
              <div key={idx} className={`relative ${rfq.images.length === 1 ? "col-span-2" : ""}`}>
                <img src={img.url} alt={img.caption || "RFQ"} className="w-full h-56 object-cover" />
                {img.caption && (
                  <span className="absolute bottom-2 left-2 bg-background/80 backdrop-blur-sm text-foreground text-xs font-body px-2 py-1 rounded">{img.caption}</span>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="p-6 space-y-6">
          <DialogHeader className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="font-body">{rfq.category}</Badge>
                  <Badge className={`font-body border ${statusColors[rfq.status]}`}>
                    {rfq.status.charAt(0).toUpperCase() + rfq.status.slice(1)}
                  </Badge>
                </div>
                <DialogTitle className="font-display font-bold text-xl leading-tight">{rfq.title}</DialogTitle>
              </div>
              {mode === "seller" && rfq.status === "active" && (
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
              <p className="font-display font-bold text-sm text-foreground">{rfq.deadline}</p>
            </div>
            <div className="bg-accent/50 rounded-lg p-3 text-center">
              <Users className="h-4 w-4 text-primary mx-auto mb-1" />
              <p className="text-xs text-muted-foreground font-body">Bids</p>
              <p className="font-display font-bold text-sm text-foreground">{rfq.bidsCount}</p>
            </div>
          </div>

          {/* Buyer info */}
          <div className="flex items-center gap-3 p-3 bg-accent/30 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="font-display font-bold text-primary">{rfq.buyer.charAt(0)}</span>
            </div>
            <div>
              <p className="font-display font-semibold text-foreground text-sm">{rfq.buyer}</p>
              <p className="text-xs text-muted-foreground font-body flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {rfq.buyerLocation}
              </p>
            </div>
            <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground font-body">
              <Calendar className="h-3 w-3" /> Posted {rfq.createdAt}
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h3 className="font-display font-semibold text-foreground mb-2">Description & Requirements</h3>
            <p className="text-sm text-muted-foreground font-body leading-relaxed">{rfq.description}</p>
          </div>

          {/* Specifications */}
          {rfq.specifications.length > 0 && (
            <div>
              <h3 className="font-display font-semibold text-foreground mb-2">Specifications</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {rfq.specifications.map((spec, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm font-body text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
                    <span>{spec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Terms */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-start gap-2">
              <Truck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground font-body">Shipping Terms</p>
                <p className="text-sm font-body font-medium text-foreground">{rfq.shippingTerms}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CreditCard className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground font-body">Payment Terms</p>
                <p className="text-sm font-body font-medium text-foreground">{rfq.paymentTerms}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Award className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground font-body">Certifications</p>
                <div className="flex flex-wrap gap-1 mt-0.5">
                  {rfq.certifications.map((cert, idx) => (
                    <Badge key={idx} variant="outline" className="text-[10px] font-body">{cert}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

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
                            <span className="font-display font-bold text-primary text-sm">{bid.sellerName.charAt(0)}</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-display font-semibold text-foreground text-sm">{bid.sellerName}</span>
                              {bid.sellerVerified && <CheckCircle2 className="h-3.5 w-3.5 text-success" />}
                            </div>
                            <p className="text-xs text-muted-foreground font-body flex items-center gap-1">
                              <MapPin className="h-3 w-3" /> {bid.sellerLocation} • ⭐ {bid.sellerRating}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-display font-bold text-primary">PKR {bid.pricePerUnit}/{rfq.unit}</p>
                          <p className="text-xs text-muted-foreground font-body">Total: PKR {bid.totalPrice.toLocaleString()}</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground font-body mt-2">{bid.notes}</p>
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-border">
                        <span className="text-xs text-muted-foreground font-body flex items-center gap-1">
                          <Truck className="h-3 w-3" /> {bid.deliveryDays} days delivery
                        </span>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="font-body text-xs">Message</Button>
                          <Button size="sm" className="bg-gradient-hero text-primary-foreground hover:opacity-90 font-body text-xs">Accept Bid</Button>
                        </div>
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

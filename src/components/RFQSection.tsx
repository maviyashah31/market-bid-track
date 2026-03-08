import { rfqDetails } from "@/data/rfqData";
import { Clock, Users, ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const RFQSection = () => (
  <section className="py-12 bg-accent">
    <div className="container mx-auto px-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-foreground mb-1">Latest RFQs</h2>
          <p className="text-muted-foreground font-body text-sm sm:text-base">Active buying requests from verified buyers</p>
        </div>
        <Link to="/buyer/dashboard">
          <Button className="gap-2 font-body bg-gradient-hero text-primary-foreground hover:opacity-90 w-full sm:w-auto">
            Post an RFQ <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {rfqDetails.slice(0, 3).map((rfq) => (
          <div key={rfq.id} className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-md transition-shadow">
            {rfq.images.length > 0 && (
              <img src={rfq.images[0].url} alt={rfq.title} className="w-full h-36 object-cover" />
            )}
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary" className="font-body">{rfq.category}</Badge>
                <Badge className="bg-success/10 text-success border border-success/20 font-body text-xs">Active</Badge>
              </div>
              <h3 className="font-display font-semibold text-foreground mb-3">{rfq.title}</h3>
              <div className="space-y-2 text-sm font-body text-muted-foreground">
                <div className="flex justify-between">
                  <span>Quantity:</span>
                  <span className="font-medium text-foreground">{rfq.quantity.toLocaleString()} {rfq.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span>Budget:</span>
                  <span className="font-medium text-foreground">PKR {(rfq.budgetMin / 1000000).toFixed(1)}M - {(rfq.budgetMax / 1000000).toFixed(1)}M</span>
                </div>
                <div className="flex justify-between">
                  <span>Location:</span>
                  <span className="font-medium text-foreground flex items-center gap-1"><MapPin className="h-3 w-3" /> {rfq.buyerLocation}</span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {rfq.deadline} left
                </div>
                <div className="flex items-center gap-1 text-xs text-primary font-semibold">
                  <Users className="h-3 w-3" />
                  {rfq.bidsCount} bids
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default RFQSection;

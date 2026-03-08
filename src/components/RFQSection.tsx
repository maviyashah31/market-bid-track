import { rfqs } from "@/data/mockData";
import { Clock, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const RFQSection = () => (
  <section className="py-12 bg-accent">
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-display font-bold text-3xl text-foreground mb-1">Latest RFQs</h2>
          <p className="text-muted-foreground font-body">Active buying requests from verified buyers</p>
        </div>
        <Link to="/rfq">
          <Button className="gap-2 font-body bg-gradient-hero text-primary-foreground hover:opacity-90">
            Post an RFQ <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {rfqs.map((rfq) => (
          <div key={rfq.id} className="bg-card rounded-xl border border-border p-6 hover:shadow-md transition-shadow">
            <Badge variant="secondary" className="mb-3 font-body">{rfq.category}</Badge>
            <h3 className="font-display font-semibold text-foreground mb-3">{rfq.title}</h3>
            <div className="space-y-2 text-sm font-body text-muted-foreground">
              <div className="flex justify-between">
                <span>Quantity:</span>
                <span className="font-medium text-foreground">{rfq.quantity.toLocaleString()} {rfq.unit}</span>
              </div>
              <div className="flex justify-between">
                <span>Budget:</span>
                <span className="font-medium text-foreground">{rfq.budget}</span>
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
        ))}
      </div>
    </div>
  </section>
);

export default RFQSection;

import { BadgeCheck, Star, MapPin } from "lucide-react";
import { Product } from "@/data/mockData";
import { Link } from "react-router-dom";

const ProductCard = ({ product }: { product: Product }) => (
  <Link
    to={`/product/${product.id}`}
    className="group bg-card rounded-lg border border-border overflow-hidden hover:shadow-md hover:border-primary/30 transition-all"
  >
    <div className="aspect-square overflow-hidden bg-muted">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
    </div>
    <div className="p-2.5">
      <h3 className="font-display font-semibold text-xs text-foreground line-clamp-2 mb-1 group-hover:text-primary transition-colors leading-tight">
        {product.name}
      </h3>
      <div className="font-display font-bold text-sm text-primary mb-0.5">
        PKR {product.minPrice}
        <span className="text-[10px] font-normal text-muted-foreground">/{product.unit}</span>
      </div>
      <div className="text-[10px] text-muted-foreground font-body">
        MOQ: {product.moq} {product.unit}
      </div>
      <div className="border-t border-border pt-1.5 mt-1.5 flex items-center justify-between">
        <div className="flex items-center gap-1">
          {product.sellerVerified && <BadgeCheck className="h-3 w-3 text-verified" />}
          <span className="text-[10px] font-medium text-muted-foreground truncate max-w-[80px]">{product.sellerName}</span>
        </div>
        <div className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
          <Star className="h-2.5 w-2.5 fill-warning text-warning" />
          {product.sellerRating}
        </div>
      </div>
    </div>
  </Link>
);

export default ProductCard;

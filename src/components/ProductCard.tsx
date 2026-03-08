import { BadgeCheck, Star, MapPin } from "lucide-react";
import { Product } from "@/data/mockData";
import { Link } from "react-router-dom";

const ProductCard = ({ product }: { product: Product }) => (
  <Link
    to={`/product/${product.id}`}
    className="group bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all"
  >
    <div className="aspect-[4/3] overflow-hidden bg-muted">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
    </div>
    <div className="p-4">
      <h3 className="font-display font-semibold text-sm text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
        {product.name}
      </h3>
      <div className="font-display font-bold text-lg text-primary mb-1">
        PKR {product.minPrice} - {product.maxPrice}
        <span className="text-xs font-normal text-muted-foreground">/{product.unit}</span>
      </div>
      <div className="text-xs text-muted-foreground mb-3 font-body">
        MOQ: {product.moq} {product.unit}
      </div>
      <div className="border-t border-border pt-3 flex items-center justify-between">
        <Link
          to={`/seller/${product.sellerName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1.5 hover:text-primary transition-colors"
        >
          {product.sellerVerified && <BadgeCheck className="h-4 w-4 text-verified" />}
          <span className="text-xs font-medium text-foreground truncate max-w-[120px] hover:text-primary hover:underline underline-offset-2">{product.sellerName}</span>
        </Link>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="h-3 w-3 fill-warning text-warning" />
          {product.sellerRating}
        </div>
      </div>
      <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
        <MapPin className="h-3 w-3" />
        {product.sellerLocation}
      </div>
    </div>
  </Link>
);

export default ProductCard;

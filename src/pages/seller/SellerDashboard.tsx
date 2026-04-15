import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import OnboardingBanner from "@/components/OnboardingBanner";
import { useSupplierOnboarding } from "@/hooks/useSupplierOnboarding";
import { useConversations, useMessages, useSendMessage } from "@/hooks/useMessages";
import type { ProductCardData as Product } from "@/types/database";
import { useSellerProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from "@/hooks/useProducts";
import { useSellerOrders, useUpdateOrderStatus, type Order } from "@/hooks/useOrders";
import { useSellerWallet, useWalletTransactions } from "@/hooks/useSellerWallet";
import { useSellerReviews } from "@/hooks/useReviews";
import { useSellerDisputes as useSellerDisputesHook, useSendDisputeMessage, type Dispute as DisputeType } from "@/hooks/useDisputes";
import { useRFQs, type RFQ } from "@/hooks/useRFQs";
import {
  Package, DollarSign, TrendingUp, ShoppingCart, FileText, MessageSquare,
  Star, Wallet, BarChart3, ArrowUpRight, ArrowDownRight, Plus, Eye, Edit, Trash2,
  AlertTriangle, Send, Search, Filter, Clock, Users, MapPin, SlidersHorizontal,
  Menu, ChevronLeft, Truck, CheckCircle, Phone, Mail, User, Camera, ImagePlus, Store, Save, Video, MoreVertical, Paperclip, Smile, ArrowLeft
} from "lucide-react";
import ProductFormDialog from "@/components/ProductFormDialog";
import InlineProductForm from "@/components/InlineProductForm";
import SubmitBidForm from "@/components/SubmitBidForm";
import RFQDetailDialog from "@/components/RFQDetailDialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AnimatedPage from "@/components/AnimatedPage";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

const stats = [
  { icon: DollarSign, label: "Revenue", value: "PKR 2.45M", change: "+12.5%", up: true },
  { icon: ShoppingCart, label: "Orders", value: "156", change: "+8.2%", up: true },
  { icon: Package, label: "Products", value: "45", change: "+3", up: true },
  { icon: Star, label: "Rating", value: "4.8/5", change: "+0.2", up: true },
];


import { orderStatusColors as statusColors } from "@/lib/constants";


const sidebarItems = [
  { icon: BarChart3, label: "Overview", value: "overview" },
  { icon: Store, label: "My Profile", value: "profile" },
  { icon: Package, label: "Products", value: "products" },
  { icon: ShoppingCart, label: "Orders", value: "orders" },
  { icon: FileText, label: "RFQs", value: "rfqs" },
  { icon: MessageSquare, label: "Messages", value: "messages" },
  { icon: AlertTriangle, label: "Disputes", value: "disputes" },
  { icon: Star, label: "Reviews", value: "reviews" },
  { icon: Wallet, label: "Wallet", value: "wallet" },
];

const SellerDashboard = () => {
  const navigate = useNavigate();
  const { data: onboardingData, completedSteps, totalSteps, isComplete: onboardingComplete } = useSupplierOnboarding();
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isMobile = useIsMobile();
  const [selectedDispute, setSelectedDispute] = useState<DisputeType | null>(null);
  const [responseText, setResponseText] = useState("");
  const [respondDialogOpen, setRespondDialogOpen] = useState(false);
  
  const { data: realSellerProducts = [] } = useSellerProducts();
  const { data: sellerOrders = [] } = useSellerOrders();
  const updateOrderStatus = useUpdateOrderStatus();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  type SellerProductItem = Product & { category_id?: string | null; status?: string; rejection_reason?: string | null; description?: string | null; sku?: string | null; specifications?: Record<string, unknown> };
  const myProductsMapped: SellerProductItem[] = realSellerProducts.map((p) => ({
    id: p.id,
    name: p.name,
    image: p.images?.[0] || "/placeholder.svg",
    category: p.categories?.name || "Uncategorized",
    category_id: p.category_id || null,
    minPrice: p.min_price,
    maxPrice: p.max_price || p.min_price,
    moq: p.moq,
    unit: p.unit,
    sellerName: p.profiles?.full_name || "You",
    sellerVerified: true,
    sellerRating: 0,
    sellerLocation: "",
    responseTime: "< 24h",
    ordersCompleted: 0,
    status: (p as any).status || "pending_review",
    rejection_reason: (p as any).rejection_reason || null,
    description: p.description || null,
    sku: (p as any).sku || null,
    specifications: (p as any).specifications || {},
  }));
  const [myProducts, setMyProducts] = useState<SellerProductItem[]>([]);

  useEffect(() => {
    setMyProducts(myProductsMapped);
  }, [myProductsMapped]);
  const [productFormOpen, setProductFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<SellerProductItem | null>(null);
  const [productFormView, setProductFormView] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Profile state
  const [profileData, setProfileData] = useState({
    businessName: "Lahore Textile Mills",
    tagline: "Premium quality textiles since 1998",
    about: "We are one of Pakistan's leading textile manufacturers based in Lahore, specializing in cotton, silk, and blended fabrics. With over 25 years of experience, we serve both domestic and international markets with consistent quality and competitive pricing.\n\nOur factory spans 50,000 sq ft with modern machinery capable of producing 100,000 meters of fabric monthly. We are ISO 9001 certified and committed to sustainable manufacturing practices.",
    city: "Lahore",
    province: "Punjab",
    phone: "+92 42 35761234",
    email: "info@lahoretextile.pk",
    website: "www.lahoretextile.pk",
    established: "1998",
    employees: "200-500",
    categories: ["Cotton Fabric", "Silk", "Blended Textiles", "Ready-made Garments"],
  });
  const [coverPhoto, setCoverPhoto] = useState<string | null>(null);
  const [logoPhoto, setLogoPhoto] = useState<string | null>(null);
  const [profileEditing, setProfileEditing] = useState(false);
  const [profileDraft, setProfileDraft] = useState(profileData);

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCoverPhoto(url);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLogoPhoto(url);
    }
  };

  const handleProfileSave = () => {
    setProfileData(profileDraft);
    setProfileEditing(false);
  };

  // Chat state (real hooks)
  const { data: conversations = [] } = useConversations();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [showMobileChatList, setShowMobileChatList] = useState(true);
  const { data: currentMessages = [] } = useMessages(selectedChat || undefined);
  const sendMessage = useSendMessage();
  const currentContact = conversations.find((c: any) => c.id === selectedChat);
  const handleChatSend = () => {
    if (!newMessage.trim() || !selectedChat) return;
    sendMessage.mutate({ conversationId: selectedChat, content: newMessage });
    setNewMessage("");
  };

  const [bidFormOpen, setBidFormOpen] = useState(false);
  const [selectedRFQ, setSelectedRFQ] = useState<RFQ | null>(null);
  const [rfqDetailOpen, setRfqDetailOpen] = useState(false);
  const [detailRFQ, setDetailRFQ] = useState<RFQ | null>(null);
  const [rfqSearch, setRfqSearch] = useState("");
  const [rfqCategoryFilter, setRfqCategoryFilter] = useState("all");
  const [rfqSortBy, setRfqSortBy] = useState("newest");
  const { data: allRFQs = [] } = useRFQs({ status: "open" });

  const filteredRFQs = useMemo(() => {
    let result = [...allRFQs];
    if (rfqSearch) {
      const q = rfqSearch.toLowerCase();
      result = result.filter(r => r.title.toLowerCase().includes(q) || (r.description || "").toLowerCase().includes(q) || (r.buyer?.full_name || "").toLowerCase().includes(q));
    }
    if (rfqCategoryFilter !== "all") {
      result = result.filter(r => r.category?.name === rfqCategoryFilter);
    }
    if (rfqSortBy === "newest") result.sort((a, b) => b.created_at.localeCompare(a.created_at));
    else if (rfqSortBy === "deadline") result.sort((a, b) => (a.deadline || "").localeCompare(b.deadline || ""));
    else if (rfqSortBy === "budget_high") result.sort((a, b) => (b.budget_max || 0) - (a.budget_max || 0));
    else if (rfqSortBy === "bids_low") result.sort((a, b) => (a.rfq_responses?.length || 0) - (b.rfq_responses?.length || 0));
    return result;
  }, [allRFQs, rfqSearch, rfqCategoryFilter, rfqSortBy]);

  const rfqCategories = useMemo(() => [...new Set(allRFQs.map(r => r.category?.name).filter(Boolean))], [allRFQs]);

  const handleSaveProduct = (data: any) => {
    const payload: any = {
      name: data.name || editingProduct?.name || "Untitled product",
      description: data.description ?? null,
      category_id: data.category_id ?? editingProduct?.category_id ?? null,
      min_price: data.minPrice ?? editingProduct?.minPrice ?? 0,
      max_price: data.maxPrice ?? editingProduct?.maxPrice ?? data.minPrice ?? 0,
      moq: data.moq ?? editingProduct?.moq ?? 1,
      unit: data.unit ?? editingProduct?.unit ?? "pieces",
      images: data.image ? [data.image] : editingProduct?.image ? [editingProduct.image] : [],
      status: editingProduct?.status === "rejected" ? "pending_review" : (editingProduct ? editingProduct.status : "pending_review"),
      sku: data.sku ?? null,
      specifications: data.specifications ?? {},
    };

    if (editingProduct) {
      updateProduct.mutate({ id: editingProduct.id, ...payload }, {
        onSuccess: () => {
          toast.success("Product updated successfully.");
          setEditingProduct(null);
          setProductFormView(false);
        },
      });
    } else {
      createProduct.mutate(payload, {
        onSuccess: () => {
          toast.success("Product added successfully.");
          setProductFormView(false);
        },
      });
    }
  };

  const handleDeleteProduct = (id: string) => {
    deleteProduct.mutate(id, {
      onSuccess: () => {
        toast.success("Product deleted successfully.");
        setMyProducts((prev) => prev.filter((p) => p.id !== id));
      },
    });
  };

  const { data: sellerDisputesData = [] } = useSellerDisputesHook();
  const sendDisputeMsg = useSendDisputeMessage();
  const { data: walletData } = useSellerWallet();
  const { data: walletTxData = [] } = useWalletTransactions();
  const { data: sellerReviewsData = [] } = useSellerReviews();

  const sellerDisputes = sellerDisputesData;
  const activeDisputeCount = sellerDisputes.filter(d => d.status !== "resolved" && d.status !== "closed").length;

  const disputeStatusColors: Record<string, string> = {
    open: "bg-destructive/10 text-destructive",
    negotiating: "bg-warning/10 text-warning",
    escalated: "bg-destructive/10 text-destructive",
    resolved: "bg-success/10 text-success",
    closed: "bg-muted text-muted-foreground",
  };

  const handleRespond = () => {
    if (!responseText.trim() || !selectedDispute) return;
    sendDisputeMsg.mutate({ disputeId: (selectedDispute as DisputeType).id, content: responseText });
    setResponseText("");
    setRespondDialogOpen(false);
    setSelectedDispute(null);
  };

  const collapsed = isMobile ? !sidebarOpen : !sidebarOpen;

  const handleNavClick = (value: string) => {
    setActiveTab(value);
    if (isMobile) setSidebarOpen(false);
  };

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex">
          {/* Sidebar */}
          {(isMobile ? sidebarOpen : true) && (
            <>
              {isMobile && sidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-[60]" onClick={() => setSidebarOpen(false)} />
              )}
              <aside className={cn(
                "bg-card border-r border-border flex flex-col shrink-0 transition-all duration-300 overflow-y-auto",
                isMobile ? "fixed left-0 top-0 h-full w-64 z-[70]" : "sticky top-0 h-screen z-40 pt-0",
                !isMobile && collapsed ? "w-16" : "w-64"
              )}>
                {/* Seller info */}
                <div className={cn("p-4 border-b border-border", collapsed && !isMobile && "px-2")}>
                  {(!collapsed || isMobile) ? (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Package className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-display font-bold text-sm text-foreground truncate">Lahore Textile Mills</p>
                        <p className="text-xs text-muted-foreground font-body">Verified Seller ✅</p>
                      </div>
                      <Button variant="ghost" size="sm" className="ml-auto shrink-0 h-8 w-8 p-0" onClick={() => setSidebarOpen(false)}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Package className="h-5 w-5 text-primary" />
                      </div>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setSidebarOpen(true)}>
                        <Menu className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Nav items */}
                <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
                  {sidebarItems.map(({ icon: Icon, label, value }) => (
                    <button
                      key={value}
                      onClick={() => handleNavClick(value)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body transition-colors",
                        activeTab === value
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground",
                        collapsed && !isMobile && "justify-center px-0"
                      )}
                    >
                      <Icon className={cn("h-5 w-5 shrink-0", value === "disputes" && activeDisputeCount > 0 && "text-destructive")} />
                      {(!collapsed || isMobile) && (
                        <>
                          <span className="truncate">{label}</span>
                          {value === "disputes" && activeDisputeCount > 0 && (
                            <span className="ml-auto bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center shrink-0">
                              {activeDisputeCount}
                            </span>
                          )}
                        </>
                      )}
                    </button>
                  ))}
                </nav>
              </aside>
            </>
          )}

          {/* Main content */}
          <main className="flex-1 min-w-0">
            <div className="p-4 sm:p-6 lg:p-8">
              {/* Mobile header */}
              {isMobile && (
                <div className="flex items-center gap-3 mb-6">
                  <Button variant="outline" size="sm" className="h-9 w-9 p-0" onClick={() => setSidebarOpen(true)}>
                    <Menu className="h-5 w-5" />
                  </Button>
                  <div>
                    <h1 className="font-display font-bold text-xl text-foreground">Seller Dashboard</h1>
                    <p className="text-xs text-muted-foreground font-body">Lahore Textile Mills</p>
                  </div>
                </div>
              )}
              {!isMobile && collapsed && (
                <div className="flex items-center gap-3 mb-6">
                  <Button variant="outline" size="sm" className="h-9 w-9 p-0" onClick={() => setSidebarOpen(true)}>
                    <Menu className="h-5 w-5" />
                  </Button>
                  <h1 className="font-display font-bold text-xl text-foreground">Seller Dashboard</h1>
                </div>
              )}
              {!isMobile && !collapsed && (
                <div className="mb-6">
                  <h1 className="font-display font-bold text-2xl text-foreground">Seller Dashboard</h1>
                </div>
              )}

              {onboardingData?.profile_status === "pending" && (
                <div className="rounded-xl border border-primary/20 bg-primary/10 p-4 mb-6 text-sm text-primary">
                  Your seller profile is under review by admin. You can still add products from your dashboard, but they will appear on the marketplace once approved.
                </div>
              )}

              {/* Onboarding Banner */}
              {!onboardingComplete && (
                <OnboardingBanner completedSteps={completedSteps} totalSteps={totalSteps} />
              )}

              {/* Supplier Profile */}
              {activeTab === "profile" && (
                <div className="space-y-6">
                  {/* Cover Photo */}
                  <div className="relative rounded-xl overflow-hidden border border-border bg-card">
                    <div className="h-48 sm:h-64 bg-gradient-hero relative group">
                      {coverPhoto && (
                        <img src={coverPhoto} alt="Cover" className="w-full h-full object-cover absolute inset-0" />
                      )}
                      <label className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-colors cursor-pointer">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 bg-card/90 backdrop-blur-sm text-foreground px-4 py-2 rounded-lg font-body text-sm">
                          <Camera className="h-4 w-4" />
                          {coverPhoto ? "Change Cover Photo" : "Upload Cover Photo"}
                        </div>
                        <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
                      </label>
                    </div>

                    {/* Logo / Avatar */}
                    <div className="px-6 pb-6 pt-4">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <label className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl border-4 border-card bg-accent flex items-center justify-center cursor-pointer group shrink-0 overflow-hidden shadow-lg">
                          {logoPhoto ? (
                            <img src={logoPhoto} alt="Logo" className="w-full h-full object-cover" />
                          ) : (
                            <Store className="h-10 w-10 text-primary" />
                          )}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition-colors">
                            <ImagePlus className="h-5 w-5 text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                        </label>
                        <div className="flex-1 pb-1">
                          <h2 className="font-display font-bold text-xl text-foreground">{profileData.businessName}</h2>
                          <p className="text-sm text-muted-foreground font-body">{profileData.tagline}</p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground font-body">
                            <MapPin className="h-3 w-3" />{profileData.city}, {profileData.province}
                            <span className="text-border">•</span>
                            Est. {profileData.established}
                          </div>
                        </div>
                        <Button
                          variant={profileEditing ? "default" : "outline"}
                          className="gap-2 font-body shrink-0"
                          onClick={() => {
                            if (profileEditing) handleProfileSave();
                            else { setProfileDraft(profileData); setProfileEditing(true); }
                          }}
                        >
                          {profileEditing ? <><Save className="h-4 w-4" />Save Profile</> : <><Edit className="h-4 w-4" />Edit Profile</>}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* About & Details */}
                    <div className="lg:col-span-2 space-y-6">
                      <div className="bg-card rounded-xl border border-border p-6">
                        <h3 className="font-display font-bold text-sm text-foreground mb-4">About</h3>
                        {profileEditing ? (
                          <Textarea
                            value={profileDraft.about}
                            onChange={(e) => setProfileDraft(prev => ({ ...prev, about: e.target.value }))}
                            rows={6}
                            className="font-body text-sm"
                          />
                        ) : (
                          <p className="font-body text-sm text-muted-foreground whitespace-pre-line leading-relaxed">{profileData.about}</p>
                        )}
                      </div>

                      <div className="bg-card rounded-xl border border-border p-6">
                        <h3 className="font-display font-bold text-sm text-foreground mb-4">Business Details</h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                          {[
                            { label: "Business Name", key: "businessName" as const },
                            { label: "Tagline", key: "tagline" as const },
                            { label: "City", key: "city" as const },
                            { label: "Province", key: "province" as const },
                            { label: "Phone", key: "phone" as const },
                            { label: "Email", key: "email" as const },
                            { label: "Website", key: "website" as const },
                            { label: "Established", key: "established" as const },
                            { label: "Employees", key: "employees" as const },
                          ].map((field) => (
                            <div key={field.key}>
                              <label className="text-xs font-display font-semibold text-muted-foreground uppercase tracking-wider">{field.label}</label>
                              {profileEditing ? (
                                <Input
                                  value={profileDraft[field.key]}
                                  onChange={(e) => setProfileDraft(prev => ({ ...prev, [field.key]: e.target.value }))}
                                  className="mt-1 font-body text-sm"
                                />
                              ) : (
                                <p className="font-body text-sm text-foreground mt-1">{profileData[field.key]}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                      <div className="bg-card rounded-xl border border-border p-6">
                        <h3 className="font-display font-bold text-sm text-foreground mb-4">Categories</h3>
                        <div className="flex flex-wrap gap-2">
                          {profileData.categories.map((cat) => (
                            <Badge key={cat} variant="secondary" className="font-body text-xs">{cat}</Badge>
                          ))}
                        </div>
                      </div>

                      <div className="bg-card rounded-xl border border-border p-6">
                        <h3 className="font-display font-bold text-sm text-foreground mb-4">Quick Stats</h3>
                        <div className="space-y-3">
                          {[
                            { label: "Rating", value: "4.8/5 ⭐" },
                            { label: "Orders Completed", value: "1,240" },
                            { label: "On-time Delivery", value: "97%" },
                            { label: "Response Time", value: "< 2 hours" },
                          ].map((s) => (
                            <div key={s.label} className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground font-body">{s.label}</span>
                              <span className="font-display font-bold text-sm text-foreground">{s.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-card rounded-xl border border-border p-6">
                        <h3 className="font-display font-bold text-sm text-foreground mb-3">Profile Preview</h3>
                        <Link to="/seller/seller-1">
                          <Button variant="outline" className="w-full gap-2 font-body text-sm"><Eye className="h-4 w-4" />View Public Profile</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Overview */}
              {activeTab === "overview" && (
                <>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {stats.map(({ icon: Icon, label, value, change, up }) => (
                      <div key={label} className="bg-card rounded-xl border border-border p-5">
                        <div className="flex items-center justify-between mb-3">
                          <div className="p-2 rounded-lg bg-accent"><Icon className="h-5 w-5 text-primary" /></div>
                          <span className={`flex items-center gap-0.5 text-xs font-semibold ${up ? "text-success" : "text-destructive"}`}>
                            {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}{change}
                          </span>
                        </div>
                        <div className="font-display font-bold text-xl text-foreground">{value}</div>
                        <div className="text-xs text-muted-foreground font-body">{label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-card rounded-xl border border-border p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-display font-bold text-xl text-foreground">Recent Orders</h2>
                      <Button variant="outline" size="sm" className="font-body" onClick={() => setActiveTab("orders")}>View All</Button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-3 px-2 font-display font-semibold text-muted-foreground">Order ID</th>
                            <th className="text-left py-3 px-2 font-display font-semibold text-muted-foreground">Product</th>
                            <th className="text-left py-3 px-2 font-display font-semibold text-muted-foreground hidden sm:table-cell">Buyer</th>
                            <th className="text-left py-3 px-2 font-display font-semibold text-muted-foreground">Total</th>
                            <th className="text-left py-3 px-2 font-display font-semibold text-muted-foreground">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sellerOrders.slice(0, 5).map((order) => (
                            <tr key={order.id} className="border-b border-border last:border-0 hover:bg-accent/30">
                              <td className="py-3 px-2 font-body font-medium text-foreground">{order.order_number}</td>
                              <td className="py-3 px-2 font-body text-foreground">{order.order_items?.map(i => i.product_name_snapshot).join(", ") || "Order"}</td>
                              <td className="py-3 px-2 font-body text-muted-foreground hidden sm:table-cell">{order.buyer?.full_name || "Buyer"}</td>
                              <td className="py-3 px-2 font-display font-semibold text-foreground">PKR {order.total_amount.toLocaleString()}</td>
                              <td className="py-3 px-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[order.status] || "bg-muted text-muted-foreground"}`}>{order.status}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}

              {/* Products */}
              {activeTab === "products" && !productFormView && (
                <div className="bg-card rounded-xl border border-border p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                    <h2 className="font-display font-bold text-xl text-foreground">My Products ({myProducts.length})</h2>
                    <Button onClick={() => { setEditingProduct(null); setProductFormView(true); }} className="bg-gradient-hero text-primary-foreground hover:opacity-90 gap-2 font-body w-full sm:w-auto"><Plus className="h-4 w-4" /> Add Product</Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {myProducts.map((product) => {
                      const statusColors: Record<string, string> = {
                        active: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
                        pending_review: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
                        rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
                        draft: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
                      };
                      return (
                        <div key={product.id} className="border border-border rounded-lg p-4 hover:shadow-md transition">
                          <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-lg mb-3" />
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-display font-semibold text-sm text-foreground truncate">{product.name}</h3>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase shrink-0 ml-2 ${statusColors[product.status || "draft"] || statusColors.draft}`}>
                              {(product.status || "draft").replace("_", " ")}
                            </span>
                          </div>
                          <p className="text-primary font-display font-bold text-sm mt-1">PKR {product.minPrice} - {product.maxPrice}</p>
                          <p className="text-xs text-muted-foreground font-body">MOQ: {product.moq} {product.unit}</p>
                          
                          {product.status === "rejected" && product.rejection_reason && (
                            <div className="mt-2 p-2 rounded-lg bg-destructive/10 border border-destructive/20">
                              <p className="text-[10px] font-semibold text-destructive uppercase mb-0.5">Admin Feedback:</p>
                              <p className="text-xs text-destructive">{product.rejection_reason}</p>
                            </div>
                          )}

                          <div className="flex gap-2 mt-3">
                            <Link to={`/product/${product.id}`}>
                              <Button variant="outline" size="sm" className="gap-1 font-body"><Eye className="h-3 w-3" /> View</Button>
                            </Link>
                            <Button variant="outline" size="sm" className="gap-1 font-body" onClick={() => { setEditingProduct(product); setProductFormView(true); }}>
                              <Edit className="h-3 w-3" /> {product.status === "rejected" ? "Edit & Resubmit" : "Edit"}
                            </Button>
                            <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDeleteProduct(product.id)}><Trash2 className="h-3 w-3" /></Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Product Form — inline */}
              {activeTab === "products" && productFormView && (
                <InlineProductForm
                  product={editingProduct}
                  onSave={(data) => { handleSaveProduct(data); setProductFormView(false); }}
                  onCancel={() => { setProductFormView(false); setEditingProduct(null); }}
                />
              )}

              {/* Orders */}
              {activeTab === "orders" && !selectedOrder && (
                <div className="bg-card rounded-xl border border-border p-6">
                  <h2 className="font-display font-bold text-xl text-foreground mb-6">All Orders</h2>
                  <div className="space-y-3">
                    {sellerOrders.length === 0 && <p className="text-muted-foreground font-body text-sm py-8 text-center">No orders yet.</p>}
                    {sellerOrders.map((order) => {
                      const icons: Record<string, typeof Clock> = { pending: Clock, processing: Package, shipped: Truck, delivered: CheckCircle };
                      const StatusIcon = icons[order.status] || Clock;
                      return (
                        <div
                          key={order.id}
                          onClick={() => setSelectedOrder(order)}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border border-border hover:bg-accent/30 hover:shadow-sm transition-all cursor-pointer"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`p-2 rounded-lg shrink-0 ${statusColors[order.status] || "bg-muted text-muted-foreground"}`}>
                              <StatusIcon className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-display font-bold text-sm text-foreground">{order.order_number}</span>
                                <Badge className={`text-[10px] capitalize border ${statusColors[order.status] || ""}`} variant="outline">{order.status}</Badge>
                              </div>
                              <p className="font-body text-sm text-foreground truncate">{order.order_items?.map(i => i.product_name_snapshot).join(", ") || "Order"}</p>
                              <p className="text-xs text-muted-foreground font-body">{order.buyer?.full_name || "Buyer"} • {new Date(order.created_at).toLocaleDateString("en-PK")}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="font-display font-bold text-sm text-foreground">PKR {order.total_amount.toLocaleString()}</span>
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Order Detail — full inline page */}
              {activeTab === "orders" && selectedOrder && (() => {
                const steps = ["pending", "confirmed", "processing", "packed", "shipped", "in_transit", "delivered"];
                const currentIdx = steps.indexOf(selectedOrder.status);
                const nextStatus = currentIdx < steps.length - 1 ? steps[currentIdx + 1] : null;
                const nextLabels: Record<string, string> = { confirmed: "Confirm Order", processing: "Mark Processing", packed: "Mark Packed", shipped: "Mark Shipped", in_transit: "Mark In Transit", delivered: "Mark Delivered" };
                const shippingAddr = selectedOrder.shipping_address_snapshot as Record<string, string> | null;

                return (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" className="shrink-0" onClick={() => setSelectedOrder(null)}>
                          <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                          <div className="flex items-center gap-3">
                            <h2 className="font-display font-bold text-2xl text-foreground">{selectedOrder.order_number}</h2>
                            <Badge variant="outline" className={`capitalize text-sm ${statusColors[selectedOrder.status] || ""}`}>{selectedOrder.status}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground font-body mt-0.5">{selectedOrder.order_items?.map(i => i.product_name_snapshot).join(", ")} — {selectedOrder.buyer?.full_name || "Buyer"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {nextStatus && (
                          <Button
                            className="bg-gradient-hero text-primary-foreground hover:opacity-90 font-display font-semibold gap-2"
                            onClick={() => {
                              updateOrderStatus.mutate({ orderId: selectedOrder.id, status: nextStatus }, {
                                onSuccess: () => {
                                  setSelectedOrder({ ...selectedOrder, status: nextStatus });
                                  toast.success(`Order ${selectedOrder.order_number} updated to ${nextStatus}`);
                                }
                              });
                            }}
                          >
                            <CheckCircle className="h-4 w-4" />
                            {nextLabels[nextStatus] || nextStatus}
                          </Button>
                        )}
                        <Badge variant="outline" className="text-xs capitalize px-3 py-1.5">{selectedOrder.payment_status} payment</Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2 space-y-6">
                        <div className="bg-card rounded-xl border border-border p-6">
                          <h3 className="font-display font-bold text-lg text-foreground mb-4">Order Details</h3>
                          {selectedOrder.order_items?.map(item => (
                            <div key={item.id} className="bg-accent/30 rounded-lg p-4 mb-3">
                              <p className="text-xs text-muted-foreground font-body mb-1">Product</p>
                              <p className="font-body font-semibold text-foreground text-lg">{item.product_name_snapshot} x{item.quantity}</p>
                              <p className="font-display font-bold text-xl text-foreground mt-1">PKR {item.total_price.toLocaleString()}</p>
                            </div>
                          ))}
                          <div className="flex justify-between mt-3 pt-3 border-t border-border">
                            <span className="font-body text-muted-foreground">Total</span>
                            <span className="font-display font-bold text-2xl text-foreground">PKR {selectedOrder.total_amount.toLocaleString()}</span>
                          </div>
                          <p className="text-sm text-muted-foreground font-body mt-4">Order placed on <span className="text-foreground font-medium">{new Date(selectedOrder.created_at).toLocaleDateString("en-PK", { day: "numeric", month: "long", year: "numeric" })}</span></p>
                        </div>

                        <div className="bg-card rounded-xl border border-border p-6">
                          <h3 className="font-display font-bold text-lg text-foreground mb-4">Buyer Details</h3>
                          <div className="grid sm:grid-cols-2 gap-4 text-sm font-body">
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/20"><User className="h-4 w-4 text-muted-foreground shrink-0" /><div><p className="text-xs text-muted-foreground">Name</p><p className="text-foreground font-medium">{selectedOrder.buyer?.full_name || "—"}</p></div></div>
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/20"><Mail className="h-4 w-4 text-muted-foreground shrink-0" /><div><p className="text-xs text-muted-foreground">Email</p><p className="text-foreground font-medium">{selectedOrder.buyer?.email || "—"}</p></div></div>
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/20"><Phone className="h-4 w-4 text-muted-foreground shrink-0" /><div><p className="text-xs text-muted-foreground">Phone</p><p className="text-foreground font-medium">{shippingAddr?.phone || "—"}</p></div></div>
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/20"><MapPin className="h-4 w-4 text-muted-foreground shrink-0" /><div><p className="text-xs text-muted-foreground">Address</p><p className="text-foreground font-medium">{shippingAddr ? `${shippingAddr.address_line1 || ""}, ${shippingAddr.city || ""}` : "—"}</p></div></div>
                          </div>
                        </div>
                      </div>

                      {/* Sidebar — Timeline + Actions */}
                      <div className="space-y-6">
                        <div className="bg-card rounded-xl border border-border p-6">
                          <h3 className="font-display font-bold text-sm text-foreground mb-4">Order Timeline</h3>
                          <div className="space-y-4 pl-3 border-l-2 border-border">
                            {(["pending", "processing", "shipped", "delivered"] as const).map((step, i) => {
                              const done = i <= currentIdx;
                              const isCurrent = i === currentIdx;
                              const icons: Record<string, typeof Clock> = { pending: Clock, processing: Package, shipped: Truck, delivered: CheckCircle };
                              const StepIcon = icons[step];
                              return (
                                <div key={step} className="flex items-center gap-3 relative">
                                  <div className={`absolute -left-[19px] w-3 h-3 rounded-full border-2 ${done ? "bg-primary border-primary" : "bg-card border-border"} ${isCurrent ? "ring-2 ring-primary/30" : ""}`} />
                                  <StepIcon className={`h-4 w-4 ${done ? "text-primary" : "text-muted-foreground/40"}`} />
                                  <span className={`text-sm font-body capitalize ${done ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                                    {step}
                                    {isCurrent && <span className="text-xs text-primary ml-2">(Current)</span>}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div className="bg-card rounded-xl border border-border p-6 space-y-3">
                          <h3 className="font-display font-bold text-sm text-foreground mb-2">Quick Actions</h3>
                          <Link to="/messages" className="block">
                            <Button variant="outline" className="w-full gap-2 font-body"><MessageSquare className="h-4 w-4" />Message Buyer</Button>
                          </Link>
                          <Link to={`/order/${selectedOrder.id}`} className="block">
                            <Button variant="outline" className="w-full gap-2 font-body"><Eye className="h-4 w-4" />Full Order Tracking</Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* RFQ Marketplace */}
              {activeTab === "rfqs" && (
                <>
                  <div className="bg-card rounded-xl border border-border p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                      <h2 className="font-display font-bold text-xl text-foreground">RFQ Marketplace ({filteredRFQs.length})</h2>
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="relative w-full sm:w-48">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input value={rfqSearch} onChange={(e) => setRfqSearch(e.target.value)} placeholder="Search RFQs..." className="pl-9 w-full" />
                        </div>
                        <Select value={rfqCategoryFilter} onValueChange={setRfqCategoryFilter}>
                          <SelectTrigger className="w-full sm:w-44">
                            <Filter className="h-3.5 w-3.5 mr-1" />
                            <SelectValue placeholder="Category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {rfqCategories.map((cat) => (
                              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select value={rfqSortBy} onValueChange={setRfqSortBy}>
                          <SelectTrigger className="w-full sm:w-40">
                            <SlidersHorizontal className="h-3.5 w-3.5 mr-1" />
                            <SelectValue placeholder="Sort by" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="newest">Newest First</SelectItem>
                            <SelectItem value="deadline">Deadline (Urgent)</SelectItem>
                            <SelectItem value="budget_high">Budget (High)</SelectItem>
                            <SelectItem value="bids_low">Fewest Bids</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {filteredRFQs.length === 0 ? (
                      <div className="text-center py-12">
                        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground font-body">No RFQs match your filters</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredRFQs.map((rfq) => (
                          <div
                            key={rfq.id}
                            className="border border-border rounded-xl p-5 hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer group"
                            onClick={() => { setDetailRFQ(rfq); setRfqDetailOpen(true); }}
                          >
                            {rfq.image_urls && rfq.image_urls.length > 0 && (
                              <div className="mb-3 rounded-lg overflow-hidden">
                                <img src={rfq.image_urls[0]} alt={rfq.title} className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300" />
                              </div>
                            )}
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="secondary" className="font-body text-xs">{rfq.category?.name || "General"}</Badge>
                              <Badge className="bg-success/10 text-success border border-success/20 font-body text-xs">Active</Badge>
                              {rfq.deadline && <span className="ml-auto text-xs text-muted-foreground font-body">{new Date(rfq.deadline).toLocaleDateString("en-PK")}</span>}
                            </div>
                            <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors">{rfq.title}</h3>
                            <p className="text-sm text-muted-foreground font-body mt-1 line-clamp-2">{rfq.description}</p>
                            <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-border">
                              <div className="text-center">
                                <p className="text-xs text-muted-foreground font-body">Quantity</p>
                                <p className="font-display font-bold text-xs text-foreground">{rfq.quantity.toLocaleString()} {rfq.unit}</p>
                              </div>
                              <div className="text-center">
                                <p className="text-xs text-muted-foreground font-body">Budget</p>
                                <p className="font-display font-bold text-xs text-foreground">{rfq.budget_max ? `PKR ${(rfq.budget_max / 1000000).toFixed(1)}M` : "—"}</p>
                              </div>
                              <div className="text-center">
                                <p className="text-xs text-muted-foreground font-body">Bids</p>
                                <p className="font-display font-bold text-xs text-primary">{rfq.rfq_responses?.length || 0}</p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between mt-3 pt-2 border-t border-border">
                              <p className="text-xs text-muted-foreground font-body flex items-center gap-1">
                                <MapPin className="h-3 w-3" /> {rfq.buyer?.full_name || "Buyer"}
                              </p>
                              <Button
                                size="sm"
                                className="bg-gradient-hero text-primary-foreground hover:opacity-90 font-body text-xs gap-1"
                                onClick={(e) => { e.stopPropagation(); setSelectedRFQ(rfq); setBidFormOpen(true); }}
                              >
                                Submit Bid
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <SubmitBidForm open={bidFormOpen} onOpenChange={setBidFormOpen} rfq={selectedRFQ} />
                  <RFQDetailDialog
                    open={rfqDetailOpen}
                    onOpenChange={setRfqDetailOpen}
                    rfq={detailRFQ}
                    mode="seller"
                    onSubmitBid={() => { setRfqDetailOpen(false); setSelectedRFQ(detailRFQ); setBidFormOpen(true); }}
                  />
                </>
              )}

              {/* Messages — inline chat */}
              {activeTab === "messages" && (
                <div className="bg-card rounded-xl border border-border overflow-hidden flex" style={{ height: "calc(100vh - 200px)" }}>
                  {/* Conversation list */}
                  <div className={`w-full md:w-72 lg:w-80 border-r border-border flex flex-col ${!showMobileChatList ? "hidden md:flex" : "flex"}`}>
                    <div className="p-3 border-b border-border">
                      <h3 className="font-display font-bold text-sm text-foreground mb-2">Messages</h3>
                      <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                        <Input placeholder="Search..." className="pl-8 h-8 text-xs font-body" />
                      </div>
                    </div>
                    <ScrollArea className="flex-1">
                      {conversations.map((conv: any) => {
                        const otherName = conv.participant_1_profile?.full_name || conv.participant_2_profile?.full_name || "User";
                        return (
                          <button
                            key={conv.id}
                            onClick={() => { setSelectedChat(conv.id); setShowMobileChatList(false); }}
                            className={`w-full flex items-start gap-2.5 p-3 hover:bg-accent/50 transition text-left border-b border-border ${selectedChat === conv.id ? "bg-accent" : ""}`}
                          >
                            <Avatar className="h-9 w-9">
                              <AvatarFallback className="bg-primary/10 text-primary font-display font-bold text-xs">
                                {otherName.split(" ").map((w: string) => w[0]).join("").slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="font-display font-semibold text-xs text-foreground truncate">{otherName}</span>
                                <span className="text-[10px] text-muted-foreground font-body ml-1">{conv.last_message_at ? new Date(conv.last_message_at).toLocaleDateString("en-PK") : ""}</span>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                      {conversations.length === 0 && (
                        <p className="text-xs text-muted-foreground text-center py-6">No conversations</p>
                      )}
                    </ScrollArea>
                  </div>

                  {/* Chat area */}
                  <div className={`flex-1 flex flex-col ${showMobileChatList ? "hidden md:flex" : "flex"}`}>
                    {selectedChat && currentContact ? (
                      <>
                        <div className="flex items-center gap-2.5 p-3 border-b border-border">
                          <button className="md:hidden" onClick={() => setShowMobileChatList(true)}><ArrowLeft className="h-4 w-4" /></button>
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary/10 text-primary font-display font-bold text-xs">
                              {(currentContact.participant_1_profile?.full_name || currentContact.participant_2_profile?.full_name || "U").charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h3 className="font-display font-semibold text-sm text-foreground">{currentContact.participant_1_profile?.full_name || currentContact.participant_2_profile?.full_name || "User"}</h3>
                          </div>
                        </div>
                        <ScrollArea className="flex-1 p-4">
                          <div className="space-y-3 max-w-2xl mx-auto">
                            {currentMessages.map((msg: any) => {
                              const isOwn = msg.sender_id === currentContact.participant_1 || false;
                              return (
                                <div key={msg.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                                  <div className={`max-w-[75%] rounded-2xl px-3.5 py-2 ${isOwn ? "bg-primary text-primary-foreground rounded-br-md" : "bg-accent text-foreground rounded-bl-md"}`}>
                                    <p className="text-sm font-body">{msg.content}</p>
                                    <p className={`text-[10px] mt-0.5 ${isOwn ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </ScrollArea>
                        <div className="p-3 border-t border-border">
                          <div className="flex items-center gap-2 max-w-2xl mx-auto">
                            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0"><Paperclip className="h-3.5 w-3.5" /></Button>
                            <Input
                              value={newMessage}
                              onChange={(e) => setNewMessage(e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && handleChatSend()}
                              placeholder="Type a message..."
                              className="font-body h-8 text-sm"
                            />
                            <Button onClick={handleChatSend} size="icon" className="bg-gradient-hero text-primary-foreground h-8 w-8 shrink-0 hover:opacity-90">
                              <Send className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex-1 flex items-center justify-center text-muted-foreground font-body text-sm">
                        Select a conversation
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Disputes */}
              {activeTab === "disputes" && (
                <>
                  <div className="bg-card rounded-xl border border-border p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-display font-bold text-xl text-foreground">Disputes Against You</h2>
                      {activeDisputeCount > 0 && (
                        <Badge variant="destructive" className="font-body">{activeDisputeCount} needs response</Badge>
                      )}
                    </div>
                    {sellerDisputes.length === 0 ? (
                      <div className="text-center py-12">
                        <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground font-body">No disputes raised against you. Keep up the great work!</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {sellerDisputes.map((dispute) => (
                          <div key={dispute.id} className="border border-border rounded-lg p-5 hover:shadow-md transition">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="font-display font-bold text-foreground">{dispute.dispute_number}</span>
                                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${disputeStatusColors[dispute.status]}`}>
                                    {dispute.status.replace("_", " ")}
                                  </span>
                                  {dispute.status === "escalated" && (
                                    <Badge variant="destructive" className="text-[10px] font-body">Escalated to Admin</Badge>
                                  )}
                                </div>
                                <h3 className="font-display font-semibold text-foreground">Order {dispute.order?.order_number || dispute.order_id}</h3>
                                <p className="text-sm text-muted-foreground font-body mt-1">
                                  Buyer: {dispute.buyer?.full_name || "—"} • Reason: {dispute.reason}
                                </p>
                                <p className="text-sm text-muted-foreground font-body mt-1">{dispute.description}</p>
                                <p className="text-xs text-muted-foreground font-body mt-2">
                                  Opened: {new Date(dispute.created_at).toLocaleDateString("en-PK")} • Updated: {new Date(dispute.updated_at).toLocaleDateString("en-PK")}
                                </p>
                                {dispute.resolution && (
                                  <div className="mt-3 p-3 bg-success/10 rounded-lg border border-success/20">
                                    <p className="text-sm font-body text-success font-medium">Resolution: {dispute.resolution}</p>
                                  </div>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <Link to={`/dispute/${dispute.id}`}>
                                  <Button variant="outline" size="sm" className="font-body gap-1">
                                    <Eye className="h-3 w-3" /> View Chat
                                  </Button>
                                </Link>
                                {dispute.status !== "resolved" && dispute.status !== "closed" && (
                                  <Button
                                    size="sm"
                                    className="bg-gradient-hero text-primary-foreground hover:opacity-90 font-body gap-1"
                                    onClick={() => { setSelectedDispute(dispute); setRespondDialogOpen(true); }}
                                  >
                                    <Send className="h-3 w-3" /> Respond
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <Dialog open={respondDialogOpen} onOpenChange={setRespondDialogOpen}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="font-display">Respond to Dispute</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-body text-muted-foreground mb-1">Dispute response</p>
                          <p className="text-sm font-body text-muted-foreground mt-2 italic">Your response will be sent as a message in the dispute thread.</p>
                        </div>
                        <Textarea
                          placeholder="Write your response to the buyer..."
                          value={responseText}
                          onChange={(e) => setResponseText(e.target.value)}
                          rows={4}
                        />
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setRespondDialogOpen(false)} className="font-body">Cancel</Button>
                        <Button onClick={handleRespond} className="bg-gradient-hero text-primary-foreground hover:opacity-90 font-body gap-1">
                          <Send className="h-4 w-4" /> Send Response
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </>
              )}

              {/* Reviews */}
              {activeTab === "reviews" && (
                <div className="bg-card rounded-xl border border-border p-6">
                  <h2 className="font-display font-bold text-xl text-foreground mb-6">Customer Reviews</h2>
                  <div className="space-y-4">
                    {sellerReviewsData.length === 0 && <p className="text-muted-foreground font-body text-sm py-8 text-center">No reviews yet.</p>}
                    {sellerReviewsData.map((review) => (
                      <div key={review.id} className="border border-border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <span className="font-display font-semibold text-foreground">{review.buyer?.full_name || "Buyer"}</span>
                            <span className="text-xs text-muted-foreground font-body ml-2">on {review.product?.name || "Product"}</span>
                          </div>
                          <span className="text-xs text-muted-foreground font-body">{new Date(review.created_at).toLocaleDateString("en-PK")}</span>
                        </div>
                        <div className="flex gap-0.5 mb-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`h-4 w-4 ${i < review.rating ? "fill-warning text-warning" : "text-muted"}`} />
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground font-body">{review.comment || "—"}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Wallet */}
              {activeTab === "wallet" && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-card rounded-xl border border-border p-6">
                      <p className="text-sm text-muted-foreground font-body mb-1">Available Balance</p>
                      <p className="font-display font-bold text-2xl text-primary">PKR {(walletData?.balance || 0).toLocaleString()}</p>
                    </div>
                    <div className="bg-card rounded-xl border border-border p-6">
                      <p className="text-sm text-muted-foreground font-body mb-1">Total Withdrawn</p>
                      <p className="font-display font-bold text-2xl text-warning">PKR {(walletData?.total_withdrawn || 0).toLocaleString()}</p>
                    </div>
                    <div className="bg-card rounded-xl border border-border p-6">
                      <p className="text-sm text-muted-foreground font-body mb-1">Total Earned</p>
                      <p className="font-display font-bold text-2xl text-success">PKR {(walletData?.total_earned || 0).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="bg-card rounded-xl border border-border p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-display font-bold text-xl text-foreground">Recent Transactions</h2>
                      <Button className="bg-gradient-hero text-primary-foreground hover:opacity-90 font-body">Withdraw</Button>
                    </div>
                    <div className="space-y-3">
                      {walletTxData.length === 0 && <p className="text-muted-foreground font-body text-sm py-8 text-center">No transactions yet.</p>}
                      {walletTxData.map((tx) => (
                        <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                          <div>
                            <p className="font-body text-sm text-foreground">{tx.description || tx.type}</p>
                            <p className="text-xs text-muted-foreground font-body">{new Date(tx.created_at).toLocaleDateString("en-PK")}</p>
                          </div>
                          <span className={`font-display font-bold ${tx.type === "payment" || tx.type === "refund" ? "text-success" : "text-destructive"}`}>
                            {tx.type === "payout" || tx.type === "commission" ? "-" : "+"}PKR {Math.abs(tx.amount).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default SellerDashboard;

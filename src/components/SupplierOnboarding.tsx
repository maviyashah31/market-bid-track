import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  User, Package, CreditCard, FileText, Check, ChevronRight, ChevronLeft,
  Upload, Loader2, Building2, Phone, MapPin, ArrowRight, SkipForward,
} from "lucide-react";
import { toast } from "sonner";
import { useSupplierOnboarding, type OnboardingData } from "@/hooks/useSupplierOnboarding";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const steps = [
  { key: "profile", label: "Complete Profile", icon: User, description: "Set up your business profile" },
  { key: "products", label: "Add Products", icon: Package, description: "List at least one product" },
  { key: "payment", label: "Payment Terms", icon: CreditCard, description: "Accept payment terms" },
  { key: "documents", label: "Documents", icon: FileText, description: "Upload CNIC & NTN" },
] as const;

type StepKey = (typeof steps)[number]["key"];

interface SupplierOnboardingProps {
  onComplete?: () => void;
  initialStep?: StepKey;
}

const SupplierOnboarding = ({ onComplete, initialStep = "profile" }: SupplierOnboardingProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { data, loading, completedSteps, totalSteps, updateOnboarding, refetch } = useSupplierOnboarding();
  const [activeStep, setActiveStep] = useState<StepKey>(initialStep);
  const [saving, setSaving] = useState(false);

  // Profile form state
  const [profile, setProfile] = useState({
    business_name: data?.business_name || "",
    business_type: data?.business_type || "",
    business_address: data?.business_address || "",
    business_city: data?.business_city || "",
    business_province: data?.business_province || "",
    business_phone: data?.business_phone || "",
    whatsapp_number: data?.whatsapp_number || "",
    business_description: data?.business_description || "",
  });

  // Payment form state
  const [payment, setPayment] = useState({
    bank_name: data?.bank_name || "",
    account_title: data?.account_title || "",
    iban: data?.iban || "",
    accepted: false,
  });

  // Document upload state
  const [uploading, setUploading] = useState<string | null>(null);

  const stepCompleted = (key: StepKey): boolean => {
    if (!data) return false;
    switch (key) {
      case "profile": return data.profile_completed;
      case "products": return data.products_added;
      case "payment": return data.payment_terms_accepted;
      case "documents": return data.documents_uploaded;
    }
  };

  const handleSaveProfile = async () => {
    if (!profile.business_name || !profile.business_type || !profile.business_city || !profile.business_phone) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSaving(true);
    try {
      await updateOnboarding({
        ...profile,
        profile_completed: true,
        profile_status: "pending",
      } as Partial<OnboardingData>);
      toast.success("Profile saved successfully! Your details are sent for admin review.");
    } catch {
      toast.error("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleSkipProducts = async () => {
    toast.info("You can add products later from your dashboard.");
  };

  const handleMarkProductsAdded = async () => {
    setSaving(true);
    try {
      await updateOnboarding({ products_added: true } as Partial<OnboardingData>);
      toast.success("Products step marked complete!");
    } catch {
      toast.error("Failed to update. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleAcceptPaymentTerms = async () => {
    if (!payment.accepted) {
      toast.error("You must accept the payment terms to proceed.");
      return;
    }
    if (!payment.bank_name || !payment.account_title || !payment.iban) {
      toast.error("Please fill in your bank details.");
      return;
    }
    setSaving(true);
    try {
      await updateOnboarding({
        bank_name: payment.bank_name,
        account_title: payment.account_title,
        iban: payment.iban,
        payment_terms_accepted: true,
      } as Partial<OnboardingData>);
      toast.success("Payment terms accepted!");
    } catch {
      toast.error("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>, docType: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File must be under 5MB");
      return;
    }

    setUploading(docType);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const filePath = `${session.user.id}/${docType}-${Date.now()}.${file.name.split(".").pop()}`;
      const { error: uploadError } = await supabase.storage
        .from("supplier-documents")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("supplier-documents")
        .getPublicUrl(filePath);

      const urlField = `${docType}_url` as keyof OnboardingData;
      await updateOnboarding({ [urlField]: urlData.publicUrl } as Partial<OnboardingData>);
      toast.success(`${docType.replace(/_/g, " ")} uploaded successfully!`);
    } catch {
      toast.error("Upload failed. Please try again.");
    } finally {
      setUploading(null);
    }
  };

  const handleMarkDocumentsComplete = async () => {
    if (!data?.cnic_front_url || !data?.cnic_back_url || !data?.ntn_url) {
      toast.error("Please upload CNIC (front & back) and NTN certificate.");
      return;
    }
    setSaving(true);
    try {
      await updateOnboarding({ documents_uploaded: true } as Partial<OnboardingData>);
      toast.success("Documents submitted for verification!");
    } catch {
      toast.error("Failed to update. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleFinish = () => {
    if (onComplete) onComplete();
    else navigate("/seller/dashboard");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const progressPercent = (completedSteps / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-foreground mb-1">
            Welcome to <span className="text-primary">Bulkur</span>
          </h1>
          <p className="text-muted-foreground font-body">Complete your setup to start selling on Pakistan's #1 B2B marketplace.</p>
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-body text-muted-foreground">{completedSteps} of {totalSteps} steps complete</span>
              <span className="text-sm font-display font-semibold text-primary">{Math.round(progressPercent)}%</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        </div>

        <div className={cn("grid gap-6", isMobile ? "grid-cols-1" : "grid-cols-[240px_1fr]")}>
          {/* Step sidebar */}
          <div className={cn("space-y-2", isMobile && "flex gap-2 overflow-x-auto pb-2")}>
            {steps.map((step, idx) => {
              const completed = stepCompleted(step.key);
              const active = activeStep === step.key;
              return (
                <button
                  key={step.key}
                  onClick={() => setActiveStep(step.key)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all w-full",
                    isMobile && "min-w-[160px] flex-shrink-0",
                    active ? "bg-primary/10 border-2 border-primary" : "bg-card border border-border hover:border-primary/30",
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                    completed ? "bg-green-500 text-white" : active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                  )}>
                    {completed ? <Check className="h-4 w-4" /> : <step.icon className="h-4 w-4" />}
                  </div>
                  <div className="min-w-0">
                    <p className={cn("text-sm font-display font-semibold truncate", active ? "text-primary" : "text-foreground")}>
                      {step.label}
                    </p>
                    {!isMobile && (
                      <p className="text-xs text-muted-foreground font-body truncate">{step.description}</p>
                    )}
                  </div>
                  {completed && <Badge variant="outline" className="ml-auto text-green-600 border-green-300 text-[10px] flex-shrink-0">Done</Badge>}
                </button>
              );
            })}
          </div>

          {/* Step content */}
          <div className="bg-card rounded-xl border border-border p-6">

            {/* Step 1: Profile */}
            {activeStep === "profile" && (
              <div className="space-y-5">
                <div>
                  <h2 className="font-display font-bold text-xl text-foreground flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" /> Business Profile
                  </h2>
                  <p className="text-sm text-muted-foreground font-body mt-1">Tell us about your business so buyers can find you.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="font-body text-sm">Business Name *</Label>
                    <Input value={profile.business_name} onChange={(e) => setProfile(p => ({ ...p, business_name: e.target.value }))} placeholder="e.g. Lahore Textile Mills" className="mt-1" />
                  </div>
                  <div>
                    <Label className="font-body text-sm">Business Type *</Label>
                    <Select value={profile.business_type} onValueChange={(v) => setProfile(p => ({ ...p, business_type: v }))}>
                      <SelectTrigger className="mt-1"><SelectValue placeholder="Select type" /></SelectTrigger>
                      <SelectContent>
                        {["Manufacturer", "Wholesaler", "Distributor", "Trading Company", "Retailer"].map(t => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="sm:col-span-2">
                    <Label className="font-body text-sm">Business Address *</Label>
                    <Input value={profile.business_address} onChange={(e) => setProfile(p => ({ ...p, business_address: e.target.value }))} placeholder="Street address" className="mt-1" />
                  </div>
                  <div>
                    <Label className="font-body text-sm">City *</Label>
                    <Select value={profile.business_city} onValueChange={(v) => setProfile(p => ({ ...p, business_city: v }))}>
                      <SelectTrigger className="mt-1"><SelectValue placeholder="Select city" /></SelectTrigger>
                      <SelectContent>
                        {["Karachi", "Lahore", "Faisalabad", "Rawalpindi", "Islamabad", "Multan", "Sialkot", "Gujranwala", "Peshawar", "Quetta"].map(c => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="font-body text-sm">Province</Label>
                    <Select value={profile.business_province} onValueChange={(v) => setProfile(p => ({ ...p, business_province: v }))}>
                      <SelectTrigger className="mt-1"><SelectValue placeholder="Select province" /></SelectTrigger>
                      <SelectContent>
                        {["Punjab", "Sindh", "Khyber Pakhtunkhwa", "Balochistan", "Islamabad Capital Territory", "Gilgit-Baltistan", "Azad Kashmir"].map(p => (
                          <SelectItem key={p} value={p}>{p}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="font-body text-sm">Phone Number *</Label>
                    <Input value={profile.business_phone} onChange={(e) => setProfile(p => ({ ...p, business_phone: e.target.value }))} placeholder="+92 300 1234567" className="mt-1" />
                  </div>
                  <div>
                    <Label className="font-body text-sm">WhatsApp Number</Label>
                    <Input value={profile.whatsapp_number} onChange={(e) => setProfile(p => ({ ...p, whatsapp_number: e.target.value }))} placeholder="+92 300 1234567" className="mt-1" />
                  </div>
                  <div className="sm:col-span-2">
                    <Label className="font-body text-sm">Business Description</Label>
                    <Textarea value={profile.business_description} onChange={(e) => setProfile(p => ({ ...p, business_description: e.target.value }))} placeholder="Briefly describe what your business does, key products, and experience..." className="mt-1 min-h-[100px]" />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <Button variant="outline" onClick={() => setActiveStep("products")} className="font-body gap-1">
                    <SkipForward className="h-4 w-4" /> Skip for now
                  </Button>
                  <Button onClick={handleSaveProfile} disabled={saving} className="bg-gradient-hero text-primary-foreground font-display font-semibold gap-2">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                    Save Profile
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Products */}
            {activeStep === "products" && (
              <div className="space-y-5">
                <div>
                  <h2 className="font-display font-bold text-xl text-foreground flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" /> Add Your Products
                  </h2>
                  <p className="text-sm text-muted-foreground font-body mt-1">
                    List at least one product to start receiving orders. You can add more products from your dashboard later.
                  </p>
                </div>
                <div className="bg-accent/30 rounded-lg p-6 text-center">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="font-display font-semibold text-foreground mb-2">Add products from your dashboard</p>
                  <p className="text-sm text-muted-foreground font-body mb-4">
                    Go to your Seller Dashboard &gt; Products tab to add and manage your product catalog.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Button
                      onClick={() => { navigate("/seller/dashboard"); }}
                      className="bg-gradient-hero text-primary-foreground font-display font-semibold gap-2"
                    >
                      <ArrowRight className="h-4 w-4" /> Go to Products
                    </Button>
                    <Button variant="outline" onClick={handleMarkProductsAdded} disabled={saving} className="font-body gap-1">
                      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                      I've already added products
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between pt-2">
                  <Button variant="outline" onClick={() => setActiveStep("profile")} className="font-body gap-1">
                    <ChevronLeft className="h-4 w-4" /> Back
                  </Button>
                  <Button variant="outline" onClick={() => { handleSkipProducts(); setActiveStep("payment"); }} className="font-body gap-1">
                    Skip for now <SkipForward className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Payment Terms */}
            {activeStep === "payment" && (
              <div className="space-y-5">
                <div>
                  <h2 className="font-display font-bold text-xl text-foreground flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" /> Payment Terms
                  </h2>
                  <p className="text-sm text-muted-foreground font-body mt-1">Review our payment terms and provide your bank details for payouts.</p>
                </div>

                {/* Terms summary */}
                <div className="bg-accent/30 rounded-lg p-5 space-y-3">
                  <h3 className="font-display font-semibold text-foreground">Platform Payment Terms</h3>
                  <ul className="space-y-2 text-sm font-body text-muted-foreground">
                    <li className="flex items-start gap-2"><Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" /> All payments are held in secure escrow until buyer confirms delivery.</li>
                    <li className="flex items-start gap-2"><Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" /> Platform commission: 3-5% per transaction (varies by category).</li>
                    <li className="flex items-start gap-2"><Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" /> Payouts processed within 3-5 business days after delivery confirmation.</li>
                    <li className="flex items-start gap-2"><Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" /> Disputes are handled through our resolution center with fair mediation.</li>
                    <li className="flex items-start gap-2"><Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" /> Bank transfers via IBAN to your registered business account.</li>
                  </ul>
                </div>

                {/* Bank details */}
                <div className="space-y-4">
                  <h3 className="font-display font-semibold text-foreground">Bank Details for Payouts</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="font-body text-sm">Bank Name *</Label>
                      <Select value={payment.bank_name} onValueChange={(v) => setPayment(p => ({ ...p, bank_name: v }))}>
                        <SelectTrigger className="mt-1"><SelectValue placeholder="Select bank" /></SelectTrigger>
                        <SelectContent>
                          {["HBL", "UBL", "MCB", "Allied Bank", "Bank Alfalah", "Meezan Bank", "Faysal Bank", "Askari Bank", "Standard Chartered", "JS Bank", "Bank Al Habib"].map(b => (
                            <SelectItem key={b} value={b}>{b}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="font-body text-sm">Account Title *</Label>
                      <Input value={payment.account_title} onChange={(e) => setPayment(p => ({ ...p, account_title: e.target.value }))} placeholder="As shown on bank statement" className="mt-1" />
                    </div>
                    <div className="sm:col-span-2">
                      <Label className="font-body text-sm">IBAN Number *</Label>
                      <Input value={payment.iban} onChange={(e) => setPayment(p => ({ ...p, iban: e.target.value }))} placeholder="PK00XXXX0000000000000000" className="mt-1" maxLength={24} />
                    </div>
                  </div>
                </div>

                {/* Accept checkbox */}
                <div className="flex items-start gap-3 p-4 rounded-lg border border-border">
                  <Checkbox
                    id="accept-terms"
                    checked={payment.accepted}
                    onCheckedChange={(checked) => setPayment(p => ({ ...p, accepted: checked === true }))}
                  />
                  <label htmlFor="accept-terms" className="text-sm font-body text-foreground cursor-pointer">
                    I have read and accept the platform payment terms and conditions. I understand that Bulkur will charge a commission on each transaction and payouts will be made to my registered bank account.
                  </label>
                </div>

                <div className="flex justify-between pt-2">
                  <Button variant="outline" onClick={() => setActiveStep("products")} className="font-body gap-1">
                    <ChevronLeft className="h-4 w-4" /> Back
                  </Button>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setActiveStep("documents")} className="font-body gap-1">
                      Skip for now <SkipForward className="h-4 w-4" />
                    </Button>
                    <Button onClick={handleAcceptPaymentTerms} disabled={saving} className="bg-gradient-hero text-primary-foreground font-display font-semibold gap-2">
                      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                      Accept & Save
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Documents */}
            {activeStep === "documents" && (
              <div className="space-y-5">
                <div>
                  <h2 className="font-display font-bold text-xl text-foreground flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" /> Documentation & Verification
                  </h2>
                  <p className="text-sm text-muted-foreground font-body mt-1">
                    Upload your identity and business documents for verification. Files must be under 5MB (image or PDF).
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* CNIC Front */}
                  <div className="border border-border rounded-lg p-4">
                    <Label className="font-body text-sm font-semibold">CNIC Front *</Label>
                    <p className="text-xs text-muted-foreground mb-3">Upload front side of your CNIC</p>
                    {data?.cnic_front_url ? (
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-100 text-green-700 border-green-300">Uploaded</Badge>
                      </div>
                    ) : (
                      <label className="flex items-center gap-2 cursor-pointer">
                        <Button variant="outline" size="sm" className="font-body gap-1" asChild>
                          <span>
                            {uploading === "cnic_front" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                            Choose File
                          </span>
                        </Button>
                        <input type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => handleDocumentUpload(e, "cnic_front")} disabled={uploading !== null} />
                      </label>
                    )}
                  </div>

                  {/* CNIC Back */}
                  <div className="border border-border rounded-lg p-4">
                    <Label className="font-body text-sm font-semibold">CNIC Back *</Label>
                    <p className="text-xs text-muted-foreground mb-3">Upload back side of your CNIC</p>
                    {data?.cnic_back_url ? (
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-100 text-green-700 border-green-300">Uploaded</Badge>
                      </div>
                    ) : (
                      <label className="flex items-center gap-2 cursor-pointer">
                        <Button variant="outline" size="sm" className="font-body gap-1" asChild>
                          <span>
                            {uploading === "cnic_back" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                            Choose File
                          </span>
                        </Button>
                        <input type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => handleDocumentUpload(e, "cnic_back")} disabled={uploading !== null} />
                      </label>
                    )}
                  </div>

                  {/* NTN Certificate */}
                  <div className="border border-border rounded-lg p-4">
                    <Label className="font-body text-sm font-semibold">NTN Certificate *</Label>
                    <p className="text-xs text-muted-foreground mb-3">National Tax Number certificate</p>
                    {data?.ntn_url ? (
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-100 text-green-700 border-green-300">Uploaded</Badge>
                      </div>
                    ) : (
                      <label className="flex items-center gap-2 cursor-pointer">
                        <Button variant="outline" size="sm" className="font-body gap-1" asChild>
                          <span>
                            {uploading === "ntn" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                            Choose File
                          </span>
                        </Button>
                        <input type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => handleDocumentUpload(e, "ntn")} disabled={uploading !== null} />
                      </label>
                    )}
                  </div>

                  {/* Business Registration (optional) */}
                  <div className="border border-border rounded-lg p-4">
                    <Label className="font-body text-sm font-semibold">Business Registration <span className="text-muted-foreground font-normal">(Optional)</span></Label>
                    <p className="text-xs text-muted-foreground mb-3">Business registration certificate</p>
                    {data?.business_registration_url ? (
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-100 text-green-700 border-green-300">Uploaded</Badge>
                      </div>
                    ) : (
                      <label className="flex items-center gap-2 cursor-pointer">
                        <Button variant="outline" size="sm" className="font-body gap-1" asChild>
                          <span>
                            {uploading === "business_registration" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                            Choose File
                          </span>
                        </Button>
                        <input type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => handleDocumentUpload(e, "business_registration")} disabled={uploading !== null} />
                      </label>
                    )}
                  </div>
                </div>

                <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                  <p className="text-sm font-body text-amber-800 dark:text-amber-200">
                    After uploading, your documents will be marked as <strong>Pending Verification</strong>. Our team will review and verify your documents within 1-2 business days.
                  </p>
                </div>

                <div className="flex justify-between pt-2">
                  <Button variant="outline" onClick={() => setActiveStep("payment")} className="font-body gap-1">
                    <ChevronLeft className="h-4 w-4" /> Back
                  </Button>
                  <Button onClick={handleMarkDocumentsComplete} disabled={saving} className="bg-gradient-hero text-primary-foreground font-display font-semibold gap-2">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                    Submit Documents
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 flex justify-center">
          <Button
            variant="outline"
            onClick={handleFinish}
            className="font-body gap-2"
          >
            {completedSteps === totalSteps ? "Go to Dashboard" : "Skip setup & go to Dashboard"}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SupplierOnboarding;

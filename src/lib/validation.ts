import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");

export const emailSchema = z.string().email("Please enter a valid email address");

export const imageUrlSchema = z
  .string()
  .url("Please enter a valid URL")
  .refine((url) => url.startsWith("https://"), "URL must use HTTPS");

export const phoneSchema = z
  .string()
  .min(1, "Phone number is required")
  .regex(/^\+?[\d\s-]{7,15}$/, "Please enter a valid phone number");

export const shippingSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  company: z.string().optional(),
  phone: phoneSchema,
  email: emailSchema.optional().or(z.literal("")),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City is required"),
  state: z.string().optional(),
  zip: z.string().optional(),
  notes: z.string().max(500, "Notes must be under 500 characters").optional(),
});

export const rfqSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(200, "Title must be under 200 characters"),
  category: z.string().min(1, "Category is required"),
  quantity: z.string().min(1, "Quantity is required").regex(/^\d+$/, "Quantity must be a number"),
  description: z.string().min(20, "Description must be at least 20 characters").max(2000, "Description must be under 2000 characters"),
});

export const productSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters").max(200, "Name must be under 200 characters"),
  category: z.string().min(1, "Category is required"),
  minPrice: z.string().min(1, "Minimum price is required").regex(/^\d+(\.\d{1,2})?$/, "Enter a valid price"),
});

export function getPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: "Weak", color: "bg-red-500" };
  if (score <= 2) return { score, label: "Fair", color: "bg-orange-500" };
  if (score <= 3) return { score, label: "Good", color: "bg-yellow-500" };
  if (score <= 4) return { score, label: "Strong", color: "bg-green-500" };
  return { score, label: "Very Strong", color: "bg-emerald-500" };
}

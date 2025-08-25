// src/lib/schemas.ts
import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

// Schema for the main product details (Step 1)
export const productDetailsSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters"),
  brand: z.string().min(2, "Brand is required"),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  gender: z.enum(["Unisex", "Male", "Female"]),
  price: z.coerce.number().positive("Price must be a positive number"),
  newPrice: z.coerce
    .number()
    .positive("Sale price must be a positive number")
    .optional()
    .or(z.literal("")),
  image: z
    .any()
    .optional()
    .refine(
      (fileList) =>
        !fileList || !fileList[0] || fileList[0].size <= MAX_FILE_SIZE,
      `Max image size is 5MB.`
    )
    .refine(
      (fileList) =>
        !fileList ||
        !fileList[0] ||
        ACCEPTED_IMAGE_TYPES.includes(fileList[0].type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
});

// Schema for a single variant
export const variantSchema = z.object({
  color: z.string().min(1, "Color is required"),
  size: z.enum(["SM", "M", "L", "XL", "XXL", "3XL", "4XL"]),
  qte: z.coerce.number().int().min(0, "Quantity cannot be negative"),
  images: z.array(z.any()).optional(),
});

// Schema for the entire variants form (Step 2)
export const productVariantsSchema = z.object({
  variants: z.array(variantSchema).min(1, "You must add at least one variant"),
});

export type ProductDetailsValues = z.infer<typeof productDetailsSchema>;
export type ProductVariantsValues = z.infer<typeof productVariantsSchema>;
